"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, Copy, Trash2, Loader2, FileText, ExternalLink } from "lucide-react";
import { useBlobList, type BlobItem } from "@/hooks/admin/useBlobList";
import { useBlobMutations } from "@/hooks/admin/useBlobMutations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeImage } from "@/components/SafeImage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import MediaUploader from "@/components/admin/MediaUploader";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/** Un blob est-il un PDF ? (détection par extension du chemin). */
function isPdf(pathname: string) {
  return pathname.toLowerCase().endsWith(".pdf");
}

export default function MediaLibrary() {
  const { data: blobs, isLoading } = useBlobList("");
  const { remove } = useBlobMutations();

  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<BlobItem | null>(null);

  const filtered = useMemo(() => {
    const list = blobs ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((b) => b.pathname.toLowerCase().includes(q));
  }, [blobs, search]);

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copiée.");
    } catch {
      toast.error("Copie impossible.");
    }
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    remove.mutate(toDelete.url, { onSuccess: () => setToDelete(null) });
  };

  return (
    <div className="space-y-6">
      <MediaUploader prefix="media" />

      <div className="flex items-center justify-between gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrer par chemin…"
            className="pl-9"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {filtered.length} fichier(s)
        </span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {search
            ? "Aucun fichier ne correspond au filtre."
            : "La médiathèque est vide. Téléversez votre premier fichier."}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((blob) => {
            const pdf = isPdf(blob.pathname);
            return (
              <div
                key={blob.url}
                className="group overflow-hidden rounded-md border border-border bg-card"
              >
                {pdf ? (
                  <a
                    href={blob.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ouvrir le PDF"
                    className="flex aspect-square flex-col items-center justify-center gap-2 bg-secondary/40 transition-colors hover:bg-secondary"
                  >
                    <FileText className="size-9 text-muted-foreground" />
                    <span className="text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
                      PDF
                    </span>
                  </a>
                ) : (
                  <div className="relative aspect-square bg-secondary/40">
                    <SafeImage
                      src={blob.url}
                      alt={blob.pathname}
                      fill
                      sizes="(max-width: 640px) 50vw, 200px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="space-y-2 p-3">
                  <p
                    className="truncate text-xs text-muted-foreground"
                    title={blob.pathname}
                  >
                    {blob.pathname.split("/").pop()}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[0.7rem] text-muted-foreground">
                      {formatSize(blob.size)}
                    </span>
                    <div className="flex gap-1">
                      {pdf && (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          title="Ouvrir le PDF"
                        >
                          <a
                            href={blob.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => copyUrl(blob.url)}
                        title="Copier l’URL"
                      >
                        <Copy className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => setToDelete(blob)}
                        title="Supprimer"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog
        open={Boolean(toDelete)}
        onOpenChange={(o) => !o && setToDelete(null)}
      >
        <DialogContent showCloseButton={!remove.isPending}>
          <DialogHeader>
            <DialogTitle className="font-serif tracking-tight">
              Supprimer le fichier
            </DialogTitle>
            <DialogDescription className="break-all">
              {toDelete?.pathname} sera définitivement supprimé du stockage.
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setToDelete(null)}
              disabled={remove.isPending}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={remove.isPending}
            >
              {remove.isPending && <Loader2 className="size-4 animate-spin" />}
              {remove.isPending ? "Suppression…" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
