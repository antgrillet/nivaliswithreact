"use client";

import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UploadCloud, Loader2 } from "lucide-react";
import { uploadToBlob } from "@/lib/admin/upload";
import { cn } from "@/lib/utils";

interface MediaUploaderProps {
  /** Préfixe de stockage des fichiers téléversés. */
  prefix?: string;
}

/** Zone de téléversement (drag & drop / parcourir) vers la médiathèque. */
export default function MediaUploader({
  prefix = "media",
}: MediaUploaderProps) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const accepted = Array.from(files).filter(
      (f) => f.type.startsWith("image/") || f.type === "application/pdf"
    );
    if (accepted.length === 0) {
      toast.error("Seules les images et les PDF sont acceptés.");
      return;
    }

    setUploading(true);
    let ok = 0;
    try {
      for (const file of accepted) {
        const pathname = `${prefix.replace(/\/$/, "")}/${file.name}`;
        await uploadToBlob(file, pathname, { source: "mediatheque" });
        ok += 1;
      }
      await queryClient.invalidateQueries({ queryKey: ["blobs"] });
      toast.success(
        ok > 1 ? `${ok} fichiers téléversés.` : "Fichier téléversé."
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Téléversement impossible."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
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
          "flex w-full flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-secondary/40 px-6 py-10 text-center transition-colors hover:border-foreground/40",
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
            : "Glissez des images ou PDF, ou cliquez pour parcourir"}
        </span>
        <span className="text-xs text-muted-foreground">
          JPG, PNG, WebP, SVG, GIF, AVIF, PDF — 25 Mo max par fichier
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </>
  );
}
