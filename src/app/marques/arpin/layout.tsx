import type { Metadata } from "next";

// Métadonnées SEO complètes pour la page Arpin
export const metadata: Metadata = {
  metadataBase: new URL("https://nivalis-lesgets.fr"),
  title: "Arpin aux Gets | Plaids & Textiles Laine Savoyarde | Nivalis",
  description:
    "Découvrez Arpin chez Nivalis aux Gets : plaids, couvertures et textiles en laine de Savoie depuis 1817. Revendeur officiel Portes du Soleil. Catalogue PDF disponible.",
  keywords: [
    "Arpin",
    "plaid laine Savoie",
    "couverture laine française",
    "textile montagne",
    "laine Savoie",
    "Nivalis Les Gets",
    "drap de Bonneval",
    "artisanat savoyard",
    "Portes du Soleil",
    "décoration chalet",
  ],
  authors: [{ name: "Nivalis" }],
  creator: "Nivalis",
  publisher: "Nivalis",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://nivalis-lesgets.fr/marques/arpin",
    languages: {
      "fr-FR": "https://nivalis-lesgets.fr/marques/arpin",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://nivalis-lesgets.fr/marques/arpin",
    siteName: "Nivalis Les Gets",
    title: "Arpin aux Gets | Plaids & Textiles Laine Savoyarde",
    description:
      "Découvrez la collection Arpin chez Nivalis : plaids, couvertures et textiles en laine de Savoie depuis 1817. Artisanat d'exception et savoir-faire ancestral.",
    images: [
      {
        url: "/img/Arpin/image4.jpeg",
        width: 1200,
        height: 630,
        alt: "Collection Arpin - Plaids et textiles en laine de Savoie chez Nivalis Les Gets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arpin aux Gets | Plaids & Textiles Laine Savoyarde | Nivalis",
    description:
      "Découvrez Arpin chez Nivalis : plaids et textiles en laine de Savoie depuis 1817. Revendeur officiel Portes du Soleil.",
    images: ["/img/Arpin/image4.jpeg"],
  },
};

// JSON-LD Structured Data
function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // Organisation/Store
      {
        "@type": "ClothingStore",
        "@id": "https://nivalis-lesgets.fr/#store",
        name: "Nivalis Les Gets",
        description:
          "Boutique de mode et lifestyle montagne aux Gets, Portes du Soleil",
        url: "https://nivalis-lesgets.fr",
        logo: "https://nivalis-lesgets.fr/img/logo.svg",
        image: "https://nivalis-lesgets.fr/img/store.jpg",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Centre Village",
          addressLocality: "Les Gets",
          postalCode: "74260",
          addressRegion: "Haute-Savoie",
          addressCountry: "FR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 46.1558,
          longitude: 6.6697,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "10:00",
            closes: "19:00",
          },
        ],
        priceRange: "€€€",
        paymentAccepted: "Cash, Credit Card",
        currenciesAccepted: "EUR",
      },
      // Brand - Arpin
      {
        "@type": "Brand",
        "@id": "https://nivalis-lesgets.fr/marques/arpin#brand",
        name: "Arpin",
        description:
          "Manufacture de laine savoyarde fondée en 1817. Spécialiste du drap de Bonneval et des textiles en laine naturelle.",
        url: "https://www.arpin1817.com",
        logo: "https://nivalis-lesgets.fr/img/Arpin/logo.jpeg",
        foundingDate: "1817",
        foundingLocation: {
          "@type": "Place",
          name: "Séez, Savoie, France",
        },
        slogan: "L'excellence de la laine depuis 1817",
        knowsAbout: [
          "Laine de Savoie",
          "Drap de Bonneval",
          "Textile artisanal",
          "Plaids",
          "Couvertures",
        ],
      },
      // BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "@id": "https://nivalis-lesgets.fr/marques/arpin#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: "https://nivalis-lesgets.fr",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Nos Marques",
            item: "https://nivalis-lesgets.fr/marques",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Arpin",
            item: "https://nivalis-lesgets.fr/marques/arpin",
          },
        ],
      },
      // WebPage
      {
        "@type": "WebPage",
        "@id": "https://nivalis-lesgets.fr/marques/arpin#webpage",
        url: "https://nivalis-lesgets.fr/marques/arpin",
        name: "Arpin aux Gets | Plaids & Textiles Laine Savoyarde | Nivalis",
        description:
          "Découvrez la collection Arpin chez Nivalis aux Gets : plaids, couvertures et textiles en laine de Savoie depuis 1817.",
        isPartOf: {
          "@id": "https://nivalis-lesgets.fr/#website",
        },
        breadcrumb: {
          "@id": "https://nivalis-lesgets.fr/marques/arpin#breadcrumb",
        },
        about: {
          "@id": "https://nivalis-lesgets.fr/marques/arpin#brand",
        },
        mainEntity: {
          "@id": "https://nivalis-lesgets.fr/marques/arpin#brand",
        },
        inLanguage: "fr-FR",
      },
      // FAQPage
      {
        "@type": "FAQPage",
        "@id": "https://nivalis-lesgets.fr/marques/arpin#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Qu'est-ce que le drap de Bonneval ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Le drap de Bonneval est un textile traditionnel savoyard en laine feutrée, fabriqué par Arpin depuis 1817. Ce tissu dense et résistant est utilisé pour les plaids, couvertures et vêtements de montagne.",
            },
          },
          {
            "@type": "Question",
            name: "Où acheter des produits Arpin aux Gets ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Vous pouvez découvrir et acheter la collection Arpin chez Nivalis, boutique située au centre village des Gets, dans les Portes du Soleil. Nous sommes revendeur officiel de la marque.",
            },
          },
          {
            "@type": "Question",
            name: "Quels produits Arpin sont disponibles chez Nivalis ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Chez Nivalis, vous trouverez une sélection de plaids, couvertures, écharpes et accessoires en laine Arpin. Le catalogue complet est disponible en téléchargement sur notre site.",
            },
          },
          {
            "@type": "Question",
            name: "Comment entretenir un plaid Arpin ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Les produits Arpin en laine se nettoient de préférence à sec. Pour un entretien régulier, aérez votre plaid à l'extérieur. En cas de tache, utilisez un chiffon humide avec du savon doux.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function ArpinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd />
      {children}
    </>
  );
}
