import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    try {
        // 1. Parse foem Data 
        const { name, phone, email, message } = await req.json();

        // 2. Validate Fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required fields.' },
                { status: 400 }
            );
        }

        // 3. Verify Environment Variables
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error("Missing SMTP_USER or SMTP_PASS environment variables");
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // 4. Configure 
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.hostinger.com',
            port: Number(process.env.SMTP_PORT) || 465,
            secure: true, 
            auth: {
                user: process.env.SMTP_USER, 
                pass: process.env.SMTP_PASS, 
            },
        });

        // 5. Define Email Options
        const mailOptions = {
            from: `"Sukan Contact" <${process.env.SMTP_USER}>`, 
            to: process.env.RECEIVER_EMAIL || 'info@sukan-m.com', 
            replyTo: email, 
            subject: `New Contact Enquiry from ${name}`,
            text: `
          New Contact Enquiry Received!
          
          Name: ${name}
          Phone: ${phone || 'N/A'}
          Email: ${email}
          
          Message:
          ${message}
        `,
            html: `
            <h3>New Contact Enquiry Received!</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            `
        };

        // 6. Send Email
        await transporter.sendMail(mailOptions);
        console.log(`Contact email sent successfully from ${process.env.SMTP_USER} to ${process.env.RECEIVER_EMAIL}`);

        return NextResponse.json({ success: true, message: 'Message sent successfully!' });

    } catch (error: any) {
        console.error('Error sending contact email:', error);
        return NextResponse.json(
            { error: 'Failed to send message', details: error.message },
            { status: 500 }
        );
    }
}