"use client";

import { useEffect } from "react";

/**
 * Affiche l'avertissement natif du navigateur (« Quitter le site ? ») à la
 * fermeture/rafraîchissement de l'onglet tant que `when` est vrai. Premier
 * filet du dirty guard ; la navigation interne est gardée séparément.
 */
export function useBeforeUnload(when: boolean): void {
  useEffect(() => {
    if (!when) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Requis par certains navigateurs pour déclencher la boîte de dialogue.
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [when]);
}
