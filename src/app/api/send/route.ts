import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { email, userName } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_FROM,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Kiran Tripathi 👻" <kirantripathi317@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Item Added for Auction", // Subject line
    text: `Hello ${userName}.Your item is now ready for auction`, // plain text body
    html: `
     <div>
     <b>Hello ${userName},</b>
     <br />
     <p>Your item is now ready for auction.</p>
     <div>
     `, // html body
  };

  try {
    let success = await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: success }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Email Sent Fail" }, { status: 500 });
  }
}
