import { env } from "src/infra/env";
import nodemailer from "nodemailer";

interface Props {
  validationId: string;
  email: string;
}

export async function validationEmailWithNodeMailer({
  validationId,
  email,
}: Props) {
  const validationLinkUrl = `${env.CONFIRM_EMAIL_PAGE_STORE_URL_WEB}?token=${validationId}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: env.NODE_MAILER_EMAIL,
      pass: env.NODE_MAILER_PASS,
    },
  });

  const mailOptions = {
    from: env.NODE_MAILER_EMAIL,
    to: email,
    subject: "Verificação de Email",
    html: `<p>Clique no link a seguir para verificar seu email:</p><a href="${validationLinkUrl}">Verificar Email</a>`,
  };

  await transporter.sendMail(mailOptions);
}
