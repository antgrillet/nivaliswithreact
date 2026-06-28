"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Search,
  Copy,
  Trash2,
  Loader2,
  FileText,
  ExternalLink,
  Folder,
  ChevronRight,
  Film,
} from "lucide-react";
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

const isPdf = (pathname: string) => pathname.toLowerCase().endsWith(".pdf");
const isVideo = (pathname: string) => /\.(mp4|webm|mov|m4v|ogv)$/i.test(pathname);

const FOLDER_LABELS: Record<string, string> = {
  media: "Téléversements",
  content: "Contenu éditorial",
  uploads: "Divers",
  "(racine)": "Racine",
};

/** Dossier logique dérivé du chemin du blob (ex : `marques/<slug>`, `media`). */
function folderKey(pathname: string): string {
  const parts = pathname.split("/");
  if (parts.length <= 1) return "(racine)";
  if (parts[0] === "marques" && parts[1]) return `marques/${parts[1]}`;
  return parts[0];
}

function folderLabel(key: string): string {
  if (key.startsWith("marques/")) return key.slice("marques/".length);
  return FOLDER_LABELS[key] ?? key;
}

const isMarqueFolder = (key: string) => key.startsWith("marques/");

interface FolderEntry {
  key: string;
  label: string;
  items: BlobItem[];
  cover?: string;
}

export default function MediaLibrary() {
  const { data: blobs, isLoading } = useBlobList("");
  const { remove } = useBlobMutations();

  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<BlobItem | null>(null);

  const folders = useMemo<FolderEntry[]>(() => {
    const map = new Map<string, BlobItem[]>();
    for (const blob of blobs ?? []) {
      const key = folderKey(blob.pathname);
      const list = map.get(key);
      if (list) list.push(blob);
      else map.set(key, [blob]);
    }
    return [...map.entries()]
      .map(([key, items]) => ({
        key,
        label: folderLabel(key),
        items,
        cover: items.find((b) => !isPdf(b.pathname) && !isVideo(b.pathname))?.url,
      }))
      .sort((a, b) => {
        // Marques d'abord (par ordre alphabétique), puis dossiers système.
        const am = isMarqueFolder(a.key);
        const bm = isMarqueFolder(b.key);
        if (am !== bm) return am ? -1 : 1;
        return a.label.localeCompare(b.label);
      });
  }, [blobs]);

  const current = folder ? folders.find((f) => f.key === folder) : null;

  const visibleFiles = useMemo(() => {
    if (!current) return [];
    const q = search.trim().toLowerCase();
    if (!q) return current.items;
    return current.items.filter((b) => b.pathname.toLowerCase().includes(q));
  }, [current, search]);

  const visibleFolders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return folders;
    return folders.filter(
      (f) =>
        f.label.toLowerCase().includes(q) ||
        f.items.some((b) => b.pathname.toLowerCase().includes(q))
    );
  }, [folders, search]);

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
            placeholder={current ? "Filtrer ce dossier…" : "Filtrer les dossiers…"}
            className="pl-9"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {current
            ? `${visibleFiles.length} fichier(s)`
            : `${visibleFolders.length} dossier(s)`}
        </span>
      </div>

      {/* Fil d'Ariane */}
      <div className="flex items-center gap-1.5 text-sm">
        <button
          type="button"
          onClick={() => setFolder(null)}
          className={
            current
              ? "link-underline pb-0.5 text-muted-foreground transition-colors hover:text-foreground"
              : "font-medium text-foreground"
          }
        >
          Médiathèque
        </button>
        {current && (
          <>
            <ChevronRight className="size-4 text-muted-foreground" />
            <span className="font-medium text-foreground">{current.label}</span>
            {isMarqueFolder(current.key) && (
              <span className="eyebrow ml-1">Marque</span>
            )}
          </>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      ) : !current ? (
        /* Vue dossiers */
        visibleFolders.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {search
              ? "Aucun dossier ne correspond au filtre."
              : "La médiathèque est vide. Téléversez votre premier fichier."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visibleFolders.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  setFolder(f.key);
                  setSearch("");
                }}
                className="group overflow-hidden rounded-md border border-border bg-card text-left transition-colors hover:border-foreground/40"
              >
                <div className="relative aspect-[4/3] bg-secondary/40">
                  {f.cover ? (
                    <SafeImage
                      src={f.cover}
                      alt={f.label}
                      fill
                      sizes="(max-width: 640px) 50vw, 240px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center">
                      <Folder className="size-8 text-muted-foreground" />
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium" title={f.label}>
                      {f.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {f.items.length} fichier{f.items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        )
      ) : /* Vue fichiers du dossier */ visibleFiles.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {search
            ? "Aucun fichier ne correspond au filtre."
            : "Ce dossier est vide."}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visibleFiles.map((blob) => {
            const pdf = isPdf(blob.pathname);
            const video = isVideo(blob.pathname);
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
                ) : video ? (
                  <div className="relative aspect-square bg-secondary/40">
                    <video
                      src={blob.url}
                      muted
                      preload="metadata"
                      aria-label={blob.pathname.split("/").pop()}
                      className="size-full object-cover"
                    />
                    <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-background/85 px-1.5 py-0.5 text-[0.65rem] text-muted-foreground backdrop-blur-sm">
                      <Film className="size-3" />
                      Vidéo
                    </span>
                  </div>
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
                      {(pdf || video) && (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          title="Ouvrir"
                        >
                          <a href={blob.url} target="_blank" rel="noopener noreferrer">
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
              {toDelete?.pathname} sera définitivement supprimé du stockage. Cette
              action est irréversible.
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
