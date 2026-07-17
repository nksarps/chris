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
          <p className="sig-line">{SIGN}</p>
        </div>
        <div className="story-media">
          <Plate id="story-photo" label="a photo of us" ratio="4 / 5" video="/videos/video-of-us.mp4" />
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
  return (
    <section className="section reasons" id="reasons">
      <div className="wrap">
        <div className="centered">
          <p className="eyebrow">A few of the reasons</p>
          <h2 className="h2">A few reasons<br />why I stayed.</h2>
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
              className="reason-card"
              key={i}
              style={{ "--hx": HEART_POS[i].x, "--hy": HEART_POS[i].y }}
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
  const KEY = "awurama_reply_v1";
  const [reply, setReply] = useState("");
  const [saved, setSaved] = useState(null);

  /* Submission state: sending disables the button and shows
     "Sending…"; status carries the success / error message. */
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // { ok: boolean, msg: string }

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v) setSaved(JSON.parse(v));
    } catch (e) {}
  }, []);

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

      const entry = { text, at: new Date().toISOString() };
      try { localStorage.setItem(KEY, JSON.stringify(entry)); } catch (e) {}
      setSaved(entry);
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
    try { localStorage.removeItem(KEY); } catch (e) {}
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

function App() {
  return (
    <React.Fragment>
      <Hero />
      <Story />
      <Reasons />
      <Gallery />
      <BigQuestion />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
