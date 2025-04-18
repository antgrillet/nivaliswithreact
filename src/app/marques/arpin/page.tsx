"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChangeEvent, FormEvent } from "react";
import ImageGallery from "@/components/ImageGallery";

export default function ArpinPage() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
    produit: "",
    acceptConditions: false,
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation basique
    if (!formData.nom || !formData.email || !formData.message) {
      setFormError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!formData.acceptConditions) {
      setFormError("Veuillez accepter les conditions générales.");
      return;
    }

    // Simulation d'envoi
    setTimeout(() => {
      setFormSubmitted(true);
      setFormError("");
    }, 1000);
  };

  const produits = [
    {
      id: "couvertures",
      nom: "Couvertures traditionnelles",
      image: "/img/Arpin/image4.jpeg",
    },
    { id: "plaids", nom: "Plaids et jetés", image: "/img/Arpin/image003.jpg" },
    {
      id: "decoration",
      nom: "Articles de décoration",
      image: "/img/Arpin/IMG_0253.jpg",
    },
    {
      id: "vetements",
      nom: "Vêtements en laine",
      image: "/img/Arpin/image4.jpeg",
    },
  ];

  return (
    <main className="min-h-screen bg-amber-50/60">
      <Navbar />

      {/* Hero section améliorée */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-amber-100/80 to-amber-50/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-64 -mt-32 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-16 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-amber-100/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
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

                <div className="flex items-center mb-6">
                  <div className="h-20 w-20 bg-white rounded-full shadow-md flex items-center justify-center mr-4 overflow-hidden border border-amber-200">
                    <Image
                      src="/img/Arpin/IMG_0253.jpg"
                      alt="Logo Arpin"
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold text-amber-900 tracking-tight">
                    Arpin
                  </h1>
                </div>

                <div className="mb-8">
                  <span className="inline-block bg-amber-200 text-amber-800 text-sm font-medium px-3 py-1 rounded-full mr-2 shadow-sm">
                    Tradition
                  </span>
                  <span className="inline-block bg-amber-200 text-amber-800 text-sm font-medium px-3 py-1 rounded-full mr-2 shadow-sm">
                    Artisanat
                  </span>
                  <span className="inline-block bg-amber-200 text-amber-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
                    Excellence française
                  </span>
                </div>

                <p className="text-xl text-amber-800 mb-8 leading-relaxed">
                  Marque historique française spécialisée dans les tissus de
                  laine et la confection artisanale de qualité, perpétuant un
                  savoir-faire traditionnel depuis 1817. Chaque création Arpin
                  est le fruit d&apos;un travail minutieux respectant des
                  méthodes ancestrales.
                </p>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="#devis"
                    className="inline-flex items-center px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors shadow-md"
                  >
                    Demander un devis
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 ml-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </a>

                  <a
                    href="#catalogue"
                    className="inline-flex items-center px-6 py-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors shadow-sm"
                  >
                    Télécharger le catalogue
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 ml-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </a>

                  <a
                    href="#histoire"
                    className="inline-flex items-center px-6 py-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors shadow-sm"
                  >
                    Découvrir l'histoire
                  </a>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-1/2"
            >
              <div className="relative h-[450px] w-full rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/img/Arpin/image4.jpeg"
                  alt="Textile Arpin"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block bg-amber-100/90 text-amber-900 text-xs font-medium px-3 py-1 rounded-full mb-3 shadow-sm">
                    Depuis 1817
                  </span>
                  <h3 className="text-white font-semibold text-2xl">
                    Un héritage textile d'exception
                  </h3>
                  <p className="text-white/90 mt-2">
                    Découvrez l'élégance intemporelle de nos créations
                    artisanales
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Histoire section améliorée */}
      <section id="histoire" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Notre héritage
            </span>
            <h2 className="text-4xl font-bold text-amber-900 mb-6">
              Un savoir-faire transmis depuis des générations
            </h2>
            <p className="text-amber-700 text-xl">
              Découvrez l'histoire exceptionnelle de la maison Arpin, dernière
              filature artisanale de Savoie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-amber-900 text-lg mb-6 leading-relaxed">
                Fondée en 1817 dans le village de Séez en Savoie, la Filature
                Arpin perpétue depuis plus de deux siècles l&apos;art du travail
                de la laine selon des méthodes traditionnelles. Véritable
                institution du patrimoine textile français, elle transforme la
                laine brute en étoffes d&apos;exception.
              </p>

              <p className="text-amber-900 text-lg mb-6 leading-relaxed">
                Les méthodes ancestrales utilisées, combinées à des gestes
                précis transmis de génération en génération, donnent naissance à
                des tissus robustes aux propriétés thermiques exceptionnelles.
                La draperie savoyarde, le fameux &quot;Drap de Bonneval&quot;,
                est ainsi reconnue pour sa résistance et sa chaleur
                incomparables.
              </p>

              <p className="text-amber-900 text-lg mb-8 leading-relaxed">
                L&apos;entreprise a su évoluer avec son temps tout en conservant
                l&apos;essence de son savoir-faire. Aujourd&apos;hui, Arpin
                propose des collections pour l&apos;habitat et le vêtement qui
                allient tradition et modernité, perpétuant l&apos;excellence
                d&apos;un artisanat d&apos;exception.
              </p>

              <div className="flex items-center p-6 bg-amber-50 rounded-lg shadow-sm">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                </div>
                <p className="text-amber-800 italic font-medium text-lg">
                  &quot;Le patrimoine vivant d&apos;un savoir-faire unique,
                  classé au titre des monuments historiques depuis 2005.&quot;
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="relative h-72 w-full rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/img/Arpin/image4.jpeg"
                  alt="Tissage Arpin"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="relative h-72 w-full rounded-lg overflow-hidden shadow-lg mt-10">
                <Image
                  src="/img/Arpin/image003.jpg"
                  alt="Atelier Arpin"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="relative h-72 w-full rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/img/Arpin/IMG_0253.jpg"
                  alt="Détail tissu Arpin"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="relative h-72 w-full rounded-lg overflow-hidden shadow-lg mt-10">
                <Image
                  src="/img/Arpin/image4.jpeg"
                  alt="Collection Arpin"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Catalogue PDF améliorée */}
      <section
        id="catalogue"
        className="py-24 bg-gradient-to-b from-amber-50/60 to-amber-100/40"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                Notre catalogue
              </span>
              <h2 className="text-4xl font-bold text-amber-900 mb-6">
                Découvrez nos créations exclusives
              </h2>
              <p className="text-amber-700 text-xl mb-8 max-w-3xl mx-auto">
                Explorez notre sélection de produits artisanaux en laine, conçus
                selon des techniques traditionnelles et un savoir-faire
                d'exception
              </p>
              <a
                href="/Catalogue sur Mesure Arpin 2022.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors shadow-md mb-12 text-lg"
              >
                Télécharger le catalogue complet
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </a>
            </div>

            <div className="w-full bg-white rounded-xl shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-amber-50/30 -z-10"></div>
              <div className="absolute top-4 right-4 z-20">
                <a
                  href="/Catalogue sur Mesure Arpin 2022.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors shadow-md text-sm"
                >
                  Ouvrir en plein écran
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
              </div>
              <div className="relative w-full" style={{ height: "70vh" }}>
                <iframe
                  src="/Catalogue sur Mesure Arpin 2022.pdf"
                  className="w-full h-full"
                  title="Catalogue Arpin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {produits.slice(0, 3).map((produit) => (
                <div
                  key={produit.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                    <Image
                      src={produit.image}
                      alt={produit.nom}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-amber-900 mb-2">
                    {produit.nom}
                  </h3>
                  <a
                    href="#devis"
                    className="inline-flex items-center text-amber-700 hover:text-amber-900 transition-colors"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, produit: produit.nom }))
                    }
                  >
                    Demander un devis
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 ml-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Galerie d'images améliorée */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Galerie
            </span>
            <h2 className="text-4xl font-bold text-amber-900 mb-6">
              Nos créations en images
            </h2>
            <p className="text-amber-700 text-xl">
              Découvrez la beauté et la finesse de nos produits artisanaux
            </p>
          </div>
        </div>
        <ImageGallery imageFolderPath="/img/Arpin/" marqueNom="Arpin" />
      </section>

      {/* Section devis améliorée */}
      <section id="devis" className="py-24 bg-amber-50 relative">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/img/Arpin/texture-pattern.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/2 p-8 lg:p-12">
                <span className="inline-block bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                  Contact
                </span>
                <h2 className="text-3xl font-bold text-amber-900 mb-6">
                  Demande de devis personnalisé
                </h2>
                <p className="text-amber-700 mb-8 text-lg">
                  Vous souhaitez obtenir un devis pour un article Arpin ?
                  Remplissez le formulaire ci-dessous et nous vous répondrons
                  dans les plus brefs délais.
                </p>

                {formSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-16 h-16 text-green-500 mx-auto mb-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>

                    <h3 className="text-2xl font-medium text-green-800 mb-4">
                      Demande envoyée avec succès !
                    </h3>
                    <p className="text-green-700 mb-6 text-lg">
                      Nous avons bien reçu votre demande de devis. Notre équipe
                      vous contactera très prochainement.
                    </p>
                    <Button
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({
                          nom: "",
                          email: "",
                          telephone: "",
                          message: "",
                          produit: "",
                          acceptConditions: false,
                        });
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg"
                    >
                      Faire une nouvelle demande
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="nom"
                          className="block text-sm font-medium text-amber-900 mb-1"
                        >
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          id="nom"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-amber-200 rounded-lg bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-amber-900 mb-1"
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-amber-200 rounded-lg bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="telephone"
                        className="block text-sm font-medium text-amber-900 mb-1"
                      >
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-200 rounded-lg bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="produit"
                        className="block text-sm font-medium text-amber-900 mb-1"
                      >
                        Produit qui vous intéresse
                      </label>
                      <select
                        id="produit"
                        name="produit"
                        value={formData.produit}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-200 rounded-lg bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                      >
                        <option value="">Sélectionnez un produit</option>
                        {produits.map((produit) => (
                          <option key={produit.id} value={produit.nom}>
                            {produit.nom}
                          </option>
                        ))}
                        <option value="autre">
                          Autre (préciser dans le message)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-amber-900 mb-1"
                      >
                        Votre message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-200 rounded-lg bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                        required
                        placeholder="Décrivez votre projet ou posez-nous vos questions..."
                      ></textarea>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="acceptConditions"
                          name="acceptConditions"
                          type="checkbox"
                          checked={formData.acceptConditions}
                          onChange={handleChange}
                          className="h-4 w-4 text-amber-700 border-amber-300 rounded focus:ring-amber-500"
                          required
                        />
                      </div>
                      <label
                        htmlFor="acceptConditions"
                        className="ml-2 block text-sm text-amber-700"
                      >
                        J&apos;accepte les conditions générales et la politique
                        de confidentialité *
                      </label>
                    </div>

                    {formError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                        {formError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 text-lg"
                    >
                      Envoyer ma demande de devis
                    </Button>

                    <p className="text-xs text-amber-700 mt-4">
                      * Champs obligatoires. Nous nous engageons à respecter la
                      confidentialité de vos données.
                    </p>
                  </form>
                )}
              </div>

              <div className="w-full lg:w-1/2 bg-gradient-to-br from-amber-50 to-amber-100/80 p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-200/50 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-48 h-48 bg-amber-300/30 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-amber-900 mb-8">
                    Pourquoi choisir Arpin ?
                  </h3>

                  <div className="space-y-8">
                    <div className="flex bg-white/80 p-5 rounded-lg shadow-sm">
                      <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full bg-amber-200 text-amber-800 mr-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-7 h-7"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-amber-900 mb-2">
                          Savoir-faire unique
                        </h4>
                        <p className="text-amber-800">
                          Plus de 200 ans d'expertise dans la confection de
                          textiles d'exception, avec des méthodes transmises de
                          génération en génération.
                        </p>
                      </div>
                    </div>

                    <div className="flex bg-white/80 p-5 rounded-lg shadow-sm">
                      <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full bg-amber-200 text-amber-800 mr-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-7 h-7"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-amber-900 mb-2">
                          Qualité premium
                        </h4>
                        <p className="text-amber-800">
                          Des matières premières sélectionnées avec soin pour
                          des produits durables et des finitions impeccables.
                        </p>
                      </div>
                    </div>

                    <div className="flex bg-white/80 p-5 rounded-lg shadow-sm">
                      <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full bg-amber-200 text-amber-800 mr-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-7 h-7"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-amber-900 mb-2">
                          Fabrication française
                        </h4>
                        <p className="text-amber-800">
                          Tous nos produits sont fabriqués dans notre atelier
                          historique en Savoie, soutenant l'artisanat local.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
                    <h4 className="text-lg font-medium text-amber-900 mb-3">
                      Besoin d'aide ?
                    </h4>
                    <p className="text-amber-800 mb-4">
                      Notre équipe est à votre disposition pour toute question
                      ou conseil personnalisé.
                    </p>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-amber-900 font-medium text-lg">
                          +33 (0)4 56 78 90 12
                        </p>
                        <p className="text-amber-700">
                          Du lundi au vendredi, 9h-18h
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
