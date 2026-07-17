# Proposal Website 💍

A single-page proposal site. When she types her answer and clicks
**"Send it to me"**, the answer is emailed straight to your inbox.

## Project structure

```
awura/
├── index.html      # the website (design untouched — do not edit)
├── script.js       # the page's front-end logic + fetch() submission
├── server.js       # Express backend that emails the answer
├── package.json
├── .env.example    # template for your credentials
├── .env            # your real credentials (you create this — never share it)
├── awurama.html    # original untouched backup of the page
└── README.md
```

> Note: there is no separate `style.css` — the page's styles and fonts are
> embedded inside `index.html` itself, and they were left exactly as they were.

## 1. Install dependencies

You need [Node.js](https://nodejs.org) installed. Then, in this folder:

```bash
npm install
```

(This installs express, nodemailer, dotenv and cors. If you were starting
from scratch you would run `npm init -y` first, then
`npm install express nodemailer dotenv cors` — here `package.json` is
already set up for you.)

## 2. Create your .env

Copy the example file and fill in your details:

```bash
copy .env.example .env     # Windows
# or: cp .env.example .env # Mac/Linux
```

Then open `.env` and set:

| Variable     | What it is                                              |
| ------------ | ------------------------------------------------------- |
| `EMAIL_USER` | The Gmail address that sends the email                  |
| `EMAIL_PASS` | A Gmail **App Password** (not your normal password)     |
| `EMAIL_TO`   | Where the answer should arrive (usually the same email) |
| `PORT`       | Port for the site, `3000` is fine                       |

### Getting a Gmail App Password

1. Turn on 2-Step Verification on your Google account.
2. Go to <https://myaccount.google.com/apppasswords>.
3. Create an app password (name it anything, e.g. "proposal").
4. Paste the 16-character password into `EMAIL_PASS`.

Using a different email provider? Also set `EMAIL_HOST` and `EMAIL_PORT`
in `.env` (see the comments in `.env.example`).

## 3. Run the server

```bash
npm start
```

You should see:

```
Proposal site running at http://localhost:3000
✓ SMTP connection verified — emails will send.
```

If you instead see an SMTP warning, your `.env` credentials need fixing —
the site will still display, but emails won't send until it's resolved.

## 4. Open the website

Go to <http://localhost:3000> in a browser.

**Important:** always open it through the server URL, not by double-clicking
`index.html` — the submit button needs the backend to be running.

## How it works

- She types her answer and clicks **Send it to me**.
- The button switches to *"Sending…"* and is disabled to prevent double-clicks.
- `script.js` sends the answer to `POST /api/answer` using `fetch()`.
- `server.js` validates it (non-empty after trimming, max 5,000 characters),
  applies a rate limit (one submission per IP every 30 seconds), and emails
  it to you via SMTP.
- On success she sees the thank-you screen plus
  *"Thank you ❤️. Your answer has been sent."*
- If anything fails, she sees a friendly error message and can try again —
  nothing is lost.
# chris
