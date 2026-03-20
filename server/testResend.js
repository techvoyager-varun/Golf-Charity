require('dotenv').config();
const { sendEmail } = require('./config/email');

async function main() {
  console.log('Testing Resend email...');
  await sendEmail({
    to: process.env.EMAIL_USER,
    subject: 'GolfCharity ✅ Resend Test',
    html: '<b>Email via Resend is working perfectly!</b><p>Your GolfCharity emails are now live.</p>',
  });
}

main();
