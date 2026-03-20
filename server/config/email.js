const { Resend } = require('resend');

const getResend = () => new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: 'GolfCharity <onboarding@resend.dev>', // change to your domain once verified
      to,
      subject,
      html,
    });
    if (error) {
      console.error(`Email error:`, error);
    } else {
      console.log(`Email sent to ${to} — ID: ${data.id}`);
    }
  } catch (err) {
    console.error(`Email send failed: ${err.message}`);
  }
};

module.exports = { sendEmail };
