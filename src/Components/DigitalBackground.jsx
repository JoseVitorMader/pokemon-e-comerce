import React, { useEffect, useRef } from "react";

// Renders decorative floating "eggs" as inline SVGs and adds a subtle mouse-parallax.
export default function DigitalBackground() {
  const rootRef = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const root = rootRef.current;
    if (!root) return;

    const eggs = Array.from(root.querySelectorAll('.egg'));
    let mouseX = 0;
    let mouseY = 0;
    let rafId = null;

    function onMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(update);
    }

    function update() {
      rafId = null;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const cy = h / 2;

      eggs.forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "0.02");
        const dx = (mouseX - cx) * speed;
        const dy = (mouseY - cy) * speed;
        // apply small translate for parallax combined with any existing animation
        el.style.transform = `translate3d(${dx}px, ${-Math.abs(dy)}px, 0)`;
      });
    }

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Define a small set of eggs with positions, sizes and speeds.
  const eggs = [
    { id: 'e1', left: '6%', size: 140, speed: 0.03, colors: ['#ff6fa8', '#ffd1ea'] },
    { id: 'e2', left: '22%', size: 110, speed: 0.04, colors: ['#00f5d4', '#b8fff0'] },
    { id: 'e3', left: '40%', size: 80, speed: 0.02, colors: ['#ffb86b', '#ffe6c8'] },
    { id: 'e4', left: '62%', size: 180, speed: 0.025, colors: ['#ff4db2', '#ffd4f0'] },
    { id: 'e5', left: '78%', size: 100, speed: 0.035, colors: ['#00f5d4', '#dffaf5'] },
    { id: 'e6', left: '12%', size: 90, speed: 0.015, colors: ['#d6e8ff', '#ffffff'] },
    { id: 'e7', left: '50%', size: 130, speed: 0.03, colors: ['#ff6fa8', '#ffd1ea'] },
    { id: 'e8', left: '86%', size: 70, speed: 0.045, colors: ['#b8fff0', '#eafffb'] },
    { id: 'e9', left: '30%', size: 120, speed: 0.02, colors: ['#ffd7a8', '#fff3e6'] },
    { id: 'e10', left: '70%', size: 150, speed: 0.02, colors: ['#dbe7ff', '#ffffff'] },
  ];

  return (
    <div className="digital-bg" aria-hidden="true" ref={rootRef}>
      {eggs.map((egg, idx) => (
        <div
          key={egg.id}
          className={`egg svg-egg ${egg.id}`}
          data-speed={String(egg.speed)}
          style={{ left: egg.left, width: egg.size, height: egg.size }}
        >
          <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
            <defs>
              <radialGradient id={`g-${idx}`} cx="30%" cy="30%">
                <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                <stop offset="45%" stopColor={egg.colors[0]} stopOpacity="0.95" />
                <stop offset="100%" stopColor={egg.colors[1]} stopOpacity="0.06" />
              </radialGradient>
              <filter id={`s-${idx}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="b" />
                <feBlend in="SourceGraphic" in2="b" mode="screen" />
              </filter>
            </defs>
            <ellipse cx="50" cy="60" rx="40" ry="52" fill={`url(#g-${idx})`} filter={`url(#s-${idx})`} />
            <ellipse cx="38" cy="44" rx="10" ry="14" fill="#ffffff" opacity="0.6" />
          </svg>
        </div>
      ))}
    </div>
  );
}
