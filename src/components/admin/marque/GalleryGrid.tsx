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
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { ImagePlus, Library, Loader2, RotateCcw, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import SortableThumb from "@/components/admin/marque/SortableThumb";
import { useReportUploads } from "@/components/admin/marque/upload-activity";
import MediaPickerDialog from "@/components/admin/MediaPickerDialog";

interface GalleryGridProps {
  images: string[];
  mainImage: string;
  slug: string;
  nom: string;
  onReorder: (activeId: string, overId: string) => void;
  onAdd: (urls: string[]) => void;
  onRemoveFromGallery: (urls: string[]) => void;
  onDeleteFromStorage: (urls: string[]) => Promise<void>;
  onSetMain: (url: string) => void;
}

export default function GalleryGrid({
  images,
  mainImage,
  slug,
  nom,
  onReorder,
  onAdd,
  onRemoveFromGallery,
  onDeleteFromStorage,
  onSetMain,
}: GalleryGridProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { items, addFiles, retry, dismiss, clearDone } = useBlobUpload({
    prefix: `marques/${slug}/gallery`,
    payload: { marque: nom, type: "gallery" },
    accept: "image",
    onDone: (url) => onAdd([url]),
  });

  // Les tuiles terminées rejoignent la galerie : on les retire de la file.
  useEffect(() => {
    if (items.some((it) => it.status === "done")) clearDone();
  }, [items, clearDone]);

  const pending = items.filter((it) => it.status !== "done");

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
    // On délègue le recalcul au parent (depuis la valeur live), pas un tableau figé.
    onReorder(String(active.id), String(over.id));
  };

  const toggleSelect = (url: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());
  const allSelected = images.length > 0 && selected.size === images.length;
  const toggleSelectAll = () =>
    setSelected(allSelected ? new Set() : new Set(images));

  const removeSelected = () => {
    onRemoveFromGallery([...selected]);
    clearSelection();
  };

  const confirmDeleteSelected = async () => {
    setDeleting(true);
    try {
      await onDeleteFromStorage([...selected]);
      clearSelection();
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const onFilesPicked = (fileList: FileList | null) => {
    addFiles(Array.from(fileList ?? []));
  };

  const isEmpty = images.length === 0 && pending.length === 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Galerie</span>
          <span className="text-xs text-muted-foreground">
            {images.length} image{images.length > 1 ? "s" : ""}
            {images.length > 1 ? " · glisser pour réordonner" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {images.length > 0 && (
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="size-3.5 accent-foreground"
              />
              Tout sélectionner
            </label>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPickerOpen(true)}
          >
            <Library className="size-3.5" />
            Médiathèque
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="size-3.5" />
            Importer
          </Button>
        </div>
      </div>

      {/* Barre de sélection (lot) */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-secondary/60 px-3 py-2 text-sm">
          <span className="font-medium tabular-nums">
            {selected.size} sélectionnée{selected.size > 1 ? "s" : ""}
          </span>
          <button
            type="button"
            onClick={clearSelection}
            className="link-underline pb-0.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            Désélectionner
          </button>
          <div className="ml-auto flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={removeSelected}>
              Retirer de la galerie
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setConfirmOpen(true)}
            >
              Supprimer du stockage
            </Button>
          </div>
        </div>
      )}

      {/* Dropzone + grille */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onFilesPicked(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-md border border-dashed border-border p-3 transition-colors",
          dragOver && "border-foreground/60 bg-secondary/50"
        )}
      >
        {isEmpty ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <ImagePlus className="size-6" />
            <span className="text-sm font-medium">
              Glissez vos images ici ou cliquez pour importer
            </span>
            <span className="text-xs">JPG, PNG, WebP, SVG, GIF, AVIF — 25 Mo max</span>
          </button>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToParentElement]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={images} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                {images.map((url) => (
                  <SortableThumb
                    key={url}
                    url={url}
                    isMain={url === mainImage && mainImage !== ""}
                    selected={selected.has(url)}
                    onToggleSelect={() => toggleSelect(url)}
                    onSetMain={() => onSetMain(url)}
                    onRemove={() => onRemoveFromGallery([url])}
                  />
                ))}

                {/* Tuiles en cours de téléversement (hors zone triable) */}
                {pending.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex aspect-square flex-col items-center justify-center gap-2 rounded-md border p-2 text-center",
                      item.status === "error"
                        ? "border-destructive/50 bg-destructive/5"
                        : "border-border bg-secondary/40"
                    )}
                  >
                    {item.status === "error" ? (
                      <>
                        <AlertTriangle className="size-5 text-destructive" />
                        <span className="w-full truncate text-[0.7rem] text-muted-foreground">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => retry(item.id)}
                          >
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
                      </>
                    ) : (
                      <>
                        <Loader2 className="size-5 animate-spin text-muted-foreground" />
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {item.progress}%
                        </span>
                        <span className="w-full truncate text-[0.7rem] text-muted-foreground">
                          {item.name}
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          onFilesPicked(e.target.files);
          e.target.value = "";
        }}
      />

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        multiple
        accept="image"
        listPrefix={`marques/${slug}`}
        uploadPrefix={`marques/${slug}/gallery`}
        payload={{ marque: nom, type: "gallery" }}
        onSelectMany={(urls) => onAdd(urls)}
        title="Ajouter des images à la galerie"
      />

      {/* Confirmation suppression du stockage (irréversible) */}
      <Dialog open={confirmOpen} onOpenChange={(o) => !deleting && setConfirmOpen(o)}>
        <DialogContent showCloseButton={!deleting}>
          <DialogHeader>
            <DialogTitle className="font-serif tracking-tight">
              Supprimer du stockage
            </DialogTitle>
            <DialogDescription>
              {selected.size} fichier{selected.size > 1 ? "s seront" : " sera"}{" "}
              définitivement supprimé{selected.size > 1 ? "s" : ""} du stockage et
              retiré{selected.size > 1 ? "s" : ""} de la galerie. Si un fichier est
              réutilisé par une autre marque, son image y deviendra indisponible.
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setConfirmOpen(false)}
              disabled={deleting}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteSelected}
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
