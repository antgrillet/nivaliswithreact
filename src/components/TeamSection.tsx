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
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            {content.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {content.members?.map((member: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-80">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-amber-700 font-semibold mb-4">
                  {member.role}
                </p>
                <p className="text-gray-700">{member.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour vous conseiller et vous
            accompagner dans vos choix. N'hésitez pas à venir nous rencontrer en
            boutique !
          </p>
        </motion.div>
      </div>
    </section>
  );
}
