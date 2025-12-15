import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function IntroductionSection() {
  const [content, setContent] = useState<any>({
    title: "Bienvenue à Nivalis",
    paragraph1:
      "Votre boutique de vêtements et accessoires de montagne aux Gets. Située au cœur de la station, nous vous proposons une sélection soignée des plus grandes marques outdoor et lifestyle.",
    paragraph2:
      "Venez découvrir notre espace chaleureux où vous pourrez essayer et choisir vos vêtements préférés, avec l'accompagnement de notre équipe passionnée.",
    hours_label: "Horaires d'ouverture :",
    hours: "Lun-Dim: 10:00–12:30, 14:30–19:00",
    address_label: "Adresse :",
    address: "21 Rte du Front de Neige, 74260 Les Gets",
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(
          "/api/cms/content?section=homepage&subsection=introduction"
        );
        if (res.ok) {
          const data = await res.json();
          setContent(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du contenu:", error);
      }
    };
    fetchContent();
  }, []);
  return (
    <section className="relative py-40 px-4">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/acceuil.jpeg"
          alt="Boutique Nivalis aux Gets"
          fill
          className="object-cover brightness-[0.65]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Texte de gauche */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-white"
          >
            <h2 className="text-5xl font-bold drop-shadow-lg">{content.title}</h2>
            <div className="space-y-6 text-lg leading-relaxed">
              <p className="text-amber-50/95">{content.paragraph1}</p>
              <p className="text-amber-100/90">{content.paragraph2}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/15 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl"
            >
              <div className="space-y-5">
                <div>
                  <p className="font-bold text-amber-300 text-lg mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {content.hours_label}
                  </p>
                  <p className="text-white text-base ml-7">{content.hours}</p>
                </div>
                <div>
                  <p className="font-bold text-amber-300 text-lg mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {content.address_label}
                  </p>
                  <p className="text-white text-base ml-7">{content.address}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Carte de droite */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 hover:border-white/50 transition-all duration-300"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2775.5833857036487!2d6.710054600000001!3d46.1521957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c11d7b4eb2473%3A0x96bb0c34c1f9df2!2s21%20Rte%20du%20Front%20de%20Neige%2C%2074260%20Les%20Gets!5e0!3m2!1sfr!2sfr!4v1626345678901!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
