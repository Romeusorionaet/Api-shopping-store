/* eslint-disable camelcase */

import axios from "axios";
import https from "https";
import { configEfiPay } from "./config-efi-pay";

export async function getAccessTokenEfiPay() {
  try {
    const data = JSON.stringify({ grant_type: "client_credentials" });
    const data_credentials = `${configEfiPay.client_id}:${configEfiPay.client_secret}`;
    const auth = Buffer.from(data_credentials).toString("base64");

    const response = await axios.post(configEfiPay.token_url, data, {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      httpsAgent: new https.Agent({
        pfx: configEfiPay.cert,
        passphrase: "",
      }),
    });

    return response.data.access_token;
  } catch (err) {
    console.log(err.message, "===");
    throw new Error("Erro ao obter o token de acesso: " + err);
  }
}

module.exports = {
  getAccessTokenEfiPay,
};
