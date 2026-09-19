import React, { useEffect, useRef, useState } from "react";
/**
 * CustomCursor — a crosshair "sensor" cursor with a live frequency readout.
 * Desktop-only; falls back to native cursor on touch devices.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const readoutRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFine) return;
    setEnabled(true);
    document.body.classList.add("cursor-override");
    let rx = 0, ry = 0, dx = 0, dy = 0;
    let freq = 432;
    let raf;
    const onMove = (e) => {
      dx = e.clientX;
      dy = e.clientY;
      const target = e.target;
      const interactive = target.closest("a, button, [data-cursor='hover']");
      setHovering(!!interactive);
    };
    const loop = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      }
      if (ringRef.current) {