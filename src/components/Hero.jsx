import br from "../assets/br.jpg";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .hero-root {
    font-family: 'DM Sans', sans-serif;
    width: 100%;
    min-height: 540px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    border-radius: 24px;
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
    isolation: isolate;
  }

  /* ── Background image ── */
  .hero-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .hero-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 90%;
    display: block;
    animation: heroZoom 9s ease forwards;
    transform-origin: center center;
  }

  @keyframes heroZoom {
    from { transform: scale(1.1); }
    to   { transform: scale(1); }
  }

  /* ── Overlay layers ── */
  .hero-overlay-dark {
    position: absolute;
    inset: 0;
    z-index: 1;
    background:
      linear-gradient(
        105deg,
        rgba(4, 8, 26, 0.88) 0%,
        rgba(4, 8, 26, 0.62) 48%,
        rgba(4, 8, 26, 0.18) 100%
      ),
      linear-gradient(0deg, rgba(4, 8, 26, 0.55) 0%, transparent 45%);
  }

  .hero-overlay-glow {
    position: absolute;
    inset: 0;
    z-index: 2;
    background:
      radial-gradient(ellipse 60% 55% at 12% 90%, rgba(37, 99, 235, 0.30) 0%, transparent 70%),
      radial-gradient(ellipse 45% 40% at 90% 10%, rgba(234, 88, 12, 0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-overlay-grain {
    position: absolute;
    inset: 0;
    z-index: 3;
    opacity: 0.04;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
  }

  /* ── Content ── */
  .hero-content {
    position: relative;
    z-index: 10;
    padding: 72px 64px;
    max-width: 640px;
    display: flex;
    flex-direction: column;
  }

  .hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.10);
    border: 1px solid rgba(255,255,255,0.22);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 50px;
    padding: 7px 16px 7px 12px;
    width: fit-content;
    margin-bottom: 24px;
    animation: heroUp 0.6s ease 0.1s both;
  }

  .hero-tag-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    animation: heroPulse 2s ease infinite;
  }

  @keyframes heroPulse {
    0%, 100% { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.30); }
    50%      { box-shadow: 0 0 0 7px rgba(59, 130, 246, 0.08); }
  }

  .hero-tag-text {
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255,255,255,0.9);
    letter-spacing: 0.5px;
  }

  .hero-title {
    font-family: 'Sora', sans-serif;
    font-size: clamp(36px, 5.2vw, 62px);
    font-weight: 800;
    color: #fff;
    line-height: 1.08;
    letter-spacing: -1.5px;
    margin-bottom: 20px;
    text-shadow: 0 4px 30px rgba(0,0,0,0.25);
    animation: heroUp 0.65s ease 0.2s both;
  }

  .hero-title .accent {
    background: linear-gradient(90deg, #3b82f6, #7dd3fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-desc {
    font-size: 16px;
    color: rgba(255,255,255,0.72);
    line-height: 1.8;
    margin-bottom: 38px;
    max-width: 400px;
    animation: heroUp 0.65s ease 0.32s both;
  }

  /* ── CTAs ── */
  .hero-ctas {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    animation: heroUp 0.65s ease 0.44s both;
  }

  .hero-cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 55%, #60a5fa 100%);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    padding: 15px 28px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
    box-shadow: 0 8px 28px rgba(37, 99, 235, 0.5);
  }

  .hero-cta-primary:hover {
    transform: translateY(-3px);
    filter: brightness(1.08);
    box-shadow: 0 14px 36px rgba(37, 99, 235, 0.55);
  }

  .hero-cta-primary:active { transform: translateY(0); }

  .hero-cta-primary .arrow {
    display: inline-block;
    transition: transform 0.2s;
  }

  .hero-cta-primary:hover .arrow { transform: translateX(5px); }

  .hero-cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.10);
    border: 1px solid rgba(255,255,255,0.28);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 15px 24px;
    border-radius: 14px;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.2s, transform 0.2s, border-color 0.2s;
  }

  .hero-cta-secondary:hover {
    background: rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.45);
    transform: translateY(-2px);
  }

  .hero-cta-primary:focus-visible,
  .hero-cta-secondary:focus-visible {
    outline: 3px solid rgba(147, 197, 253, 0.8);
    outline-offset: 3px;
  }

  /* ── Floating badges ── */
  .hero-badge {
    position: absolute;
    z-index: 10;
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,0.6);
    border-radius: 18px;
    padding: 13px 18px;
    display: flex;
    align-items: center;
    gap: 11px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.22);
  }

  .hero-badge-1 {
    bottom: 40px;
    right: 44px;
    animation: heroPop 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.7s both;
  }

  .hero-badge-2 {
    top: 44px;
    right: 44px;
    border-radius: 50px;
    padding: 9px 18px;
    animation: heroPop 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.9s both;
  }

  .hero-badge-3 {
    bottom: 40px;
    left: 50%;
    border-radius: 50px;
    padding: 10px 20px;
    gap: 8px;
    animation: heroPopCenter 0.55s cubic-bezier(0.34,1.56,0.64,1) 1.1s both;
  }

  @keyframes heroPop {
    from { opacity: 0; transform: scale(0.75) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  @keyframes heroPopCenter {
    from { opacity: 0; transform: translateX(-50%) scale(0.75) translateY(10px); }
    to   { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
  }

  .badge-emoji { font-size: 24px; line-height: 1; }

  .badge-text-top {
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #111;
    line-height: 1.2;
  }

  .badge-text-sub {
    font-size: 11px;
    color: #8a8f98;
    line-height: 1;
    margin-top: 3px;
  }

  .badge2-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
    animation: heroPulseGreen 2s ease infinite;
    flex-shrink: 0;
  }

  @keyframes heroPulseGreen {
    0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.20); }
    50%      { box-shadow: 0 0 0 7px rgba(34,197,94,0.06); }
  }

  .badge2-text {
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #111;
    white-space: nowrap;
  }

  @keyframes heroUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .hero-content { padding: 56px 40px; }
    .hero-badge-3 { display: none; }
  }

  @media (max-width: 680px) {
    .hero-root { min-height: 500px; border-radius: 18px; }
    .hero-content { padding: 52px 24px 96px; }
    .hero-desc { font-size: 15px; }
    .hero-badge-1 { right: 16px; bottom: 20px; }
    .hero-badge-2 { right: 16px; top: 18px; }
    .hero-cta-primary, .hero-cta-secondary { padding: 13px 22px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-root *, .hero-root *::before, .hero-root *::after {
      animation-duration: 0.01ms !important;
      animation-delay: 0s !important;
    }
  }
`;

export default function HeroSection() {
  return (
    <>
      <style>{styles}</style>
      <div className="hero-root">

        {/* Background image */}
        <div className="hero-bg">
          <img src={br} alt="Delicious food" />
        </div>

        {/* Overlay layers */}
        <div className="hero-overlay-dark" />
        <div className="hero-overlay-glow" />
        <div className="hero-overlay-grain" />

        {/* Main content */}
        <div className="hero-content">

          <div className="hero-tag">
            <span className="hero-tag-dot" />
            <span className="hero-tag-text">Open Now · Fast Delivery</span>
          </div>

          <h1 className="hero-title">
            Delicious food,<br />
            delivered <span className="accent">fast.</span>
          </h1>

          <p className="hero-desc">
            Order your favorite meals from the best
            restaurant in town. Fresh, hot, and at your door.
          </p>

          <div className="hero-ctas">
            <a href="#menu" className="hero-cta-primary">
              Explore Menu
              <span className="arrow">→</span>
            </a>
            <a href="#about" className="hero-cta-secondary">
              Learn More
            </a>
          </div>

        </div>

        {/* Badge 1 – rating */}
        <div className="hero-badge hero-badge-1">
          <span className="badge-emoji">⭐</span>
          <div>
            <div className="badge-text-top">4.9 Rating</div>
            <div className="badge-text-sub">2.4k+ reviews</div>
          </div>
        </div>

        {/* Badge 2 – live indicator */}
        <div className="hero-badge hero-badge-2">
          <div className="badge2-dot" />
          <span className="badge2-text">Free delivery today</span>
        </div>

        {/* Badge 3 – orders */}
        <div className="hero-badge hero-badge-3">
          <span className="badge-emoji">🔥</span>
          <span className="badge2-text">120+ orders today</span>
        </div>

      </div>
    </>
  );
}