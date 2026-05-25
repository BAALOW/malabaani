import br from "../assets/br.jpg";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .hero-root {
    font-family: 'DM Sans', sans-serif;
    width: 100%;
    min-height: 520px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  /* ── Background image ── */
  .hero-bg {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .hero-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 90%;
    display: block;
    animation: zoomIn 8s ease forwards;
    transform-origin: center center;
  }

  @keyframes zoomIn {
    from { transform: scale(1.08); }
    to   { transform: scale(1); }
  }

  /* ── Overlay layers ── */
  .hero-overlay-dark {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      110deg,
      rgba(5, 10, 30, 0.82) 0%,
      rgba(5, 10, 30, 0.55) 55%,
      rgba(5, 10, 30, 0.20) 100%
    );
  }

  /* soft warm glow bottom */
  .hero-overlay-glow {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: radial-gradient(
      ellipse 70% 60% at 30% 80%,
      rgba(234, 88, 12, 0.22) 0%,
      transparent 70%
    );
    pointer-events: none;
  }

  /* grain texture */
  .hero-overlay-grain {
    position: absolute;
    inset: 0;
    z-index: 3;
    opacity: 0.035;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
  }

  /* ── Content ── */
  .hero-content {
    position: relative;
    z-index: 10;
    padding: 64px 56px;
    max-width: 560px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* pill tag */
  .hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.22);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 50px;
    padding: 6px 14px 6px 10px;
    width: fit-content;
    margin-bottom: 22px;
    animation: fadeSlideUp 0.6s ease 0.1s both;
  }

  .hero-tag-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background:#3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    animation: pulse 2s ease infinite;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); }
    50%       { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.1); }
  }

  .hero-tag-text {
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    letter-spacing: 0.4px;
  }

  /* title */
  .hero-title {
    font-family: 'Sora', sans-serif;
    font-size: clamp(34px, 5vw, 58px);
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
    letter-spacing: -1px;
    margin-bottom: 18px;
    animation: fadeSlideUp 0.65s ease 0.2s both;
  }

  .hero-title .accent {
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* desc */
  .hero-desc {
    font-size: 15px;
    color: rgba(255,255,255,0.65);
    line-height: 1.75;
    margin-bottom: 36px;
    max-width: 320px;
    animation: fadeSlideUp 0.65s ease 0.32s both;
  }

  /* CTA row */
  .hero-ctas {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    animation: fadeSlideUp 0.65s ease 0.44s both;
  }

  .hero-cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    padding: 14px 26px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
    box-shadow: 0 6px 24px rgba(59, 130, 246, 0.45);
  }

  .hero-cta-primary:hover {
    transform: translateY(-3px);
    filter: brightness(1.08);
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.5);
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
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.25);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 14px 22px;
    border-radius: 12px;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.2s, transform 0.2s;
  }

  .hero-cta-secondary:hover {
    background: rgba(255,255,255,0.18);
    transform: translateY(-2px);
  }

  /* ── Floating badges ── */
  .hero-badge {
    position: absolute;
    z-index: 10;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 16px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  }

  .hero-badge-1 {
    bottom: 36px;
    right: 40px;
    animation: badgePop 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.7s both;
  }

  .hero-badge-2 {
    top: 44px;
    right: 40px;
    animation: badgePop 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.9s both;
    border-radius: 50px;
    padding: 8px 16px;
  }

  .hero-badge-3 {
    bottom: 36px;
    left: 50%;
    transform: translateX(-50%);
    animation: badgePop 0.55s cubic-bezier(0.34,1.56,0.64,1) 1.1s both;
    border-radius: 50px;
    padding: 9px 18px;
    gap: 8px;
  }

  @keyframes badgePop {
    from { opacity: 0; transform: scale(0.75) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* badge-3: override transform since it has initial translateX */
  .hero-badge-3 {
    bottom: 36px;
    left: 50%;
  }

  @keyframes badgePop3 {
    from { opacity: 0; transform: translateX(-50%) scale(0.75) translateY(10px); }
    to   { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
  }

  .hero-badge-3 { animation: badgePop3 0.55s cubic-bezier(0.34,1.56,0.64,1) 1.1s both; }

  .badge-emoji { font-size: 22px; line-height: 1; }

  .badge-text-top {
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #111;
    line-height: 1.2;
  }

  .badge-text-sub {
    font-size: 11px;
    color: #999;
    line-height: 1;
    margin-top: 2px;
  }

  .badge2-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
    animation: pulse2 2s ease infinite;
    flex-shrink: 0;
  }

  @keyframes pulse2 {
    0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
    50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0.08); }
  }

  .badge2-text {
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #111;
    white-space: nowrap;
  }

  /* shared fade-slide-up */
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 680px) {
    .hero-root { min-height: 480px; }
    .hero-content { padding: 48px 28px; }
    .hero-badge-3 { display: none; }
    .hero-badge-1 { right: 16px; bottom: 20px; }
    .hero-badge-2 { right: 16px; top: 20px; }
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