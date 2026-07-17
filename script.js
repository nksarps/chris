const { useState, useEffect, useRef } = React;

/* ----------------------------------------------------------------
   Editable copy — Nana, change anything in quotes here or by
   clicking the text directly in the preview.
-----------------------------------------------------------------*/
const HER = "Awurama";
const SIGN = "Always, Nana Boamah";

/* Where the answer is sent. Same origin as the page, so this
   works as long as the site is opened through the Node server. */
const ANSWER_ENDPOINT = "/api/answer";
const MAX_ANSWER_LENGTH = 5000;

const REASONS = [
  { t: "Your thoughtfulness", b: "You show care in an intentional way, and it is not reserved just for me. Your friends too." },
  { t: "Your mind and intelligence", b: "You notice things differently and always have a unique perspective on the most random things. It amazes me." },
  { t: "Your heart", b: "You have a good heart and it shows in everything you do." },
  { t: "Your beauty", b: "It just takes me out. A snap from you makes my day better instantly. Every. Single. Time. To put it elegantly, you're pulchritudinous." },
  { t: "Your sense of humor", b: "I'll leave it at that 😂" },
  { t: "Your standards and personality", b: "" },
  { t: "Simply you", b: "Just who you are altogether." },
];

const MOMENTS = [
  "That afternoon we lost track of time",
  "Somewhere we'll go together",
  "A random (not so random) picture",
];

/* ----------------------------------------------------------------
   Apple emojis everywhere: swap emoji characters for Apple's
   artwork (PNGs in /emoji, served by the same Node server) so
   they look the same on every phone and laptop.
   To use a new emoji, download its PNG into /emoji and map it here.
-----------------------------------------------------------------*/
const APPLE_EMOJI = {
  "😂": "1f602.png",
  "🙂‍↕️": "1f642-200d-2195-fe0f.png",
  "❤️": "2764-fe0f.png",
  "🌸": "1f338.png",
  "🥂": "1f942.png",
  "🎶": "1f3b6.png",
  "💕": "1f495.png",
};
const EMOJI_SPLIT = new RegExp("(" + Object.keys(APPLE_EMOJI).join("|") + ")", "g");

function emojify(text) {
  return text.split(EMOJI_SPLIT).map((part, i) =>
    APPLE_EMOJI[part] ? (
      <img
        key={i}
        src={"emoji/" + APPLE_EMOJI[part]}
        alt={part}
        style={{
          width: "1.1em",
          height: "1.1em",
          verticalAlign: "-0.18em",
          margin: "0 0.04em",
        }}
      />
    ) : (
      part
    )
  );
}

/* ---- small decorative flourish, built only from basic shapes ---- */
function Flourish() {
  return (
    <div className="flourish" aria-hidden="true">
      <span className="rule"></span>
      <span className="dot"></span>
      <span className="diamond"></span>
      <span className="dot"></span>
      <span className="rule r"></span>
    </div>
  );
}

/* ---- a framed botanical plate placeholder ---- */
/* Pass src to show a real photo (served from /photos), or video to
   show a silent auto-playing loop (served from /videos); otherwise
   it stays a drop-a-photo slot. Videos must stay muted — browsers
   refuse to autoplay them with sound. */
function Plate({ id, label, ratio = "3 / 4", className = "", src, video, position = "center" }) {
  return (
    <figure className={"plate " + className} style={{ aspectRatio: ratio }}>
      <span className="plate-corner tl"></span>
      <span className="plate-corner tr"></span>
      <span className="plate-corner bl"></span>
      <span className="plate-corner br"></span>
      {video ? (
        <video src={video} autoPlay loop muted playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position, display: "block" }} />
      ) : src ? (
        <img src={src} alt={label}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position, display: "block" }} />
      ) : (
        <image-slot id={id} placeholder={label} shape="rect" fit="cover"
          style={{ width: "100%", height: "100%" }}></image-slot>
      )}
    </figure>
  );
}

function Hero() {
  return (
    <header className="section hero" id="top">
      <div className="col hero-inner">
        <p className="eyebrow">
          For you,{" "}
          <span
            className="script"
            style={{
              textTransform: "none",
              letterSpacing: "0.04em",
              fontSize: "1.9em",
              verticalAlign: "-0.22em",
            }}
          >
            {HER}
          </span>
          {emojify(" 🌸")}
        </p>
        <h1 className="hero-title">
          Before I knew what to call it,<br />
          I knew it was <span className="script">you</span>.
        </h1>
        <Flourish />
        <p className="hero-sub">
          Some words matter too much to be typed into a chat and lost
          in the scroll. So I built them a home instead. Take your
          time — every line here is for you.
        </p>
        <a className="cta" href="#story">
          <span>Begin</span>
          <span className="cta-line" aria-hidden="true"></span>
        </a>
      </div>
    </header>
  );
}

function Story() {
  return (
    <section className="section story" id="story">
      <div className="wrap story-grid">
        <div className="story-text">
          <p className="eyebrow">Our story</p>
          <h2 className="h2">How it began,<br />and why it stayed.</h2>
          <p>
            {emojify(
              "I find it wild that something as cliché and simple as a Snapchat add " +
              "set everything rolling, even though we had known about each other for " +
              "quite some time. The vibe we had from the very beginning had me " +
              "hooked—like the pilot episode to a very good series (like The " +
              "Blacklist 🙂‍↕️)."
            )}
          </p>
          <p>
            {emojify(
              "And the plot thickened. It kept getting better. Kept getting " +
              "interesting. Kept getting weird too (in a beautiful way) 😂😂, but I " +
              "knew I wanted more. My curiosity grew by the day because I was so " +
              "interested in knowing where this was headed. The best part about this " +
              "is that the feeling was mutual. It felt almost natural."
            )}
          </p>
        </div>
        <div className="story-media">
          <Plate id="story-photo" label="a photo of us" ratio="848 / 480" video="/videos/video-of-us.mp4" />
          <figcaption className="cap">{emojify("Our first date. First of many🥂")}</figcaption>
        </div>
      </div>
    </section>
  );
}

/* Card centres, as percentages of the heart container — traced along the
   heart outline: two lobes, two sides, two lower curves, and the point. */
const HEART_POS = [
  { x: "31.5%", y: "10.5%" }, // 01 — left lobe
  { x: "68.5%", y: "10.5%" }, // 02 — right lobe
  { x: "13.5%", y: "40%" },   // 03 — left side
  { x: "86.5%", y: "40%" },   // 04 — right side
  { x: "26%",   y: "64%" },   // 05 — lower left
  { x: "74%",   y: "64%" },   // 06 — lower right
  { x: "50%",   y: "90%" },   // 07 — the point
];

function Reasons() {
  /* On small screens the cards show only number + title; tapping one
     opens its body text (styled by the max-width: 619px overrides). */
  const [open, setOpen] = useState(null);
  return (
    <section className="section reasons" id="reasons">
      <div className="wrap">
        <div className="centered">
          <p className="eyebrow">A few of the reasons</p>
          <h2 className="h2">A few reasons<br />why I admire you.</h2>
          <Flourish />
        </div>
        <div className="reason-grid heart">
          <svg className="heart-outline" viewBox="0 0 100 90" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M50 25 C50 12 38 4 27 4 C13 4 4 15 4 28 C4 50 28 65 50 86 C72 65 96 50 96 28 C96 15 87 4 73 4 C62 4 50 12 50 25 Z"
              fill="currentColor" fillOpacity="0.05"
              stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
          {REASONS.map((r, i) => (
            <article
              className={"reason-card" + (open === i ? " open" : "")}
              key={i}
              style={{ "--hx": HEART_POS[i].x, "--hy": HEART_POS[i].y }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="reason-num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="reason-title">{r.t}</h3>
              <p className="reason-body">{emojify(r.b)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="section gallery" id="gallery">
      <div className="wrap">
        <div className="centered">
          <p className="eyebrow">Moments</p>
          <h2 className="h2">The small, ordinary<br />miracles of us.</h2>
        </div>
        <div className="gallery-grid">
          <div className="g-item tall">
            <Plate id="mem-1" label="drop a photo" ratio="3 / 4" src="/photos/afternoon.jpg" />
            <figcaption className="cap">{MOMENTS[0]}</figcaption>
          </div>
          <div className="g-item">
            <Plate id="mem-2" label="drop a photo" ratio="1 / 1" src="/photos/amalfi-coast.jpg" position="bottom" />
            <figcaption className="cap">{MOMENTS[1]}</figcaption>
          </div>
          <div className="g-item">
            <Plate id="mem-3" label="drop a photo" ratio="4 / 3" src="/photos/random.jpg" />
            <figcaption className="cap">{MOMENTS[2]}</figcaption>
          </div>
        </div>
      </div>
    </section>
  );
}

function BigQuestion() {
  /* The thank-you screen only lasts for the visit — every fresh page
     load starts back at the text field, so she can always write. */
  const [reply, setReply] = useState("");
  const [saved, setSaved] = useState(null);

  /* Submission state: sending disables the button and shows
     "Sending…"; status carries the success / error message. */
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // { ok: boolean, msg: string }

  async function send() {
    const text = reply.trim();
    if (!text || sending) return; // empty or duplicate submission — ignore
    if (text.length > MAX_ANSWER_LENGTH) {
      setStatus({ ok: false, msg: "That message is a little too long — please shorten it a bit." });
      return;
    }

    setSending(true);
    setStatus(null);
    try {
      const res = await fetch(ANSWER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "The answer could not be sent.");

      setSaved({ text, at: new Date().toISOString() });
      setStatus({ ok: true, msg: "Thank you ❤️. Your answer has been sent." });
    } catch (err) {
      setStatus({
        ok: false,
        msg: (err && err.message && err.message !== "Failed to fetch")
          ? err.message
          : "Something went wrong and your answer wasn't sent. Please try again in a moment.",
      });
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setSaved(null);
    setReply("");
    setStatus(null);
  }

  /* Small status line, styled to match the page. */
  function StatusLine() {
    if (!status) return null;
    return (
      <p
        className="ask-sub"
        role="status"
        style={{
          marginTop: "1.2rem",
          fontStyle: "italic",
          color: status.ok ? "var(--gold)" : "oklch(0.88 0.06 30)",
        }}
      >
        {emojify(status.msg)}
      </p>
    );
  }

  return (
    <section className="section ask" id="ask">
      <div className="ask-frame">
        <span className="plate-corner tl light"></span>
        <span className="plate-corner tr light"></span>
        <span className="plate-corner bl light"></span>
        <span className="plate-corner br light"></span>

        <div className="col ask-inner">
          {!saved ? (
            <React.Fragment>
              <p className="eyebrow light">And so, the question</p>
              <h2 className="ask-title">
                {HER},<br />
                will you be my <span className="script light">girlfriend?</span>
              </h2>
              <Flourish />
              <p className="ask-sub">
                No rush, no perfect words required. Just tell me what's in your heart —
                I'll be right here, reading it.
              </p>
              <p className="ask-sub" style={{ fontStyle: "italic" }}>
                {emojify("🎶 Now playing: Can't Take My Eyes off You by Frankie Valli 💕")}
              </p>
              <div className="reply">
                <textarea
                  id="reply-input"
                  className="reply-input"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your answer to me…"
                  maxLength={MAX_ANSWER_LENGTH}
                  rows={3}
                ></textarea>
                <button
                  id="reply-btn"
                  className="reply-btn"
                  onClick={send}
                  disabled={!reply.trim() || sending}
                >
                  {sending ? "Sending…" : "Send it to me"}
                </button>
                <StatusLine />
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p className="eyebrow light">You answered</p>
              <h2 className="ask-title">
                <span className="script light" style={{ fontSize: "1.25em" }}>
                  Thank you, {HER}.
                </span>
              </h2>
              <Flourish />
              <blockquote className="her-reply">
                <span className="quote-mark" aria-hidden="true">&ldquo;</span>
                {saved.text}
              </blockquote>
              <p className="ask-sub">
                I'm going to keep this exactly where it is. Whatever you wrote,
                you've made me the luckiest person alive.
              </p>
              <StatusLine />
              <button className="reset-link" onClick={reset}>write a different answer</button>
            </React.Fragment>
          )}

          <p className="sign-off">{SIGN}</p>
        </div>
      </div>
    </section>
  );
}

/* Responsive fixes layered on top of the page's own CSS (index.html
   is the untouched design, so overrides live here instead):
   - figure keeps a 1em/40px browser default margin the design never
     resets; it shoved every plate right, causing horizontal scroll on
     phones and clipping the story photo on tablets.
   - the design only traces the reasons into a heart at ≥1100px and
     falls back to a plain grid below; these overrides keep the heart
     at every width. Type scales down with the viewport, and under
     620px the cards hold just number + title — tapping one lifts it
     above the heart and reveals its body text (see Reasons). */
const RESPONSIVE_CSS = `
  .plate { margin: 0; }

  /* the story video's caption sits outside .gallery, so it misses the
     .g-item .cap styling (centered, italic display serif) — match it here */
  .story-media .cap {
    margin-top: 1rem;
    text-align: center;
    font-family: var(--display);
    font-style: italic;
    font-size: 1.18rem;
    color: var(--ink-soft);
  }

  .reason-grid.heart {
    display: block;
    position: relative;
    max-width: 1080px;
    margin: 0 auto;
    aspect-ratio: 20 / 21;
    background: none;
    border: none;
  }
  .reason-grid.heart .heart-outline {
    display: block;
    position: absolute;
    left: 10%;
    top: 8%;
    width: 80%;
    height: 86%;
    color: var(--teal);
    opacity: 0.35;
  }
  .reason-grid.heart .reason-card {
    position: absolute;
    left: var(--hx);
    top: var(--hy);
    transform: translate(-50%, -50%);
    width: min(250px, 24%);
    padding: 26px 22px;
    text-align: center;
    border: 1px solid var(--paper-edge);
    box-shadow: 0 24px 44px -32px oklch(0.4 0.05 240 / 0.5);
  }
  .reason-grid.heart .reason-title { font-size: 1.35rem; }
  .reason-grid.heart .reason-body { font-size: 0.9rem; line-height: 1.6; }

  @media (max-width: 1099px) {
    .reason-grid.heart .reason-card {
      width: min(250px, 26%);
      padding: clamp(10px, 2vw, 22px) clamp(8px, 1.6vw, 18px);
    }
    .reason-grid.heart .reason-num { font-size: clamp(0.6rem, 1.4vw, 1.05rem); }
    .reason-grid.heart .reason-title {
      font-size: clamp(0.78rem, 2vw, 1.35rem);
      margin: 0.3rem 0 0.4rem;
    }
    .reason-grid.heart .reason-body {
      font-size: clamp(0.66rem, 1.5vw, 0.9rem);
      line-height: 1.45;
    }
  }

  @media (max-width: 619px) {
    .reason-grid.heart .reason-card { width: 30%; cursor: pointer; }
    .reason-grid.heart .reason-body { display: none; }
    .reason-grid.heart .reason-card.open {
      width: 64%;
      z-index: 6;
      /* keep the widened card inside the heart container even when
         its anchor sits near an edge (e.g. the side cards at 13.5%/86.5%) */
      left: clamp(32%, var(--hx), 68%);
    }
    .reason-grid.heart .reason-card.open .reason-body { display: block; }
  }
`;

function App() {
  return (
    <React.Fragment>
      <style>{RESPONSIVE_CSS}</style>
      <Hero />
      <Story />
      <Reasons />
      <Gallery />
      <BigQuestion />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
