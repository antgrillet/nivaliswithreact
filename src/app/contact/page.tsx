"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Simulation d'un envoi de formulaire
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Formulaire soumis:", formData);

      // Réinitialisation du formulaire
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      setSubmitError("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-amber-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-amber-900 mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Contactez-nous
              </motion.h1>
              <motion.p
                className="text-amber-700 text-lg max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                N'hésitez pas à nous contacter pour toute question concernant
                nos produits et services.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Contact info & form section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Informations de contact */}
              <div>
                <h2 className="text-2xl font-bold text-amber-900 mb-6">
                  Nos coordonnées
                </h2>

                <div className="bg-amber-50 p-6 rounded-lg shadow-md">
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg text-amber-800 mb-3">
                      Adresse
                    </h3>
                    <p className="text-amber-700">
                      21 Rte du Front de Neige
                      <br />
                      74260 Les Gets, France
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-lg text-amber-800 mb-3">
                      Téléphone
                    </h3>
                    <p className="text-amber-700">
                      <a href="tel:0681736647" className="hover:text-amber-900">
                        06 81 73 66 47
                      </a>
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-lg text-amber-800 mb-3">
                      Email
                    </h3>
                    <p className="text-amber-700">
                      <a
                        href="mailto:contact@nivalislesgets.com"
                        className="hover:text-amber-900"
                      >
                        contact@nivalislesgets.com
                      </a>
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-amber-800 mb-3">
                      Horaires d'ouverture
                    </h3>
                    <table className="text-amber-700 w-full">
                      <tbody>
                        <tr className="border-b border-amber-200">
                          <td className="py-2 font-medium">Lundi</td>
                          <td className="py-2 text-right">
                            10:00–12:30, 14:30–19:00
                          </td>
                        </tr>
                        <tr className="border-b border-amber-200">
                          <td className="py-2 font-medium">Mardi</td>
                          <td className="py-2 text-right">
                            10:00–12:30, 14:30–19:00
                          </td>
                        </tr>
                        <tr className="border-b border-amber-200">
                          <td className="py-2 font-medium">Mercredi</td>
                          <td className="py-2 text-right">
                            10:00–12:30, 14:30–19:00
                          </td>
                        </tr>
                        <tr className="border-b border-amber-200">
                          <td className="py-2 font-medium">Jeudi</td>
                          <td className="py-2 text-right">
                            10:00–12:30, 14:30–19:00
                          </td>
                        </tr>
                        <tr className="border-b border-amber-200">
                          <td className="py-2 font-medium">Vendredi</td>
                          <td className="py-2 text-right">
                            10:00–12:30, 14:30–19:00
                          </td>
                        </tr>
                        <tr className="border-b border-amber-200">
                          <td className="py-2 font-medium">Samedi</td>
                          <td className="py-2 text-right">
                            10:00–12:30, 14:30–19:00
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Dimanche</td>
                          <td className="py-2 text-right">
                            10:00–12:30, 14:30–19:00
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Carte */}
                <div className="mt-8">
                  <h3 className="font-semibold text-lg text-amber-800 mb-3">
                    Notre emplacement
                  </h3>
                  <div className="h-64 bg-amber-100 rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2775.5833857036487!2d6.710054600000001!3d46.1521957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c11d7b4eb2473%3A0x96bb0c34c1f9df2!2s21%20Rte%20du%20Front%20de%20Neige%2C%2074260%20Les%20Gets!5e0!3m2!1sfr!2sfr!4v1626345678901!5m2!1sfr!2sfr"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Formulaire de contact */}
              <div>
                <h2 className="text-2xl font-bold text-amber-900 mb-6">
                  Envoyez-nous un message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-amber-700 mb-1"
                    >
                      Nom complet
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-amber-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-amber-700 mb-1"
                    >
                      Sujet
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-amber-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    ></textarea>
                  </div>

                  {submitError && (
                    <div className="text-red-600 bg-red-100 p-3 rounded-md">
                      {submitError}
                    </div>
                  )}

                  {submitSuccess && (
                    <div className="text-green-600 bg-green-100 p-3 rounded-md">
                      Votre message a été envoyé avec succès. Nous vous
                      répondrons dans les plus brefs délais.
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-amber-600 text-white py-3 px-6 rounded-md font-medium hover:bg-amber-700 transition-colors ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting
                        ? "Envoi en cours..."
                        : "Envoyer le message"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
