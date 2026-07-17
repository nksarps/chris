/**
 * Tiny backend for the proposal page.
 *
 * Serves the website (index.html + script.js) and exposes one endpoint,
 * POST /api/answer, which emails her answer to you via SMTP.
 *
 * No database — the answer only needs to reach your inbox.
 */

require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

const MAX_ANSWER_LENGTH = 5000; // characters
const RATE_LIMIT_WINDOW_MS = 30 * 1000; // one submission per 30s per IP

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors());
app.use(express.json({ limit: "20kb" })); // answers are small; reject huge bodies
app.use(express.static(__dirname)); // serves index.html and script.js

// ---------------------------------------------------------------------------
// Mail transport (SMTP via Nodemailer)
// ---------------------------------------------------------------------------
// Defaults to Gmail. If you use another provider, set EMAIL_HOST / EMAIL_PORT
// in your .env. For Gmail you need an "App Password", not your real password:
// https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT || 465),
  secure: Number(process.env.EMAIL_PORT || 465) === 465, // 465 = TLS from the start
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ---------------------------------------------------------------------------
// Very small in-memory rate limiter: one submission per IP per 30 seconds.
// ---------------------------------------------------------------------------
const lastSubmissionByIp = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const last = lastSubmissionByIp.get(ip);
  if (last && now - last < RATE_LIMIT_WINDOW_MS) return true;
  lastSubmissionByIp.set(ip, now);

  // Keep the map from growing forever.
  if (lastSubmissionByIp.size > 1000) {
    for (const [key, time] of lastSubmissionByIp) {
      if (now - time > RATE_LIMIT_WINDOW_MS) lastSubmissionByIp.delete(key);
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// POST /api/answer — receive her answer and email it
// ---------------------------------------------------------------------------
app.post("/api/answer", async (req, res) => {
  // 1. Validate the input.
  const raw = req.body && req.body.answer;
  if (typeof raw !== "string") {
    return res.status(400).json({ error: "No answer was provided." });
  }

  const answer = raw.trim();
  if (answer.length === 0) {
    return res.status(400).json({ error: "The answer is empty." });
  }
  if (answer.length > MAX_ANSWER_LENGTH) {
    return res.status(400).json({ error: "The answer is too long (max 5,000 characters)." });
  }

  // 2. Rate limit: one submission per IP every 30 seconds.
  if (isRateLimited(req.ip)) {
    return res.status(429).json({ error: "Please wait a moment before sending again." });
  }

  // 3. Send the email.
  try {
    await transporter.sendMail({
      from: `"Proposal Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "She answered your proposal ❤️",
      text: [
        "You just received a response.",
        "",
        "Her answer:",
        "",
        "--------------------------------",
        answer,
        "--------------------------------",
        "",
        "Sent from your proposal website.",
      ].join("\n"),
    });

    return res.status(200).json({ ok: true, message: "Answer sent." });
  } catch (err) {
    console.error("Failed to send email:", err.message);
    return res.status(502).json({ error: "The answer could not be sent right now. Please try again." });
  }
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Proposal site running at http://localhost:${PORT}`);

  // Check the SMTP credentials up front so problems show immediately,
  // not at the moment she clicks "Send it to me".
  transporter.verify((err) => {
    if (err) {
      console.warn("⚠ SMTP check failed — emails will not send until this is fixed:");
      console.warn("  " + err.message);
    } else {
      console.log("✓ SMTP connection verified — emails will send.");
    }
  });
});
