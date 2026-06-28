import { upload } from "@vercel/blob/client";

export interface UploadPayload {
  /** Contexte libre, transmis au handler `/api/blob/upload` (marque, type, action…). */
  [key: string]: unknown;
}

export interface UploadProgressEvent {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload d'un fichier vers Vercel Blob via le client upload sécurisé.
 * Le token est généré par `/api/blob/upload` (protégé par session admin).
 * `onUploadProgress` (optionnel) reçoit la progression réelle du transfert.
 * Retourne l'URL publique du blob.
 */
export async function uploadToBlob(
  file: File,
  pathname: string,
  clientPayload?: UploadPayload,
  onUploadProgress?: (event: UploadProgressEvent) => void
): Promise<string> {
  const result = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/blob/upload",
    clientPayload: clientPayload ? JSON.stringify(clientPayload) : undefined,
    onUploadProgress,
  });
  return result.url;
}
