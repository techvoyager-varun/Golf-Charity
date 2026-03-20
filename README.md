# 🏌️‍♂️ Golf Charity Subscription Platform

A modern, subscription-based web application that combines golf performance tracking, charitable giving, and a sophisticated monthly reward engine. Built as a full-stack MERN solution, this platform intentionally avoids traditional golf website clichés (plaid patterns, deep greens, generic fairways) in favor of an **emotion-driven, premium, and motion-enhanced aesthetic**.

---

## 🎯 Core Features

### 1. Subscription System
- Secure integration with **Stripe** for monthly and yearly subscription plans.
- Automatic feature restriction for non-subscribers via robust backend middleware (`subscriptionCheck`).
- Real-time plan status, renewals, and cancellation tracking.

### 2. Score Management
- Users can log their Stableford scores (1–45).
- Follows an automatic **"Rolling 5" logic**: The system strictly maintains only the 5 most recent scores per user. Adding a 6th score automatically drops the oldest one.

### 3. Draw & Reward Engine
- **Monthly Execution**: Draws are scheduled monthly with full Admin control for simulation and publishing.
- **Dual Draw Logic**: 
  - *Random*: A standard lottery-style draw.
  - *Algorithmic*: Weights the probability of numbers drawn based on the frequency of actual scores entered by the subscriber base.
- **Dynamic Prize Pooling calculation**: Automatically allocates exactly 40% to 5-matches, 35% to 4-matches, and 25% to 3-matches based on live subscription counts. Automatically splits pools evenly between multiple winners in the same tier.
- **Jackpot Rollovers**: If the 5-match jackpot goes un-won, the exact unmatched funds roll over strictly into the next month's 5-match pool.

### 4. Charity Integration & Impact
- Subscribers select their preferred charity securely from a curated list during registration.
- A dynamically enforced minimum of **10%** of the user's subscription goes directly to charity.
- Dashboards feature interactive sliders allowing players to voluntarily increase their percentage contribution.

### 5. Winner Verification & Dashboards
- **Player Dashboard**: Displays subscription details, score interfaces, draw history, and charitable impact. It also features a built-in *Proof Upload UI* allowing winners to upload Base64 screenshots of their matches for Admin review.
- **Admin Dashboard**: Comprehensive control center for verifying/paying winners, managing all charities, and running/publishing the monthly draw simulations.

---

## 💻 Tech Stack

- **Frontend:** React.js (Vite), React Router v6, Vanilla CSS (Custom Design System / Glassmorphism)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT) stored securely via HttpOnly Cookies / Headers.
- **Payments:** Stripe API
- **Emails:** Nodemailer (Automated Registration & Winner alerts)

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (Local or Atlas)
- Stripe Account (for Secret and Webhook keys)

### 1. Clone & Install
Open your terminal and run the following to install all dependencies for both environments.
```bash
git clone <your-repo-link>
cd golf

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Environment Variables (.env)
Create a `.env` file in the `server` root directory matching the following structure:
```env
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SMTP / Email Alerts (e.g., Gmail App Passwords)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### 3. Run the Application
You can run the frontend and backend servers concurrently.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
The client will start entirely at `http://localhost:5173`.

---

## 🎨 UI/UX Design System
The UI adopts a highly modern "**Muted Luxury**" approach tailored to inspire charitable giving:
- **Typography**: Heavy utilization of `font-display` utility classes for premium statistical displays.
- **Variables**: Fully tokenized CSS variable architecture (`--brand-dark`, `--accent-gold`, etc.) allowing for immediate global theme switching.
- **Responsiveness**: Mobile-first media queries ensure functionality behaves perfectly across screens, specifically addressing complex asymmetric grid behaviors on authentication pages. 

---

