import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import QueryProvider from "@/components/providers/QueryProvider";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getSessionUser } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Back-office",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser(await headers());
  if (!user) {
    redirect("/login?next=/admin");
  }

  return (
    <QueryProvider>
      <div className="flex min-h-screen flex-col bg-background md:flex-row">
        <AdminSidebar />
        <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-12">
          {children}
        </main>
      </div>
    </QueryProvider>
  );
}
