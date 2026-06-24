"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/marques", label: "Marques" },
  { href: "/marques/arpin", label: "Arpin" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/marques") {
    return pathname.startsWith("/marques") && pathname !== "/marques/arpin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar({
  overHero = false,
  brandName = "Nivalis",
}: {
  overHero?: boolean;
  brandName?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onDark = overHero && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        onDark
          ? "bg-transparent text-background"
          : "border-b border-border bg-background/85 text-foreground backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="font-serif text-2xl font-medium tracking-tight"
          onClick={() => setOpen(false)}
        >
          {brandName}
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "link-underline pb-0.5 text-sm tracking-wide transition-opacity duration-300",
                isActive(pathname, link.href)
                  ? "bg-[length:100%_1px]"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background text-foreground md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "border-b border-border/60 py-4 text-base last:border-0",
                  isActive(pathname, link.href)
                    ? "font-medium"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
