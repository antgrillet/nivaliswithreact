"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tag,
  FileText,
  Images,
  KeyRound,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/marques", label: "Marques", icon: Tag },
  { href: "/admin/contenu", label: "Contenu", icon: FileText },
  { href: "/admin/mediatheque", label: "Médiathèque", icon: Images },
  { href: "/admin/acces", label: "Accès", icon: KeyRound },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    router.replace("/login?next=/admin");
  };

  const links = (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(pathname, href, exact);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-background/10 text-background"
                : "text-background/60 hover:bg-background/5 hover:text-background"
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="mt-auto border-t border-background/10 pt-4">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-background/60 transition-colors hover:bg-background/5 hover:text-background disabled:opacity-50"
      >
        <LogOut className="size-4 shrink-0" />
        <span>{signingOut ? "Déconnexion…" : "Déconnexion"}</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Barre mobile */}
      <div className="flex items-center justify-between border-b border-border bg-foreground px-4 py-3 text-background md:hidden">
        <Link href="/admin" className="font-serif text-lg tracking-tight">
          Nivalis · Admin
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-b border-background/10 bg-foreground px-4 py-4 text-background md:hidden">
          {links}
          {footer}
        </div>
      )}

      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 bg-foreground px-5 py-7 text-background md:flex">
        <div>
          <Link
            href="/admin"
            className="font-serif text-xl tracking-tight text-background"
          >
            Nivalis
          </Link>
          <p className="eyebrow mt-1 text-background/50">Back-office</p>
        </div>
        {links}
        {footer}
      </aside>
    </>
  );
}
