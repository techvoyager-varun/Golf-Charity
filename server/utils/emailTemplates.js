const welcomeEmail = (email, name) => ({
  to: email,
  subject: 'Welcome to GolfCharity!',
  html: `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF;">
      <div style="background: #1A2E2A; padding: 40px 32px; text-align: center;">
        <h1 style="color: #FFFFFF; margin: 0; font-size: 28px;">Golf<span style="color: #C8A951;">Charity</span></h1>
      </div>
      <div style="padding: 40px 32px;">
        <h2 style="color: #1A2E2A; margin: 0 0 16px;">Welcome, ${name}!</h2>
        <p style="color: #4A4A4A; line-height: 1.7; font-size: 15px;">Thank you for joining GolfCharity. You're now part of a community that combines the love of golf with meaningful charitable giving.</p>
        <p style="color: #4A4A4A; line-height: 1.7; font-size: 15px;">Subscribe to start entering monthly draws and making a difference.</p>
        <a href="${process.env.CLIENT_URL}/subscribe" style="display: inline-block; background: #C8A951; color: #1A2E2A; padding: 14px 32px; text-decoration: none; font-weight: 700; border-radius: 4px; margin-top: 24px;">Get Started</a>
      </div>
      <div style="background: #F9F9F9; padding: 24px 32px; text-align: center;">
        <p style="color: #8A8A8A; font-size: 12px; margin: 0;">© 2026 GolfCharity. All rights reserved.</p>
      </div>
    </div>
  `,
});

const drawResultEmail = (email, name, month, year) => ({
  to: email,
  subject: `GolfCharity Draw Results - ${month} ${year}`,
  html: `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1A2E2A; padding: 40px 32px; text-align: center;">
        <h1 style="color: #FFFFFF; margin: 0;">Golf<span style="color: #C8A951;">Charity</span></h1>
      </div>
      <div style="padding: 40px 32px;">
        <h2 style="color: #1A2E2A;">Draw Results for ${month} ${year}</h2>
        <p style="color: #4A4A4A; line-height: 1.7;">Hi ${name}, the draw results are in! Log in to check your results.</p>
        <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; background: #C8A951; color: #1A2E2A; padding: 14px 32px; text-decoration: none; font-weight: 700; border-radius: 4px; margin-top: 24px;">View Results</a>
      </div>
    </div>
  `,
});

const winnerNotificationEmail = (email, name, amount) => ({
  to: email,
  subject: 'Congratulations! You\'re a GolfCharity Winner! 🏆',
  html: `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1A2E2A; padding: 40px 32px; text-align: center;">
        <h1 style="color: #FFFFFF; margin: 0;">Golf<span style="color: #C8A951;">Charity</span></h1>
      </div>
      <div style="padding: 40px 32px; text-align: center;">
        <h2 style="color: #C8A951; font-size: 36px;">You Won £${amount}!</h2>
        <p style="color: #4A4A4A; line-height: 1.7;">Congratulations ${name}! You've matched numbers in this month's draw.</p>
        <p style="color: #4A4A4A; line-height: 1.7;">Please upload a screenshot from your golf scoring platform to verify your win.</p>
        <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; background: #C8A951; color: #1A2E2A; padding: 14px 32px; text-decoration: none; font-weight: 700; border-radius: 4px; margin-top: 24px;">Upload Proof</a>
      </div>
    </div>
  `,
});

module.exports = { welcomeEmail, drawResultEmail, winnerNotificationEmail };
