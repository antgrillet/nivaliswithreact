"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/ImageGallery";
import marqueData from "@/data/marque.json";

// Interface pour la structure des données de marque
interface MarqueData {
  nom: string;
  description: string;
  description_fr?: string;
  description_en?: string;
  mainImage: string;
  logo: string;
  tags: string[];
  type: string;
  website?: string;
  histoire?: string;
  images?: string[];
  imageFolder?: string;
  produits?: {
    id?: string;
    nom: string;
    description: string;
    image: string;
    prix?: string;
  }[];
  contact?: {
    adresse?: string;
    address?: string;
    telephone?: string;
    phone?: string;
    email?: string;
    horaires?: string;
  };
}

export default function MarqueDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [marque, setMarque] = useState<MarqueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Convertir le slug en nom de marque (inversant le processus de slugification)
    const slugToNom = (slug: string) => {
      return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    };

    // Chercher la marque correspondante
    const foundMarque = marqueData.marques.find(
      (m) => m.nom.toLowerCase() === slugToNom(slug).toLowerCase()
    );

    if (foundMarque) {
      setMarque(foundMarque as MarqueData);
    }

    setLoading(false);
  }, [slug]);

  // Si la marque n'est pas trouvée, afficher une page 404
  if (!loading && !marque) {
    notFound();
  }

  if (loading || !marque) {
    return (
      <main className="min-h-screen bg-amber-50/50">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-8 w-1/2 mx-auto bg-amber-200 rounded-lg mb-4"></div>
              <div className="h-4 w-2/3 mx-auto bg-amber-100 rounded-lg mb-8"></div>
              <div className="h-64 bg-amber-100 rounded-lg mb-6"></div>
              <div className="h-4 bg-amber-100 rounded-lg mb-3"></div>
              <div className="h-4 bg-amber-100 rounded-lg mb-3"></div>
              <div className="h-4 bg-amber-100 rounded-lg"></div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50/50">
      <Navbar />

      {/* Hero de la page marque */}
      <section className="relative pt-24 pb-16 bg-gradient-to-b from-amber-100/50 to-amber-50/30">
        <div className="absolute inset-0 opacity-5 pattern-dots"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:w-1/2">
              <Link
                href="/marques"
                className="inline-flex items-center text-amber-700 hover:text-amber-900 mb-6 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                    clipRule="evenodd"
                  />
                </svg>
                Retour aux marques
              </Link>

              <div className="flex items-center mb-4">
                <div className="h-16 w-16 bg-white rounded-full shadow-md flex items-center justify-center mr-4 overflow-hidden">
                  <Image
                    src={marque.logo}
                    alt={`Logo de ${marque.nom}`}
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-amber-900">
                  {marque.nom}
                </h1>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {marque.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-sm bg-amber-200 text-amber-800 px-3 py-1 rounded-full font-medium">
                  {marque.type}
                </span>
              </div>

              <p className="text-lg text-amber-800 mb-6 leading-relaxed">
                {marque.description}
              </p>

              {marque.website && (
                <a
                  href={marque.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors"
                >
                  Visiter le site officiel
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 ml-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
            </div>

            <div className="w-full md:w-1/2 md:pl-8">
              <div className="relative h-80 md:h-96 w-full rounded-xl overflow-hidden shadow-xl">
                <Image
                  src={marque.mainImage}
                  alt={`Image principale de ${marque.nom}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie d'images */}
      {marque.images && marque.images.length > 0 && (
        <ImageGallery
          imageFolderPath={marque.imageFolder || `/img/${marque.nom}/`}
          marqueNom={marque.nom}
        />
      )}

      {/* Section histoire et valeurs */}
      {marque.histoire && (
        <section className="py-16 bg-white border-y border-amber-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-8 text-center">
                Histoire et valeurs
              </h2>

              <div className="prose prose-amber mx-auto">
                <p className="text-amber-900 leading-relaxed text-lg">
                  {marque.histoire}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section produits phares */}
      {marque.produits && marque.produits.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-8 text-center">
              Produits phares
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {marque.produits?.map((produit, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-md border border-amber-100 hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-60 w-full bg-amber-100">
                    <Image
                      src={produit.image}
                      alt={produit.nom}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-amber-900 mb-2">
                      {produit.nom}
                    </h3>
                    <p className="text-amber-700 mb-4 line-clamp-3">
                      {produit.description}
                    </p>

                    {produit.prix && (
                      <div className="text-lg font-medium text-amber-900 mb-4">
                        {produit.prix} €
                      </div>
                    )}

                    <Link
                      href={`/produits/${
                        produit.id ||
                        produit.nom.toLowerCase().replace(/\s+/g, "-")
                      }`}
                      className="inline-block px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition-colors"
                    >
                      Découvrir
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section coordonnées */}
      {marque.contact && (
        <section className="py-16 bg-amber-100/50 border-t border-amber-200">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-8 text-center">
                Contact et coordonnées
              </h2>

              <div className="bg-white rounded-xl p-8 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {marque.contact.address && (
                    <div className="flex items-start">
                      <div className="mr-4 bg-amber-100 p-3 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-6 h-6 text-amber-700"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-amber-900 mb-2">
                          Adresse
                        </h3>
                        <p className="text-amber-800 whitespace-pre-line">
                          {marque.contact.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {marque.contact.email && (
                    <div className="flex items-start">
                      <div className="mr-4 bg-amber-100 p-3 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-6 h-6 text-amber-700"
                        >
                          <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                          <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-amber-900 mb-2">
                          Email
                        </h3>
                        <a
                          href={`mailto:${marque.contact.email}`}
                          className="text-amber-700 hover:text-amber-900 hover:underline transition-colors"
                        >
                          {marque.contact.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {marque.contact.phone && (
                    <div className="flex items-start">
                      <div className="mr-4 bg-amber-100 p-3 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-6 h-6 text-amber-700"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-amber-900 mb-2">
                          Téléphone
                        </h3>
                        <a
                          href={`tel:${marque.contact.phone}`}
                          className="text-amber-700 hover:text-amber-900 hover:underline transition-colors"
                        >
                          {marque.contact.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {marque.website && (
                    <div className="flex items-start">
                      <div className="mr-4 bg-amber-100 p-3 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-6 h-6 text-amber-700"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-amber-900 mb-2">
                          Site Web
                        </h3>
                        <a
                          href={marque.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-700 hover:text-amber-900 hover:underline transition-colors break-all"
                        >
                          {marque.website.replace(/^https?:\/\/(www\.)?/, "")}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section marques similaires */}
      <section className="py-16 bg-white border-t border-amber-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-8 text-center">
            Marques similaires
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marqueData.marques
              .filter(
                (m) =>
                  m.nom !== marque.nom &&
                  m.tags.some((tag) => marque.tags.includes(tag))
              )
              .slice(0, 3)
              .map((similarMarque, index) => (
                <Link
                  href={`/marques/${similarMarque.nom
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  key={index}
                  className="bg-amber-50 hover:bg-amber-100 rounded-xl p-6 border border-amber-100 flex items-center transition-colors"
                >
                  <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center mr-4 overflow-hidden">
                    <Image
                      src={similarMarque.logo}
                      alt={`Logo de ${similarMarque.nom}`}
                      width={35}
                      height={35}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-900">
                      {similarMarque.nom}
                    </h3>
                    <p className="text-sm text-amber-700">
                      {similarMarque.type}
                    </p>
                  </div>
                </Link>
              ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/marques"
              className="inline-flex items-center px-5 py-3 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition-colors"
            >
              Voir toutes les marques
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 ml-2"
              >
                <path
                  fillRule="evenodd"
                  d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
