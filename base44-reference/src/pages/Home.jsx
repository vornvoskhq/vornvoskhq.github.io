import React from "react";
import FieldGrid from "@/components/FieldGrid";
import CustomCursor from "@/components/CustomCursor";
import ScrollFrequency from "@/components/ScrollFrequency";
import Hero from "@/components/Hero";
import ArchiveOfMatter from "@/components/ArchiveOfMatter";
import Collaboratory from "@/components/Collaboratory";
import Dispatch from "@/components/Dispatch";
import ResearchPapers from "@/components/ResearchPapers";
import ArtGallery from "@/components/ArtGallery";
import LegacyLedger from "@/components/LegacyLedger";
import DataFooter from "@/components/DataFooter";
export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-background text-foreground">
      <FieldGrid />
      <CustomCursor />
      <ScrollFrequency />
      <div className="relative z-20">
        <Hero />
        <ArchiveOfMatter />
        <Collaboratory />
        <Dispatch />
        <ResearchPapers />
        <ArtGallery />
        <LegacyLedger />
        <DataFooter />
      </div>
    </main>
  );
}