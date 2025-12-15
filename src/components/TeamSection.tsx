import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function TeamSection() {
  const [content, setContent] = useState<any>({
    title: "Notre équipe",
    subtitle: "Des passionnés à votre service",
    description:
      "Rencontrez notre équipe de professionnels passionnés, toujours prêts à vous conseiller et vous accompagner dans vos choix.",
    members: [],
  });

  // Charger le contenu depuis l'API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(
          "/api/cms/content?section=homepage&subsection=team"
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
    <section className="py-32 px-4 bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold text-amber-950 mb-6">
            {content.title}
          </h2>
          <p className="text-xl text-amber-900/80 max-w-3xl mx-auto leading-relaxed">
            {content.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {content.members?.map((member: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              whileHover={{ y: -12 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-amber-100 hover:border-amber-300">
                <div className="relative h-96 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-950/90 via-amber-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                      {member.name}
                    </h3>
                    <p className="text-amber-200 font-semibold text-lg">
                      {member.role}
                    </p>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-b from-amber-50/50 to-white">
                  <p className="text-amber-900/90 leading-relaxed">{member.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 text-center bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 p-10 rounded-3xl shadow-lg border border-amber-200"
        >
          <p className="text-xl text-amber-950 font-medium max-w-3xl mx-auto leading-relaxed">
            Notre équipe est à votre disposition pour vous conseiller et vous
            accompagner dans vos choix. N'hésitez pas à venir nous rencontrer en
            boutique !
          </p>
        </motion.div>
      </div>
    </section>
  );
}
