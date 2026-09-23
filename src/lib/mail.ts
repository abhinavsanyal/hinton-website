import nodemailer from "nodemailer";
import { getServerEnv } from "@/env";
import { ApiError } from "@/lib/api";

export function mailer() {
  const env = getServerEnv();
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) throw new ApiError(503, "email_unavailable", "Email delivery is temporarily unavailable. Please email abhinava@hintonstudios.com directly.");
  return { from: env.SMTP_FROM || env.SMTP_USER, transport: nodemailer.createTransport({ host: env.SMTP_HOST, port: env.SMTP_PORT, secure: env.SMTP_PORT === 465, auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }, connectionTimeout: 10000, socketTimeout: 15000 }) };
}
export const studioRecipients = "abhinava@hintonstudios.com,avkash@hintonstudios.com,souvik@hintonstudios.com";
