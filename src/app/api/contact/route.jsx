import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();
    
    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Create email transporter
    // Note: In production, use environment variables for these values
    const transporter = nodemailer.createTransport({
        host: process.env.NEXT_PUBLIC_SMTP_HOST || "smtp.example.com",
        port: parseInt(process.env.NEXT_PUBLIC_SMTP_PORT || "587"),
        secure: process.env.NEXT_PUBLIC_SMTP_USER === "true",
        auth: {
            user: process.env.NEXT_PUBLIC_SMTP_USER || "your-email@example.com",
            pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD || "your-password",
        },
    });
    
    // Setup email data
    const mailOptions = {
        from: `"NutrifyMe Contact" <${process.env.NEXT_PUBLIC_SMTP_USER || "contact@nutrify.me"}>`,
        to: process.env.NEXT_PUBLIC_SMTP_USER || "admin@nutrify.me", 
        replyTo: email,
        subject: `New Contact Form Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a5568;">New Contact Message</h2>
            <p style="margin-bottom: 20px;">You have received a new message through the NutrifyMe contact form.</p>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <div style="white-space: pre-line; background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #38a169;">
                ${message}
                </div>
            </div>
            
            <p style="color: #718096; font-size: 14px;">This is an automated message from the NutrifyMe website.</p>
            </div>
        `,
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({
      message: "Your message was sent successfully"
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({
      error: "An error occurred while sending your message"
    }, { status: 500 });
  }
}