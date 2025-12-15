import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl } from "@/utils/imageUtils";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
}

interface TeamContent {
  title: string;
  subtitle: string;
  description: string;
  members: TeamMember[];
}

export default function TeamSection() {
  const [content, setContent] = useState<TeamContent>({
    title: "Notre équipe",
    subtitle: "Des passionnés à votre service",
    description:
      "Rencontrez notre équipe de professionnels passionnés, toujours prêts à vous conseiller et vous accompagner dans vos choix.",
    members: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = useCallback((index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  }, []);

  // Charger le contenu depuis l'API
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);
  // État de chargement
  if (isLoading) {
    return (
      <section className="py-16 md:py-32 px-4 bg-gradient-to-b from-white via-amber-50/30 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20 space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-100">
                <Skeleton className="h-72 md:h-96 w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-32 px-4 bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-amber-950 mb-4 md:mb-6">
            {content.title}
          </h2>
          <p className="text-lg md:text-xl text-amber-900/80 max-w-3xl mx-auto leading-relaxed">
            {content.description}
          </p>
        </motion.div>

        {content.members?.length === 0 ? (
          <p className="text-center text-amber-700">Aucun membre à afficher pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {content.members?.map((member, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                whileHover={{ y: -12 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-amber-100 hover:border-amber-300">
                  <div className="relative h-72 md:h-96 overflow-hidden">
                    {imageErrors[index] ? (
                      <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center">
                        <span className="text-amber-800 text-4xl font-bold">{member.name.charAt(0)}</span>
                      </div>
                    ) : (
                      <Image
                        src={getImageUrl(member.image)}
                        alt={`Photo de ${member.name}, ${member.role}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={() => handleImageError(index)}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-950/90 via-amber-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 transform translate-y-0 transition-transform duration-500">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-lg">
                        {member.name}
                      </h3>
                      <p className="text-amber-200 font-semibold text-base md:text-lg">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 md:p-6 bg-gradient-to-b from-amber-50/50 to-white">
                    <p className="text-amber-900/90 leading-relaxed text-sm md:text-base">{member.description}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 md:mt-20 text-center bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-lg border border-amber-200"
        >
          <p className="text-lg md:text-xl text-amber-950 font-medium max-w-3xl mx-auto leading-relaxed">
            Notre équipe est à votre disposition pour vous conseiller et vous
            accompagner dans vos choix. N'hésitez pas à venir nous rencontrer en
            boutique !
          </p>
        </motion.div>
      </div>
    </section>
  );
}
