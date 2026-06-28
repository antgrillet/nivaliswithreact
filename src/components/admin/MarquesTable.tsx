"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import type { MarqueData } from "@/lib/types";
import { useMarques } from "@/hooks/admin/useMarques";
import { useMarqueMutations } from "@/hooks/admin/useMarqueMutations";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeImage } from "@/components/SafeImage";
import { slugify } from "@/lib/slug";
import MarqueDeleteDialog from "@/components/admin/MarqueDeleteDialog";

/** Libellé d'une marque : nom d'affichage soigné si présent, sinon l'identifiant. */
function marqueLabel(marque: MarqueData): string {
  return marque.displayName?.trim() || marque.nom;
}

/** Liste des éléments clés manquants pour une marque (logo, image principale, description). */
function missingFields(marque: MarqueData): string[] {
  const missing: string[] = [];
  if (!marque.logo?.trim()) missing.push("Logo");
  if (!marque.mainImage?.trim()) missing.push("Image principale");
  const hasDescription =
    Boolean(marque.description?.trim()) ||
    Boolean(marque.description_fr?.trim()) ||
    Boolean(marque.description_en?.trim());
  if (!hasDescription) missing.push("Description");
  return missing;
}

export default function MarquesTable() {
  const { data: marques, isLoading } = useMarques();
  const { remove } = useMarqueMutations();

  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<MarqueData | null>(null);

  const filtered = useMemo(() => {
    const list = marques ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (m) =>
        m.nom.toLowerCase().includes(q) ||
        (m.displayName ?? "").toLowerCase().includes(q) ||
        (m.type ?? "").toLowerCase().includes(q) ||
        (m.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
  }, [marques, search]);

  const handleDelete = () => {
    if (!deleting) return;
    remove.mutate(deleting.nom, {
      onSuccess: () => setDeleting(null),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une marque…"
            className="pl-9"
          />
        </div>
        <Button asChild>
          <Link href="/admin/marques/new">
            <Plus className="size-4" />
            Nouvelle marque
          </Link>
        </Button>
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14"></TableHead>
              <TableHead>Marque</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Tags</TableHead>
              <TableHead className="hidden sm:table-cell">Galerie</TableHead>
              <TableHead className="hidden sm:table-cell">Vidéos</TableHead>
              <TableHead className="w-px text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  {search
                    ? "Aucune marque ne correspond à la recherche."
                    : "Aucune marque pour l’instant. Créez la première."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((marque) => {
                const label = marqueLabel(marque);
                const missing = missingFields(marque);
                const editHref = `/admin/marques/${encodeURIComponent(marque.nom)}`;
                return (
                  <TableRow key={marque.nom}>
                    <TableCell>
                      <Link
                        href={editHref}
                        className="relative block size-9 overflow-hidden rounded border border-border bg-secondary/40"
                      >
                        <SafeImage
                          src={marque.logo || marque.mainImage}
                          alt={label}
                          fill
                          sizes="36px"
                          className="object-contain"
                        />
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link href={editHref} className="link-underline pb-0.5">
                            {label}
                          </Link>
                          <Link
                            href={`/marques/${slugify(marque.nom)}`}
                            target="_blank"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                            title="Voir la page publique"
                          >
                            <ExternalLink className="size-3.5" />
                          </Link>
                        </div>
                        {label !== marque.nom && (
                          <p className="font-mono text-xs font-normal text-muted-foreground">
                            {marque.nom}
                          </p>
                        )}
                        {missing.length > 0 && (
                          <p className="flex items-center gap-1.5 pt-0.5 text-xs font-normal text-muted-foreground">
                            <AlertCircle className="size-3 shrink-0" />
                            <span>Manque : {missing.join(", ")}</span>
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {marque.type || "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(marque.tags ?? []).slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                        {(marque.tags?.length ?? 0) > 3 && (
                          <Badge variant="outline">
                            +{(marque.tags?.length ?? 0) - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground tabular-nums sm:table-cell">
                      {marque.images?.length ?? 0}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground tabular-nums sm:table-cell">
                      {marque.videos?.length ?? 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          title="Modifier"
                        >
                          <Link href={editHref}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleting(marque)}
                          title="Supprimer"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <MarqueDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(o) => !o && setDeleting(null)}
        marqueNom={deleting?.nom ?? null}
        onConfirm={handleDelete}
        isDeleting={remove.isPending}
      />
    </div>
  );
}
