import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_SECURE,
      SMTP_USER,
      SMTP_PASS,
      MAIL_FROM,
      MAIL_TO,
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_FROM || !MAIL_TO) {
      console.error("Missing SMTP env vars");
      return NextResponse.json(
        {
          error:
            "Server configuration error (missing SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/MAIL_FROM/MAIL_TO).",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: String(SMTP_SECURE).toLowerCase() === "true", // true for 465
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const safeMessage = String(message || "");
    const safeName = String(name || "");
    const safeEmail = String(email || "");
    const safePhone = String(phone || "");

    const text = `
New Contact Enquiry Received!

Name: ${safeName}
Phone: ${safePhone || "N/A"}
Email: ${safeEmail}

Message:
${safeMessage}
`.trim();

    const html = `
      <h3>New Contact Enquiry Received!</h3>
      <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(safePhone || "N/A")}</p>
      <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
      <p><strong>Message:</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(safeMessage)}</pre>
    `;

    await transporter.sendMail({
      from: MAIL_FROM,     // website@sukan-m.com
      to: MAIL_TO,         // info@sukan-m.com
      replyTo: safeEmail,  // reply directly to the sender
      subject: `New Contact Enquiry from ${safeName}`,
      text,
      html,
    });

    return NextResponse.json({ success: true, message: "Message sent successfully!" });
  } catch (error: any) {
    console.error("Error sending contact email:", error);
    return NextResponse.json(
      { error: "Failed to send message", details: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

// Prevent HTML injection in email template
function escapeHtml(input: string) {
  return (input || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
