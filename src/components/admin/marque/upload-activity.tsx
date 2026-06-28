"use client";

import { createContext, useContext, useEffect } from "react";

type ReportFn = (key: string, uploading: boolean) => void;

const UploadActivityContext = createContext<ReportFn | null>(null);

/** Fournit le canal de signalement d'uploads en cours aux composants médias. */
export function UploadActivityProvider({
  report,
  children,
}: {
  report: ReportFn;
  children: React.ReactNode;
}) {
  return (
    <UploadActivityContext.Provider value={report}>
      {children}
    </UploadActivityContext.Provider>
  );
}

/**
 * Signale au parent qu'un composant a (ou non) des uploads en cours.
 * Permet à l'éditeur de désactiver la sauvegarde tant que des fichiers montent,
 * pour ne jamais enregistrer une marque avant que toutes les URLs soient prêtes.
 */
export function useReportUploads(key: string, uploading: boolean): void {
  const report = useContext(UploadActivityContext);
  useEffect(() => {
    report?.(key, uploading);
    return () => report?.(key, false);
  }, [report, key, uploading]);
}
