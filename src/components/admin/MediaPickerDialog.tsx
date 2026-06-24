"use client";

import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UploadCloud, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeImage } from "@/components/SafeImage";
import { useBlobList } from "@/hooks/admin/useBlobList";
import { uploadToBlob, type UploadPayload } from "@/lib/admin/upload";
import { cn } from "@/lib/utils";

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Appelé avec l'URL Blob choisie ou fraîchement uploadée. */
  onSelect: (url: string) => void;
  /** Préfixe de stockage pour les uploads (ex : `marques/Nike/gallery`). */
  uploadPrefix?: string;
  /** Préfixe de filtrage de la médiathèque (vide = tout). */
  listPrefix?: string;
  /** Payload transmis au handler d'upload. */
  payload?: UploadPayload;
  title?: string;
}

export default function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
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

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Seules les images sont acceptées.");
      return;
    }
    setUploading(true);
    try {
      const pathname = `${uploadPrefix.replace(/\/$/, "")}/${file.name}`;
      const url = await uploadToBlob(file, pathname, payload);
      await queryClient.invalidateQueries({ queryKey: ["blobs"] });
      toast.success("Image téléversée.");
      onSelect(url);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Téléversement impossible."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription>
            Téléversez une nouvelle image ou réutilisez une image existante.
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
                  : "Glissez une image ou cliquez pour parcourir"}
              </span>
              <span className="text-xs text-muted-foreground">
                JPG, PNG, WebP, SVG, GIF, AVIF — 10 Mo max
              </span>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
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
            ) : !blobs || blobs.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Aucune image dans la médiathèque pour l’instant.
              </p>
            ) : (
              <div className="grid max-h-80 grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
                {blobs.map((blob) => (
                  <button
                    key={blob.url}
                    type="button"
                    onClick={() => {
                      onSelect(blob.url);
                      onOpenChange(false);
                    }}
                    className="group relative aspect-square overflow-hidden rounded-md border border-border transition-colors hover:border-foreground/50"
                    title={blob.pathname}
                  >
                    <SafeImage
                      src={blob.url}
                      alt={blob.pathname}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/40 group-hover:opacity-100">
                      <Check className="size-5 text-background" />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
