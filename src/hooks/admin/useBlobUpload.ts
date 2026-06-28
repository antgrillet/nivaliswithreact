"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { uploadToBlob, type UploadPayload } from "@/lib/admin/upload";

export interface UploadItem {
  id: string;
  name: string;
  /** 0–100. */
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  url?: string;
  error?: string;
}

interface UseBlobUploadOptions {
  /** Préfixe de stockage, ex. `marques/<slug>/gallery`. */
  prefix: string;
  /** Payload transmis au handler d'upload (ex. `{ marque, type }`). */
  payload: UploadPayload;
  /** Types acceptés. */
  accept?: "image" | "video";
  /** Appelé à chaque upload réussi avec l'URL publique. */
  onDone?: (url: string) => void;
}

interface UploadController {
  addFiles: (files: File[]) => void;
  retry: (id: string) => void;
  /** Écarte un item (typiquement en erreur) et libère son fichier. */
  dismiss: (id: string) => void;
  clearDone: () => void;
}

const MAX_PARALLEL = 3;
const MAX_IMAGE_BYTES = 25 * 1024 * 1024; // 25 Mo
const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200 Mo

const formatLimit = (bytes: number): string =>
  `${Math.round(bytes / (1024 * 1024))} Mo`;

/**
 * Téléversements multiples vers Vercel Blob, bornés à 3 en parallèle, avec
 * progression réelle par fichier et reprise après échec partiel. La source de
 * vérité des médias reste le formulaire ; ce hook ne gère que la file d'upload.
 */
export function useBlobUpload(options: UseBlobUploadOptions): {
  items: UploadItem[];
} & UploadController {
  const [items, setItems] = useState<UploadItem[]>([]);

  // Refs de contrôle de flux (les setState sont asynchrones, on pilote via refs).
  const optsRef = useRef(options);
  // Synchronisation des options hors phase de rendu.
  useEffect(() => {
    optsRef.current = options;
  });

  const itemsRef = useRef<UploadItem[]>([]);
  const filesRef = useRef<Map<string, File>>(new Map());
  const activeRef = useRef(0);

  // Contrôleur construit une seule fois → handlers stables pour les consommateurs.
  // Les closures référencent les refs ; aucun accès à `.current` pendant le rendu.
  const controller = useMemo<UploadController>(() => {
    const sync = () => setItems([...itemsRef.current]);

    const patch = (id: string, next: Partial<UploadItem>) => {
      itemsRef.current = itemsRef.current.map((it) =>
        it.id === id ? { ...it, ...next } : it
      );
      sync();
    };

    // Déclarations de fonction (hoisted) → référence mutuelle runUpload/pump OK.
    async function runUpload(id: string): Promise<void> {
      const { prefix, payload, onDone } = optsRef.current;
      const file = filesRef.current.get(id);
      if (!file) {
        activeRef.current -= 1;
        return;
      }
      patch(id, { status: "uploading", progress: 0, error: undefined });
      try {
        const pathname = `${prefix.replace(/\/$/, "")}/${file.name}`;
        const url = await uploadToBlob(file, pathname, payload, (e) =>
          patch(id, { progress: Math.round(e.percentage) })
        );
        patch(id, { status: "done", progress: 100, url });
        filesRef.current.delete(id);
        onDone?.(url);
      } catch (error) {
        patch(id, {
          status: "error",
          error:
            error instanceof Error ? error.message : "Téléversement impossible.",
        });
      } finally {
        activeRef.current -= 1;
        pump();
      }
    }

    function pump(): void {
      while (activeRef.current < MAX_PARALLEL) {
        const next = itemsRef.current.find((it) => it.status === "pending");
        if (!next) break;
        activeRef.current += 1;
        void runUpload(next.id);
      }
    }

    const addFiles = (files: File[]) => {
      const { accept = "image" } = optsRef.current;
      const max = accept === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
      const created: UploadItem[] = [];

      for (const file of files) {
        const okType =
          accept === "video"
            ? file.type.startsWith("video/")
            : file.type.startsWith("image/");
        if (!okType) {
          toast.error(
            `${file.name} : ${accept === "video" ? "vidéo" : "image"} attendue.`
          );
          continue;
        }
        if (file.size > max) {
          toast.error(`${file.name} : trop volumineux (max ${formatLimit(max)}).`);
          continue;
        }
        const id = crypto.randomUUID();
        filesRef.current.set(id, file);
        created.push({ id, name: file.name, progress: 0, status: "pending" });
      }

      if (created.length === 0) return;
      itemsRef.current = [...itemsRef.current, ...created];
      sync();
      pump();
    };

    const retry = (id: string) => {
      if (!filesRef.current.has(id)) return;
      patch(id, { status: "pending", progress: 0, error: undefined });
      pump();
    };

    const dismiss = (id: string) => {
      filesRef.current.delete(id);
      itemsRef.current = itemsRef.current.filter((it) => it.id !== id);
      sync();
    };

    const clearDone = () => {
      itemsRef.current = itemsRef.current.filter((it) => {
        if (it.status === "done") {
          filesRef.current.delete(it.id);
          return false;
        }
        return true;
      });
      sync();
    };

    return { addFiles, retry, dismiss, clearDone };
  }, []);

  // Libère les fichiers retenus (items en erreur) au démontage.
  useEffect(() => {
    const files = filesRef.current;
    return () => files.clear();
  }, []);

  return { items, ...controller };
}
