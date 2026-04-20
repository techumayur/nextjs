import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false, // Use STARTTLS on 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content for the business owner
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `New Inquiry: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nSubject: ${subject}\nMessage: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e8e8e8; border-radius: 12px; overflow: hidden; color: #1C1C1C;">
          <div style="background-color: #096C6C; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Message Received</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="font-size: 16px; margin-bottom: 20px;">You have received a new inquiry through your portfolio website.</p>
            <div style="background-color: #fafafa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e8e8e8;">
              <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${phone || 'Not Provided'}</p>
              <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 0;"><strong>Message:</strong></p>
              <p style="margin: 10px 0 0 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="background-color: #FF7518; padding: 15px; text-align: center; color: #ffffff; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Techu Mayur Portfolio
          </div>
        </div>
      `,
    };

    // Auto-reply for the sender
    const autoReplyOptions = {
      from: `"Techu Mayur" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for contacting Techu Mayur`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e8e8e8; border-radius: 12px; overflow: hidden; color: #1C1C1C;">
          <div style="background-color: #096C6C; padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Hello, ${name}!</h1>
          </div>
          <div style="padding: 40px 30px; background-color: #ffffff; text-align: center;">
            <h2 style="color: #096C6C; margin-bottom: 20px;">Your message is being processed</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #5F6368; margin-bottom: 30px;">
              Thank you for reaching out regarding <strong>"${subject}"</strong>. I have received your message and will get back to you as soon as possible.
            </p>
            <a href="https://www.techumayur.in" style="background-color: #FF7518; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">Visit My Website</a>
          </div>
          <div style="background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #e8e8e8;">
            <p style="font-size: 14px; color: #5F6368; margin: 0;">Best Regards,<br><strong>Techu Mayur</strong></p>
          </div>
        </div>
      `,
    };

    // Send emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReplyOptions);

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    const message = error instanceof Error ? error.message : 'Failed to send your message. Please try again later.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
