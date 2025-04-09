"use client";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BrandSection from "@/components/BrandSection";
import ArpinFeatureSection from "@/components/ArpinFeatureSection";
import Footer from "@/components/Footer";
import marqueData from "@/data/marque.json";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <Suspense
        fallback={
          <div className="p-12 text-center">Chargement des marques...</div>
        }
      >
        <BrandSection marques={marqueData.marques} />
      </Suspense>
      <ArpinFeatureSection />
      <Footer />
    </main>
  );
}
