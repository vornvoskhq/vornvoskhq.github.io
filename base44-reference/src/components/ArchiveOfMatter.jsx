import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
const SPECIMENS = [
  {
    id: "SIL-01",
    title: "Silicon Lattice",
    discipline: "Semiconductor",
    img: "https://media.base44.com/images/public/6aaeebc7df18affaa8ebdeab/564bfc7e5_generated_image.png",
    summary: "Etched microstructures that translate thermal gradients into readable electrical signal.",
    metrics: [
      ["Substrate", "Si ⟨100⟩"],
      ["Resolution", "0.4 µm"],
      ["Sensitivity", "18 µV/K"],
    ],
  },
  {
    id: "CRY-02",
    title: "Dendritic Growth",
    discipline: "Mineralogy",
    img: "https://media.base44.com/images/public/6aaeebc7df18affaa8ebdeab/2ee27bdf8_generated_image.png",
    summary: "Self-organising crystal branches that map acoustic vibration into visible form.",
    metrics: [
      ["Growth rate", "0.2 nm/s"],
      ["Frequency", "40–800 Hz"],
      ["Yield", "73%"],
    ],
  },
  {
    id: "GLS-03",
    title: "Refractive Glass",
    discipline: "Optics",
    img: "https://media.base44.com/images/public/6aaeebc7df18affaa8ebdeab/ae897ad69_generated_image.png",
    summary: "Smart-glass composites splitting a single beam into a calibrated spectral signature.",
    metrics: [
      ["Bands", "380–780 nm"],
      ["Index", "1.52"],