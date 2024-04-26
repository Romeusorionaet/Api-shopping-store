import fs from "fs";
import path from "path";
import { env } from "src/infra/env";

// const cert = fs.readFileSync(
//   path.resolve(__dirname, `../../../../../certs/${env.EFI_CERTIFICATE}`),
// );

export const configEfiPay = {
  client_id: env.EFI_CLIENT_KEY_ID,
  client_secret: env.EFI_SECRET_KEY,
  cert: env.EFI_CERTIFICATE,
  token_url: "https://openfinance-h.api.efipay.com.br/v1/oauth/token",
};

module.exports = { configEfiPay };
