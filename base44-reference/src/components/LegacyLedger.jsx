import React, { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
const DEPLOYMENTS = [
  { label: "Atacama Desert", value: "Active sensors · 412", detail: "Strain & thermal arrays across the salt flats." },
  { label: "Reykjanes Ridge", value: "Active sensors · 128", detail: "Hydrothermal crystalline growth monitors." },
  { label: "Tokyo Studio", value: "Active sensors · 64", detail: "Acoustic-glass installation in residence." },
];
const TIERS = [
  { id: "specimen", name: "Specimen", amount: "$250", desc: "Sponsor one sensor prototype." },
  { id: "lattice", name: "Lattice", amount: "$2,500", desc: "Underwrite a residency material study." },
  { id: "foundation", name: "Foundation", amount: "$25,000", desc: "Endow a full artist–scientist residency." },
];
export default function LegacyLedger() {
  const [active, setActive] = useState(0);
  const [loadingTier, setLoadingTier] = useState(null);
  const checkout = async (id) => {
    try {
      setLoadingTier(id);
      const res = await base44.functions.invoke("create-checkout", { productId: id });
      const redirectUrl = res?.data?.redirectUrl;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        alert("Checkout could not start. Please try again.");
      }
    } catch (err) {
      console.error("checkout failed", err);
      alert("Checkout could not start. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  };