import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-50 pt-12 pb-8">
      <div className="container mx-auto px-4">
        {/* Newsletter Signup */}
        <div className="mb-12 max-w-xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-3 text-amber-100">
            Restez informé
          </h3>
          <p className="text-amber-200 text-sm mb-5">
            Inscrivez-vous à notre newsletter pour découvrir nos nouvelles
            collections et offres exclusives.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-4 py-2.5 rounded-l-md bg-amber-800/80 border border-amber-700 text-amber-50 placeholder:text-amber-400/70 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-r-md transition-colors">
              S'inscrire
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand and Social */}
          <div>
            <div className="mb-6">
              <Image
                src="/img/logo.png"
                alt="Logo Nivalis"
                width={150}
                height={50}
                className="mb-4 brightness-[1.2] drop-shadow-md"
              />
              <p className="text-amber-200 text-sm mb-5">
                Votre destination exclusive pour des marques de qualité et des
                produits d'exception depuis 2010.
              </p>
            </div>

            <h4 className="text-sm font-medium uppercase tracking-wider text-amber-300 mb-3">
              Suivez-nous
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-amber-200 hover:text-white transition-colors bg-amber-800/60 hover:bg-amber-800 w-9 h-9 rounded-full flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-amber-200 hover:text-white transition-colors bg-amber-800/60 hover:bg-amber-800 w-9 h-9 rounded-full flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-amber-100">
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-amber-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="text-xs mr-2">›</span> Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/marques"
                  className="text-amber-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="text-xs mr-2">›</span> Nos marques
                </Link>
              </li>
              <li>
                <Link
                  href="/marques/arpin"
                  className="text-amber-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="text-xs mr-2">›</span> Arpin
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-amber-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="text-xs mr-2">›</span> Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/a-propos"
                  className="text-amber-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="text-xs mr-2">›</span> À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-amber-100">
              Nos produits
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/categories/vetements"
                  className="text-amber-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="text-xs mr-2">›</span> Vêtements
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/chaussures"
                  className="text-amber-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="text-xs mr-2">›</span> Chaussures
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/decoration"
                  className="text-amber-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="text-xs mr-2">›</span> Décoration
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/accessoires"
                  className="text-amber-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="text-xs mr-2">›</span> Accessoires
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/nouveautes"
                  className="text-amber-200 hover:text-white transition-colors flex items-center"
                >
                  <span className="text-xs mr-2">›</span> Nouveautés
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-amber-100">
              Contact
            </h3>
            <address className="not-italic text-amber-200 space-y-3">
              <p className="flex items-start">
                <svg
                  className="w-5 h-5 mr-3 mt-0.5 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span>
                  21 Rte du Front de Neige
                  <br />
                  74260 Les Gets, France
                </span>
              </p>
              <p className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                <a
                  href="tel:0681736647"
                  className="hover:text-white transition-colors"
                >
                  06 81 73 66 47
                </a>
              </p>
              <p className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <a
                  href="mailto:contact@nivalislesgets.com"
                  className="hover:text-white transition-colors break-all"
                >
                  contact@nivalislesgets.com
                </a>
              </p>
              <div className="pt-3">
                <p className="flex items-center mb-2">
                  <svg
                    className="w-5 h-5 mr-3 text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span className="font-medium text-amber-100">Horaires:</span>
                </p>
                <p className="ml-8 text-sm">
                  Lun-Dim: 10:00–12:30, 14:30–19:00
                </p>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-amber-800 pt-8 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-amber-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Nivalis Les Gets - Tous droits
              réservés
            </p>
            <div className="flex gap-6 text-sm text-amber-400">
              <Link
                href="/mentions-legales"
                className="hover:text-white transition-colors"
              >
                Mentions légales
              </Link>
              <Link
                href="/politique-confidentialite"
                className="hover:text-white transition-colors"
              >
                Politique de confidentialité
              </Link>
              <Link href="/cgv" className="hover:text-white transition-colors">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
