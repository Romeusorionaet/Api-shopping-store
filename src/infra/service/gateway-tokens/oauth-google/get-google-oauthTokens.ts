import qs from "qs";
import axios from "axios";
import { env } from "src/infra/env";

interface GoogleTokensResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export async function getGoogleOAuthTokens({
  code,
}: {
  code: string;
}): Promise<GoogleTokensResult> {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET_ID,
    redirect_uri: env.GOOGLE_CLIENT_REDIRECT_URL,
    grant_type: "authorization_code",
  };

  try {
    const res = await axios.post<GoogleTokensResult>(
      url,
      qs.stringify(values),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    return res.data;
  } catch (err) {
    throw new Error("Failed to fetch Google Oauth Tokens.");
  }
}
