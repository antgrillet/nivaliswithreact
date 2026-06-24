import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center bg-secondary px-6 pb-20 pt-28">
        <Suspense
          fallback={
            <p className="text-sm text-muted-foreground">Chargement…</p>
          }
        >
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
