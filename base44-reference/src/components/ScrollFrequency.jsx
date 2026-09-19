import React, { useEffect, useState } from "react";
/**
 * ScrollFrequency — a fixed "Hz" readout that climbs as the user scrolls,
 * simulating descent through layers of research.
 */
export default function ScrollFrequency() {
  const [hz, setHz] = useState(432);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setProgress(p);
      setHz(Math.round(432 + p * 4096));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40 hidden items-center gap-3 md:flex">
      <div className="font-mono text-[10px] leading-tight tracking-wide-2 text-subdata text-right">
        <div className="text-signal">{hz.toLocaleString()} Hz</div>
        <div>LAYER {String(Math.min(7, Math.floor(progress * 7) + 1)).padStart(2, "0")}/07</div>
      </div>
      <div className="h-10 w-px bg-border">
        <div className="w-full bg-signal" style={{ height: `${progress * 100}%` }} />
      </div>
    </div>
  );
}