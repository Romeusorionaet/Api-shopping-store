import { FastifyRequest, FastifyReply } from "fastify";
import path from "node:path";
import EfiPay from "sdk-typescript-apis-efi";
import { env } from "src/infra/env";
import { configEfiPay } from "src/infra/service/gateway-tokens/efi-pay/config-efi-pay";

/*
estou tendo o erro 
{
  nome: 'webhook_invalido',
  mensagem: 'A URL informada respondeu com o código HTTP 403'
}
Ao tentar configurar minha webhook, fazer um commit apenas para salvar essas config.
Pode funcionar se eu preencher o formulário que tem na documentação EFI para poder usar todo o processo em produçãoe em 
em fim poder cadastrar o webhook.
Em Homologação eu não posso usar webhook
*/

export async function configWebhook(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // const certPath = path.resolve(
  //   __dirname,
  //   `../../../../../certs/${env.EFI_CERTIFICATE}`,
  // );

  const body = {
    webhookUrl: "https://api.eidev.online/prod/webhook",
  };

  const params = {
    chave: "71cdf9ba-c695-4e3c-b010-abb521a3f1be",
  };

  try {
    const options = {
      sandbox: true,
      client_id: configEfiPay.client_id,
      client_secret: configEfiPay.client_secret,
      pix_cert: configEfiPay.cert,
    };

    const efipay = new EfiPay(options);

    await efipay.pixConfigWebhook(params, body);
  } catch (err) {
    console.log(err);
  }

  reply.status(200).send();
}
