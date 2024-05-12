import axios from "axios";

/* eslint-disable camelcase */
interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export async function getGoogleUser({
  id_token,
  access_token,
}: any): Promise<GoogleUserResult> {
  try {
    console.log("=entrou no getGoogleUser");
    const res = await axios.get<GoogleUserResult>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      },
    );
    console.log(res.data, "=====res");

    return res.data;
  } catch (err: any) {
    throw new Error(err.message);
  }
}
