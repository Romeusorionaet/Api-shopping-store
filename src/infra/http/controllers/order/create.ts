import { FastifyRequest, FastifyReply } from "fastify";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { OrderWithEmptyAddressError } from "src/domain/store/application/use-cases/errors/order-with-empty-address-error";
import { makePurchaseOrderUseCase } from "src/domain/store/application/use-cases/order/factory/make-purchase-order-use-case";
import { getAccessTokenEfiPay } from "src/infra/service/gateway-tokens/efi-pay/get-access-token-efi-pay";
import { z } from "zod";
import https from "https";
import { configEfiPay } from "src/infra/service/gateway-tokens/efi-pay/config-efi-pay";
import axios from "axios";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createOrderBodySchema = z.object({
    buyerId: z.string().uuid(),
    orderProducts: z.any(),
    // totalPrice: z.number(),
  });

  const { buyerId, orderProducts } = createOrderBodySchema.parse(request.body);

  const createOrderUseCase = makePurchaseOrderUseCase();

  const result = await createOrderUseCase.execute({
    buyerId,
    orderProducts,
  });

  if (result.isLeft()) {
    const err = result.value;
    switch (err.constructor) {
      case OrderWithEmptyAddressError:
        return reply.status(400).send({
          error: err.message,
        });

      case UserNotFoundError:
        return reply.status(400).send({
          error: err.message,
        });

      default:
        throw new Error(err.message);
    }
  }

  try {
    const httpsAgent = new https.Agent({
      pfx: configEfiPay.cert_path,
      passphrase: "",
    });

    const accessToken = await getAccessTokenEfiPay();

    const endpoint = "https://api-pix-h.gerencianet.com.br/v2/cob";

    const dataCob = {
      calendario: {
        expiracao: 3600,
      },
      valor: {
        // original: totalPrice,
        original: "100.00",
      },
      chave: "71cdf9ba-c695-4e3c-b010-abb521a3f1be",
      solicitacaoPagador: "Cobrança dos serviços prestados.",
    };

    const config = {
      httpsAgent,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const cobResponse = await axios.post(endpoint, dataCob, config);

    const qrCodeResponse = await axios.get(
      `https://api-pix-h.gerencianet.com.br/v2/loc/${cobResponse.data.loc.id}/qrcode`,
      config,
    );

    return reply.status(200).send(qrCodeResponse.data);
  } catch (err) {
    console.log(err, "err=======");
  }
}
