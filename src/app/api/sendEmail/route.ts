import { NextResponse } from "next/server";
import formData from "form-data";
import Mailgun from "mailgun.js";

// Initialize Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!, // from .env.local
});

export async function POST(req: Request) {
  const { to, subject, text } = await req.json();

  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to,         // must be an authorized recipient in Mailgun
      subject,    // e.g., "Welcome!"
      text,       // or use html: "<p>Welcome!</p>"
    });

    console.log("✅ Email sent:", result);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return NextResponse.json({ success: false, error });
  }
}
