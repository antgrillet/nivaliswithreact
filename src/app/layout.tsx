import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { getSiteSettings } from "@/lib/data/content";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteSettings();
  const defaultTitle =
    seo?.defaultTitle?.trim() || "Nivalis — Marques premium outdoor · Les Gets";
  const template = seo?.titleTemplate?.trim() || "%s — Nivalis";
  const description =
    seo?.description?.trim() ||
    "Maison de marques premium outdoor aux Gets : Arpin, The North Face, UGG et une sélection de maisons d'exception. Vêtements et accessoires de montagne.";
  const ogImage = seo?.ogImage?.trim();

  return {
    title: { default: defaultTitle, template },
    description,
    metadataBase: new URL("https://www.nivalislesgets.com"),
    openGraph: {
      title: defaultTitle,
      description,
      type: "website",
      locale: "fr_FR",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geist.variable} ${fraunces.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="bottom-right" theme="light" richColors={false} />
      </body>
    </html>
  );
}
