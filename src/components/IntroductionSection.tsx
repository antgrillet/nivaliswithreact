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
    <section className="relative py-32 px-4">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/acceuil.jpeg"
          alt="Boutique Nivalis aux Gets"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Texte de gauche */}
          <div className="space-y-6 text-white">
            <h2 className="text-4xl font-bold">{content.title}</h2>
            <div className="space-y-4 text-lg">
              <p>{content.paragraph1}</p>
              <p>{content.paragraph2}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-amber-300">
                    {content.hours_label}
                  </p>
                  <p className="text-white">{content.hours}</p>
                </div>
                <div>
                  <p className="font-semibold text-amber-300">
                    {content.address_label}
                  </p>
                  <p className="text-white">{content.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Carte de droite */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative h-[300px] rounded-xl overflow-hidden shadow-xl bg-white/10 backdrop-blur-sm"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2775.5833857036487!2d6.710054600000001!3d46.1521957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c11d7b4eb2473%3A0x96bb0c34c1f9df2!2s21%20Rte%20du%20Front%20de%20Neige%2C%2074260%20Les%20Gets!5e0!3m2!1sfr!2sfr!4v1626345678901!5m2!1sfr!2sfr"
              width="800"
              height="600"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
