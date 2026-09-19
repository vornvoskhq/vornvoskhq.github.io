import React from "react";
import { Link } from "react-router-dom";
export default function ThankYou() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background px-6 text-center grain">
      <div className="scanline absolute inset-0" />
      <div className="relative z-10 max-w-xl">
        <p className="mb-6 font-mono text-[11px] tracking-mega text-signal">SIGNAL · RECEIVED</p>
        <h1 className="font-display text-5xl leading-[0.95] text-foreground md:text-7xl">
          Thank you for <em className="text-signal">funding</em> a breakthrough.
        </h1>
        <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-subdata">
          Your contribution is routed directly to active field deployments.
          A receipt is on its way to your inbox.
        </p>
        <Link
          to="/"
          data-cursor="hover"
          className="mt-10 inline-flex items-center gap-3 rounded-full border border-signal/50 px-6 py-3 font-mono text-[11px] tracking-wide-2 text-signal transition-all hover:bg-signal hover:text-background"
        >
          ← RETURN TO OPEN MATTER
        </Link>
      </div>
    </main>
  );
}