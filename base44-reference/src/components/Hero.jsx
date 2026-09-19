import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ParticleField from "@/components/ParticleField";
const HERO_IMG = "https://media.base44.com/images/public/6aaeebc7df18affaa8ebdeab/b8da4c45d_generated_image.png";
export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const nodeY = Math.min(scrollY * 0.5, 240);
  return (
    <section ref={ref} className="relative min-h-[100svh] w-full overflow-hidden grain">
      {/* generative particle layer */}
      <div className="absolute inset-0 opacity-70">
        <ParticleField />
      </div>
      {/* material backdrop */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt=""
          className="crystallize-in h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="absolute inset-0 scanline" />
      </div>
      {/* top bar */}
      <div className="relative z-30 flex items-center justify-between px-6 pt-7 md:px-12">