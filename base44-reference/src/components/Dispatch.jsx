import React from "react";
const INSTALLATIONS = [
  { title: "A Listening Field, Atacama", source: "e-flux", date: "09.2026", href: "https://www.e-flux.com/announcements/" },
  { title: "Glass Refractions, Tokyo", source: "Artforum", date: "08.2026", href: "https://www.artforum.com/news/" },
  { title: "Bismuth Acoustics, Zürich", source: "Frieze", date: "07.2026", href: "https://www.frieze.com/" },
];
const READINGS = [
  { title: "Phonon DOS of oxide lattices", source: "arXiv · cond-mat", date: "09.2026", href: "https://arxiv.org/list/cond-mat/recent" },
  { title: "Sensors for human-centered communities", source: "ACM SIGCHI", date: "08.2026", href: "https://sigchi.org/" },
  { title: "Adaptive materials & care", source: "Nature Materials", date: "07.2026", href: "https://www.nature.com/naturematerials/" },
];
function Column({ label, items }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="h-1.5 w-1.5 rounded-full bg-signal" />
        <span className="font-mono text-[10px] tracking-wide-2 text-subdata">{label}</span>
      </div>
      <div className="border-t border-border">
        {items.map((it) => (
          <a
            key={it.title}
            href={it.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="group flex items-center justify-between gap-4 border-b border-border py-5 transition-colors hover:bg-signal/5"
          >
            <div className="min-w-0">
              <h3 className="font-display text-2xl text-foreground transition-colors group-hover:text-signal md:text-3xl">
                {it.title}
              </h3>
              <div className="mt-1 font-mono text-[10px] tracking-wide-2 text-subdata">
                VIA {it.source.toUpperCase()} · {it.date}
              </div>