"use client";
import { Suspense, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BrandSection from "@/components/BrandSection";
import ArpinFeatureSection from "@/components/ArpinFeatureSection";
import StoreExperience from "@/components/StoreExperience";
import IntroductionSection from "@/components/IntroductionSection";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";
import { MarquesData } from "@/app/utils/types";
// import Image from "next/image"; // Unused

export default function Home() {
  const [marqueData, setMarqueData] = useState<MarquesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarques = async () => {
      try {
        const response = await fetch('/api/cms/marques');
        const data = await response.json();
        setMarqueData(data);
        // Debugging
        console.log("Home: marqueData.marques.length =", data?.marques?.length);
      } catch (error) {
        console.error('Erreur lors du chargement des marques:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarques();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="py-20 text-center">
          <div className="animate-pulse">
            <div className="h-8 w-1/2 mx-auto bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 w-2/3 mx-auto bg-gray-100 rounded-lg mb-8"></div>
            <div className="h-64 bg-gray-100 rounded-lg mb-6"></div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!marqueData) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="py-20 text-center">
          <p className="text-red-600">Erreur lors du chargement des données</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-amber-950">
      <Navbar />
      <HeroSection />
      <IntroductionSection />
      <TeamSection />

      <Suspense
        fallback={
          <div className="p-12 text-center">Chargement des marques...</div>
        }
      >
        <BrandSection brands={marqueData.marques} />
      </Suspense>

      <ArpinFeatureSection />
      <StoreExperience />
      <Footer />
    </main>
  );
}
