import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const fullName = (formData.get("fullName") as string) || "";
    const email = (formData.get("email") as string) || "";
    const phone = (formData.get("phone") as string) || "";
    const role = (formData.get("role") as string) || "";
    const coverLetter = (formData.get("coverLetter") as string) || "";
    const cvFile = formData.get("cv") as File | null;

    if (!fullName || !email || !role) {
      return NextResponse.json(
        { error: "fullName, email, and role are required" },
        { status: 400 }
      );
    }

    if (!cvFile) {
      return NextResponse.json({ error: "CV file is required" }, { status: 400 });
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
      return NextResponse.json(
        {
          error:
            "Missing env vars. Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: String(SMTP_SECURE).toLowerCase() === "true", 
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // Convert File -> Buffer (Node runtime)
    const arrayBuffer = await cvFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const textBody = `
New Job Application Received

Role: ${role}
Name: ${fullName}
Email: ${email}
Phone: ${phone}

Cover Letter:
${coverLetter}
`.trim();

    const htmlBody = `
      <h2>New Job Application Received</h2>
      <p><strong>Role:</strong> ${escapeHtml(role)}</p>
      <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <hr />
      <p><strong>Cover Letter:</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(coverLetter)}</pre>
    `;

    await transporter.sendMail({
      from: MAIL_FROM,        
      to: MAIL_TO,            
      replyTo: email,         
      subject: `New Job Application: ${role} - ${fullName}`,
      text: textBody,
      html: htmlBody,
      attachments: [
        {
          filename: cvFile.name,
          content: buffer,
          contentType: cvFile.type || "application/octet-stream",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error: any) {
    console.error("Career email error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

function escapeHtml(input: string) {
  return (input || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
