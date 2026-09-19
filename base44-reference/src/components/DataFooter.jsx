import React, { useState } from "react";
const CITIES = [
  { name: "Antofagasta", note: "Atacama strain arrays", coord: "23.6°S" },
  { name: "Reykjavík", note: "Ridge crystal growth", coord: "64.1°N" },
  { name: "Tokyo", note: "Acoustic glass studio", coord: "35.7°N" },
  { name: "Lagos", note: "Thermal lattice pilot", coord: "6.5°N" },
  { name: "Zürich", note: "Optics residency", coord: "47.4°N" },
  { name: "São Paulo", note: "Carbon weave field", coord: "23.5°S" },
];
export default function DataFooter() {
  const [hovered, setHovered] = useState(null);
  return (
    <footer id="contact" className="relative z-20 border-t border-border bg-background">
      <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-12">
        {/* CTA band */}
        <div className="mb-20 grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 md:col-span-9">
            <p className="mb-5 font-mono text-[11px] tracking-mega text-signal">06 / TRANSMIT</p>
            <h2 className="font-display text-5xl leading-[0.95] text-foreground md:text-7xl">
              Begin a <em className="text-signal">residency</em>, or just listen in.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-3">
            <a
              href="mailto:signal@openmatter.foundation"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 font-mono text-[11px] tracking-wide-2 text-foreground"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-signal/50 text-signal transition-all group-hover:bg-signal group-hover:text-background">
                →
              </span>
              SIGNAL@OPENMATTER.FOUNDATION
            </a>
          </div>
        </div>