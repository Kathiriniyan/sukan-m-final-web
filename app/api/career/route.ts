import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    console.log("Career API call received");

    // 1. Verify Environment Variables
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error("Critical: SMTP credentials missing!");
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        // 2. Parse Form Data
        const formData = await req.formData();

        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const role = formData.get('role') as string;
        const coverLetter = formData.get('coverLetter') as string;
        const cvFile = formData.get('cv') as File | null;

        if (!cvFile) {
            return NextResponse.json({ error: 'CV file is required' }, { status: 400 });
        }

        // 3. Process the CV File for Attachment
        const arrayBuffer = await cvFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 4. Configure 
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.hostinger.com',
            port: Number(process.env.SMTP_PORT) || 465,
            secure: true, // True for port 465
            auth: {
                user: process.env.SMTP_USER, 
                pass: process.env.SMTP_PASS, //  password checking....
            },
        });

        // 5. Define Email Options
        const mailOptions = {
            from: `"Sukan Careers" <${process.env.SMTP_USER}>`, 
            to: process.env.RECEIVER_EMAIL || 'info@sukan-m.com', 
            replyTo: email, 
            subject: `New Job Application: ${role} - ${fullName}`,
            text: `
New Application Received!

Role: ${role}
Name: ${fullName}
Email: ${email}
Phone: ${phone}

Cover Letter:
${coverLetter}
            `,
            attachments: [
                {
                    filename: cvFile.name,
                    content: buffer
                }
            ]
        };

        // 6. Send Email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully from ${process.env.SMTP_USER} to ${process.env.RECEIVER_EMAIL}`);

        return NextResponse.json({ success: true, message: 'Application submitted successfully' });

    } catch (error: any) {
        console.error('Error processing application:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}