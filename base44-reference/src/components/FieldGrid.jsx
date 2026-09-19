import React, { useEffect, useRef, useState } from "react";
/**
 * FieldGrid — 12 thin vertical "sensor" rules spanning the viewport.
 * Lines subtly glow when crossed by a hovered element (via mouse proximity).
 */
export default function FieldGrid() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  useEffect(() => {
    const handleMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const colWidth = rect.width / 12;
      const idx = Math.floor(x / colWidth);
      setActiveIndex(idx);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);
  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-10 hidden md:block"
      aria-hidden="true"
    >
      <div className="relative h-full w-full">
        {Array.from({ length: 12 }).map((_, i) => {
          const active = activeIndex === i;
          return (
            <div
              key={i}
              className="absolute top-0 h-full w-px transition-all duration-500 ease-out"
              style={{
                left: `${(i / 12) * 100}%`,