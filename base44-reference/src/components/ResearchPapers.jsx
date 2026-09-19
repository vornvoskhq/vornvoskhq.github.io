import React from "react";
import { ArrowUpRight } from "lucide-react";
const PAPERS = [
  {
    title: "A generative model for inorganic materials design",
    summary:
      "A diffusion model that proposes millions of novel stable crystal structures, vastly expanding the catalogue of synthesizable inorganic materials.",
    authors: "Zeni et al.",
    venue: "Nature · 2025",
    inst: "Google DeepMind",
    href: "https://doi.org/10.1038/s41586-025-08628-5",
  },
  {
    title: "Scaling deep learning for materials discovery",
    summary:
      "DeepMind's GNoME model predicts 2.2 million new crystals, including 380,000 stable materials poised for experimental synthesis.",
    authors: "Merchant et al.",
    venue: "Nature · 2023",
    inst: "Google DeepMind",
    href: "https://doi.org/10.1038/s41586-023-06735-9",
  },
  {
    title: "A foundation model for atomistic materials chemistry (MACE)",
    summary:
      "A message-passing neural network that achieves chemically accurate interatomic potentials across the periodic table at low computational cost.",
    authors: "Batatia et al.",
    venue: "J. Chem. Phys. · 2025",
    inst: "University of Cambridge",
    href: "https://doi.org/10.1063/5.0297006",
  },
  {
    title: "MatterChat: a multimodal large language model for materials science",
    summary:
      "An LLM that reasons over crystal structures, predicting properties and proposing synthesis routes from natural-language queries.",
    authors: "Tang et al.",
    venue: "Nature Comp. Sci. · 2026",
    inst: "Multi-institution",