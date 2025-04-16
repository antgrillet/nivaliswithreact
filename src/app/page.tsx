"use client";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BrandSection from "@/components/BrandSection";
import ArpinFeatureSection from "@/components/ArpinFeatureSection";
import Footer from "@/components/Footer";
import marqueData from "@/data/marque.json";
import { MarquesData } from "@/app/utils/types";

export default function Home() {
  // Type casting pour assurer la cohérence des types
  const typedMarqueData = marqueData as MarquesData;

  // Debugging
  console.log("Home: marqueData.marques.length =", marqueData?.marques?.length);

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <Suspense
        fallback={
          <div className="p-12 text-center">Chargement des marques...</div>
        }
      >
        <BrandSection brands={typedMarqueData.marques} />
      </Suspense>
      <ArpinFeatureSection />
      <Footer />
    </main>
  );
}
