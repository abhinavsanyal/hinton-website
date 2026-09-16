import { z } from "zod";
import nodemailer from "nodemailer";
import { getServerEnv } from "@/env";
import { ApiError, handle } from "@/lib/api";

const contactSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.email(),
  message: z.string().min(1).max(2000),
});

export const POST = handle(async (req) => {
  const input = contactSchema.parse(await req.json());
  
  // Try to get SMTP settings from environment variables
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const recipients = [
    "abhinava@hintonstudios.com",
    "avkash@hintonstudios.com",
    "souvik@hintonstudios.com"
  ].join(", ");

  if (smtpHost && smtpUser && smtpPass) {
    // Send using nodemailer
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Hinton Studios Website" <${smtpUser}>`,
        to: recipients,
        subject: `New Contact Request from ${input.name || input.email}`,
        text: `Name: ${input.name || 'Not provided'}\nEmail: ${input.email}\n\nMessage:\n${input.message}`,
        html: `<p><strong>Name:</strong> ${input.name || 'Not provided'}</p>
               <p><strong>Email:</strong> ${input.email}</p>
               <p><strong>Message:</strong><br/>${input.message.replace(/\n/g, '<br/>')}</p>`,
      });
    } catch (error) {
      console.error("[api/contact] Email send error:", error);
      throw new ApiError(500, "email_error", "Failed to deliver the message.");
    }
  } else {
    // No SMTP configured — log server-side
    console.log("[api/contact] Simulated submission (No SMTP configured):");
    console.log(`To: ${recipients}`);
    console.log("Payload:", input);
  }

  return { received: true };
});
