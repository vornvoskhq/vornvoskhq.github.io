import React, { useRef, useState } from "react";
import { Image } from "@/components/ui/image";
const INPUT_IMG = "https://media.base44.com/images/public/6aaeebc7df18affaa8ebdeab/c63d74135_generated_618cb3a2.jpg";
const OUTPUT_IMG = "https://media.base44.com/images/public/6aaeebc7df18affaa8ebdeab/a003165c3_generated_b138aa3c.jpg";
export default function Collaboratory() {
  const [pos, setPos] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);
  const update = (clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };
  React.useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      update(e.touches ? e.touches[0].clientX : e.clientX);
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);
  return (