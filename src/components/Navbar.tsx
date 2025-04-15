import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import React from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePath, setActivePath] = useState("/");

  useEffect(() => {
    // Set active path based on current URL
    setActivePath(window.location.pathname);

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-amber-50/95 backdrop-blur-sm shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center group">
            <div className="relative overflow-hidden">
              <Image
                src="/img/logo.png"
                alt="Logo"
                width={140}
                height={50}
                className={`object-contain transition-all duration-300 ${
                  scrolled
                    ? ""
                    : "brightness-[1.2] drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]"
                }`}
              />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="space-x-6">
              <NavLink href="/" active={activePath === "/"} scrolled={scrolled}>
                Accueil
              </NavLink>
              <NavLink
                href="/marques"
                active={activePath.includes("/marques")}
                scrolled={scrolled}
              >
                Nos marques
              </NavLink>
              <NavLink
                href="/marques/arpin"
                active={activePath === "/marques/arpin"}
                scrolled={scrolled}
              >
                Arpin
              </NavLink>
            </div>

            <Link href="/contact">
              <Button
                className={`${
                  scrolled
                    ? "bg-amber-700 hover:bg-amber-800 text-amber-50"
                    : "bg-amber-700/80 hover:bg-amber-700 text-amber-50"
                } px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md font-medium`}
              >
                Nous contacter
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation Button */}
          <button
            className={`md:hidden focus:outline-none transition-colors ${
              scrolled ? "text-amber-900" : "text-amber-700"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-amber-100/70 animate-fadeDown">
            <div className="flex flex-col space-y-4">
              <MobileNavLink
                href="/"
                active={activePath === "/"}
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </MobileNavLink>
              <MobileNavLink
                href="/marques"
                active={
                  activePath.includes("/marques") &&
                  activePath !== "/marques/arpin"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Nos marques
              </MobileNavLink>
              <MobileNavLink
                href="/marques/arpin"
                active={activePath === "/marques/arpin"}
                onClick={() => setIsMenuOpen(false)}
              >
                Arpin
              </MobileNavLink>

              <div className="pt-2">
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-amber-700 hover:bg-amber-800 text-amber-50 font-medium rounded-md px-4 py-3 text-center transition-colors shadow-sm"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Desktop Navigation Link component
interface NavLinkProps {
  href: string;
  active: boolean;
  scrolled: boolean;
  children: React.ReactNode;
}

function NavLink({ href, active, children, scrolled }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`relative font-serif text-base font-medium transition-all hover:text-amber-700 group
        ${
          scrolled
            ? active
              ? "text-amber-800"
              : "text-amber-900"
            : active
            ? "text-amber-700"
            : "text-amber-50"
        }
      `}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left
        ${active ? "scale-x-100 bg-amber-600" : "bg-amber-500"}
        ${scrolled ? "opacity-100" : "opacity-80"}
      `}
      ></span>
    </Link>
  );
}

// Mobile Navigation Link component
interface MobileNavLinkProps {
  href: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function MobileNavLink({
  href,
  active,
  onClick,
  children,
}: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      className={`px-4 py-3 rounded-md transition-all text-base ${
        active
          ? "bg-amber-100 text-amber-900 font-serif font-medium"
          : "text-amber-900 hover:bg-amber-50 hover:text-amber-700"
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
