"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UploadCloud, Check, Loader2, Film } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/SafeImage";
import { useBlobList } from "@/hooks/admin/useBlobList";
import { uploadToBlob, type UploadPayload } from "@/lib/admin/upload";
import { cn } from "@/lib/utils";

type Accept = "image" | "video" | "all";

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Sélection unique (mode par défaut). */
  onSelect?: (url: string) => void;
  /** Sélection multiple (quand `multiple`). */
  onSelectMany?: (urls: string[]) => void;
  /** Active la sélection / le téléversement multiple. */
  multiple?: boolean;
  /** Types acceptés (filtre l'input ET la médiathèque). */
  accept?: Accept;
  /** Préfixe de stockage pour les uploads (ex : `marques/Nike/gallery`). */
  uploadPrefix?: string;
  /** Préfixe de filtrage de la médiathèque (vide = tout). */
  listPrefix?: string;
  /** Payload transmis au handler d'upload. */
  payload?: UploadPayload;
  title?: string;
}

const VIDEO_RE = /\.(mp4|webm|mov|m4v|ogv)$/i;
const IMAGE_RE = /\.(jpe?g|png|webp|svg|gif|avif)$/i;

const acceptAttr = (a: Accept): string =>
  a === "video"
    ? "video/mp4,video/webm,video/quicktime"
    : a === "all"
      ? "image/*,video/*"
      : "image/*";

const fileMatches = (file: File, a: Accept): boolean =>
  a === "video"
    ? file.type.startsWith("video/")
    : a === "all"
      ? file.type.startsWith("image/") || file.type.startsWith("video/")
      : file.type.startsWith("image/");

const blobMatches = (pathname: string, a: Accept): boolean =>
  a === "video"
    ? VIDEO_RE.test(pathname)
    : a === "all"
      ? IMAGE_RE.test(pathname) || VIDEO_RE.test(pathname)
      : IMAGE_RE.test(pathname);

export default function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  onSelectMany,
  multiple = false,
  accept = "image",
  uploadPrefix = "uploads",
  listPrefix = "",
  payload,
  title = "Choisir une image",
}: MediaPickerDialogProps) {
  const queryClient = useQueryClient();
  const { data: blobs, isLoading } = useBlobList(listPrefix);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Sélection de la médiathèque remise à zéro à chaque ouverture.
  useEffect(() => {
    if (!open) setSelected(new Set());
  }, [open]);

  const emit = (urls: string[]) => {
    if (urls.length === 0) return;
    if (multiple) onSelectMany?.(urls);
    else onSelect?.(urls[0]);
  };

  const handleFiles = async (fileList: FileList | null) => {
    const all = fileList ? Array.from(fileList) : [];
    const picked = multiple ? all : all.slice(0, 1);
    const valid = picked.filter((f) => fileMatches(f, accept));
    if (valid.length === 0) {
      if (picked.length > 0) toast.error("Format de fichier non accepté.");
      return;
    }

    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of valid) {
        const pathname = `${uploadPrefix.replace(/\/$/, "")}/${file.name}`;
        urls.push(await uploadToBlob(file, pathname, payload));
      }
      await queryClient.invalidateQueries({ queryKey: ["blobs"] });
      toast.success(
        urls.length > 1 ? `${urls.length} fichiers téléversés.` : "Fichier téléversé."
      );
      emit(urls);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Téléversement impossible."
      );
    } finally {
      setUploading(false);
    }
  };

  const toggle = (url: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const handleTileClick = (url: string) => {
    if (multiple) {
      toggle(url);
    } else {
      onSelect?.(url);
      onOpenChange(false);
    }
  };

  const confirmSelection = () => {
    emit([...selected]);
    onOpenChange(false);
  };

  const visibleBlobs = (blobs ?? []).filter((b) => blobMatches(b.pathname, accept));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif tracking-tight">{title}</DialogTitle>
          <DialogDescription>
            Téléversez {multiple ? "un ou plusieurs fichiers" : "un fichier"} ou
            réutilisez {multiple ? "des médias existants" : "un média existant"}.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload">
          <TabsList className="w-full">
            <TabsTrigger value="upload" className="flex-1">
              Téléverser
            </TabsTrigger>
            <TabsTrigger value="library" className="flex-1">
              Médiathèque
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="pt-4">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              disabled={uploading}
              className={cn(
                "flex w-full flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-secondary/40 px-6 py-12 text-center transition-colors hover:border-foreground/40",
                dragOver && "border-foreground/60 bg-secondary"
              )}
            >
              {uploading ? (
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              ) : (
                <UploadCloud className="size-6 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                {uploading
                  ? "Téléversement…"
                  : multiple
                    ? "Glissez des fichiers ou cliquez pour parcourir"
                    : "Glissez un fichier ou cliquez pour parcourir"}
              </span>
              <span className="text-xs text-muted-foreground">
                {accept === "video"
                  ? "MP4, WebM, MOV — 200 Mo max"
                  : accept === "all"
                    ? "Images & vidéos"
                    : "JPG, PNG, WebP, SVG, GIF, AVIF — 25 Mo max"}
              </span>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={acceptAttr(accept)}
              multiple={multiple}
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </TabsContent>

          <TabsContent value="library" className="pt-4">
            {isLoading ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full" />
                ))}
              </div>
            ) : visibleBlobs.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Aucun média dans la médiathèque pour l’instant.
              </p>
            ) : (
              <div className="grid max-h-80 grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
                {visibleBlobs.map((blob) => {
                  const isVideo = VIDEO_RE.test(blob.pathname);
                  const isSelected = selected.has(blob.url);
                  return (
                    <button
                      key={blob.url}
                      type="button"
                      onClick={() => handleTileClick(blob.url)}
                      aria-pressed={multiple ? isSelected : undefined}
                      className={cn(
                        "group relative aspect-square overflow-hidden rounded-md border transition-colors",
                        isSelected
                          ? "border-foreground ring-2 ring-foreground"
                          : "border-border hover:border-foreground/50"
                      )}
                      title={blob.pathname}
                    >
                      {isVideo ? (
                        <span className="flex size-full items-center justify-center bg-secondary/40">
                          <Film className="size-6 text-muted-foreground" />
                        </span>
                      ) : (
                        <SafeImage
                          src={blob.url}
                          alt={blob.pathname}
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                      )}
                      <span
                        className={cn(
                          "absolute inset-0 flex items-center justify-center transition-all",
                          isSelected
                            ? "bg-foreground/40 opacity-100"
                            : "bg-foreground/0 opacity-0 group-hover:bg-foreground/40 group-hover:opacity-100"
                        )}
                      >
                        <Check className="size-5 text-background" />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {multiple && (
          <DialogFooter>
            <span className="mr-auto self-center text-sm text-muted-foreground">
              {selected.size} sélectionné(s)
            </span>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={confirmSelection}
              disabled={selected.size === 0}
            >
              Ajouter{selected.size > 0 ? ` (${selected.size})` : ""}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
