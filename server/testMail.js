require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function main() {
  try {
    const info = await transporter.sendMail({
      from: `"Golf Charity Subscriptions" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to themselves for testing
      subject: "Hello from Golf Charity ✅",
      text: "Your SMTP Setup is working perfectly!",
      html: "<b>Your SMTP Setup is working perfectly!</b>",
    });
    console.log("Email sent! Message ID: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

main();
