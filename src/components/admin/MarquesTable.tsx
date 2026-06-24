"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, Search, ExternalLink, AlertTriangle } from "lucide-react";
import type { MarqueData } from "@/lib/types";
import type { MarqueInput } from "@/lib/schemas/marque";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SafeImage } from "@/components/SafeImage";
import { slugify } from "@/lib/slug";
import MarqueForm from "@/components/admin/MarqueForm";
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
  const { create, update, remove } = useMarqueMutations();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MarqueData | null>(null);
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

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (marque: MarqueData) => {
    setEditing(marque);
    setFormOpen(true);
  };

  const handleSubmit = (values: MarqueInput) => {
    const mutation = editing ? update : create;
    mutation.mutate(values, {
      onSuccess: () => setFormOpen(false),
    });
  };

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
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Nouvelle marque
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
              <TableHead className="w-px text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  {search
                    ? "Aucune marque ne correspond à la recherche."
                    : "Aucune marque pour l’instant. Créez la première."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((marque) => (
                <TableRow key={marque.nom}>
                  <TableCell>
                    <div className="relative size-9 overflow-hidden rounded border border-border bg-secondary/40">
                      <SafeImage
                        src={marque.logo || marque.mainImage}
                        alt={marqueLabel(marque)}
                        fill
                        sizes="36px"
                        className="object-contain"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {(() => {
                      const label = marqueLabel(marque);
                      const missing = missingFields(marque);
                      return (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span>{label}</span>
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
                            <p className="flex items-center gap-1.5 pt-0.5 text-xs font-normal text-destructive">
                              <AlertTriangle className="size-3 shrink-0" />
                              <span>Manque : {missing.join(", ")}</span>
                            </p>
                          )}
                        </div>
                      );
                    })()}
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
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {marque.images?.length ?? 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(marque)}
                        title="Modifier"
                      >
                        <Pencil className="size-4" />
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Création / édition */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl tracking-tight">
              {editing ? `Modifier — ${marqueLabel(editing)}` : "Nouvelle marque"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Mettez à jour les informations et les médias de la marque."
                : "Renseignez les informations de la nouvelle marque."}
            </DialogDescription>
          </DialogHeader>
          <MarqueForm
            marque={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
            isSubmitting={editing ? update.isPending : create.isPending}
          />
        </DialogContent>
      </Dialog>

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
