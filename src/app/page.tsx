import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import IntroductionSection from "@/components/IntroductionSection";
import BrandSection from "@/components/BrandSection";
import ArpinFeatureSection from "@/components/ArpinFeatureSection";
import TeamSection from "@/components/TeamSection";
import StoreExperience from "@/components/StoreExperience";
import Footer from "@/components/Footer";
import { getMarques } from "@/lib/data/marques";
import { getContent } from "@/lib/data/content";

interface TeamMember {
  name?: string;
  role?: string;
  description?: string;
  image?: string;
}

interface HomepageContent {
  hero?: { title?: string; subtitle?: string; description?: string };
  introduction?: {
    title?: string;
    paragraph1?: string;
    paragraph2?: string;
    hours?: string;
    address?: string;
  };
  brands?: { title?: string; subtitle?: string };
  arpin?: { title?: string; subtitle?: string };
  team?: { title?: string; description?: string; members?: TeamMember[] };
  store?: { title?: string; subtitle?: string };
}

export const revalidate = 300;

export default async function Home() {
  const [marques, rawContent] = await Promise.all([
    getMarques(),
    getContent("homepage"),
  ]);
  const content = rawContent as HomepageContent;

  return (
    <main className="min-h-screen bg-background">
      <Navbar overHero />
      <HeroSection brands={marques} content={content.hero} />
      <IntroductionSection content={content.introduction} />
      <BrandSection brands={marques} content={content.brands} />
      <ArpinFeatureSection content={content.arpin} />
      <TeamSection content={content.team} />
      <StoreExperience content={content.store} />
      <Footer />
    </main>
  );
}
