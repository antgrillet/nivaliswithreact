"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import {
  Film,
  GripVertical,
  Loader2,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useBlobUpload } from "@/hooks/admin/useBlobUpload";
import { useReportUploads } from "@/components/admin/marque/upload-activity";

interface VideoListProps {
  videos: string[];
  slug: string;
  nom: string;
  updateVideos: (updater: (prev: string[]) => string[]) => void;
}

const VIDEO_FILE_RE = /\.(mp4|webm|mov|m4v|ogv)$/i;
const isBlob = (url: string) => url.includes("blob.vercel-storage.com");

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function SortableVideoRow({
  url,
  onRemove,
  onDeleteStorage,
}: {
  url: string;
  onRemove: () => void;
  onDeleteStorage: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: url });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const isFile = VIDEO_FILE_RE.test(url);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-md border bg-card p-3",
        isDragging ? "z-10 border-foreground shadow-lg" : "border-border"
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:cursor-grabbing"
        aria-label="Déplacer la vidéo"
      >
        <GripVertical className="size-4" />
      </button>

      {isFile ? (
        <video
          src={url}
          muted
          preload="metadata"
          aria-label="Aperçu de la vidéo"
          className="h-14 w-24 shrink-0 rounded border border-border bg-secondary/40 object-cover"
        />
      ) : (
        <span className="flex h-14 w-24 shrink-0 items-center justify-center rounded border border-border bg-secondary/40">
          <Film className="size-5 text-muted-foreground" />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline block truncate pb-0.5 text-sm text-foreground"
          title={url}
        >
          {isFile && isBlob(url) ? url.split("/").pop() : hostOf(url)}
        </a>
        <p className="text-xs text-muted-foreground">
          {isBlob(url) ? "Fichier hébergé" : "Lien externe"}
        </p>
      </div>

      <div className="flex shrink-0 gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          title="Retirer de la liste"
        >
          <X className="size-3.5" />
          Retirer
        </Button>
        {isBlob(url) && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 text-destructive hover:text-destructive"
            onClick={onDeleteStorage}
            title="Supprimer du stockage"
          >
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

/** Gestion du champ `videos` : upload de fichiers + ajout d'URL externes + ordre. */
export default function VideoList({ videos, slug, nom, updateVideos }: VideoListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [confirmUrl, setConfirmUrl] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { items, addFiles, retry, dismiss, clearDone } = useBlobUpload({
    prefix: `marques/${slug}/videos`,
    payload: { marque: nom, type: "video" },
    accept: "video",
    onDone: (url) => updateVideos((prev) => [...prev, url]),
  });

  const pending = items.filter((it) => it.status !== "done");
  useEffect(() => {
    if (items.some((it) => it.status === "done")) clearDone();
  }, [items, clearDone]);

  // Signale les uploads en cours à l'éditeur (bloque la sauvegarde).
  const uploadKey = useId();
  useReportUploads(uploadKey, pending.some((it) => it.status !== "error"));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    // Updater fonctionnel : recalcule depuis la valeur live (sûr si un upload
    // concurrent a ajouté une vidéo entre-temps).
    updateVideos((prev) => {
      const from = prev.indexOf(String(active.id));
      const to = prev.indexOf(String(over.id));
      return from < 0 || to < 0 ? prev : arrayMove(prev, from, to);
    });
  };

  const addUrl = () => {
    const value = urlDraft.trim();
    if (!value) return;
    try {
      // Validation légère : URL bien formée.
      new URL(value);
    } catch {
      toast.error("URL invalide.");
      return;
    }
    if (videos.includes(value)) {
      toast.error("Cette vidéo est déjà dans la liste.");
      return;
    }
    updateVideos((prev) => [...prev, value]);
    setUrlDraft("");
  };

  const deleteFromStorage = async (url: string) => {
    setDeleting(true);
    try {
      const res = await fetch("/api/blob/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: [url] }),
      });
      if (!res.ok) throw new Error();
      updateVideos((prev) => prev.filter((u) => u !== url));
      setConfirmUrl(null);
    } catch {
      toast.error("Suppression du stockage impossible.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Actions d'ajout */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <label className="text-sm font-medium" htmlFor="video-url">
            Ajouter par URL
          </label>
          <div className="flex gap-2">
            <Input
              id="video-url"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
              placeholder="https://youtube.com/… ou lien MP4"
            />
            <Button type="button" variant="outline" onClick={addUrl}>
              <Plus className="size-4" />
              Ajouter
            </Button>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="size-4" />
          Importer un fichier
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </div>

      {/* Tuiles en cours d'upload */}
      {pending.map((item) => (
        <div
          key={item.id}
          className={cn(
            "flex items-center gap-3 rounded-md border p-3 text-sm",
            item.status === "error"
              ? "border-destructive/50 bg-destructive/5"
              : "border-border bg-secondary/40"
          )}
        >
          {item.status === "error" ? (
            <AlertTriangle className="size-4 shrink-0 text-destructive" />
          ) : (
            <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
          )}
          <span className="min-w-0 flex-1 truncate text-muted-foreground">
            {item.name}
          </span>
          {item.status === "error" ? (
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => retry(item.id)}>
                <RotateCcw className="size-3.5" />
                Réessayer
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => dismiss(item.id)}
                title="Écarter"
                aria-label="Écarter"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ) : (
            <span className="text-xs tabular-nums text-muted-foreground">
              {item.progress}%
            </span>
          )}
        </div>
      ))}

      {/* Liste réordonnable */}
      {videos.length === 0 ? (
        pending.length === 0 && (
          <p className="rounded-md border border-dashed border-border bg-secondary/30 px-4 py-8 text-center text-sm text-muted-foreground">
            Aucune vidéo. Importez un fichier ou ajoutez un lien.
          </p>
        )
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={videos} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {videos.map((url) => (
                <SortableVideoRow
                  key={url}
                  url={url}
                  onRemove={() => updateVideos((prev) => prev.filter((u) => u !== url))}
                  onDeleteStorage={() => setConfirmUrl(url)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Dialog
        open={confirmUrl !== null}
        onOpenChange={(o) => !deleting && !o && setConfirmUrl(null)}
      >
        <DialogContent showCloseButton={!deleting}>
          <DialogHeader>
            <DialogTitle className="font-serif tracking-tight">
              Supprimer du stockage
            </DialogTitle>
            <DialogDescription className="break-all">
              Cette vidéo sera définitivement supprimée du stockage et retirée de la
              liste. Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setConfirmUrl(null)}
              disabled={deleting}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => confirmUrl && deleteFromStorage(confirmUrl)}
              disabled={deleting}
            >
              {deleting && <Loader2 className="size-4 animate-spin" />}
              {deleting ? "Suppression…" : "Supprimer définitivement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
