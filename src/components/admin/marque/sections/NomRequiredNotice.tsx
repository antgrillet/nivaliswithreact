import { Info } from "lucide-react";

/** Invite à renseigner le nom de la marque avant d'organiser ses médias. */
export default function NomRequiredNotice({ what }: { what: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-dashed border-border bg-secondary/30 px-4 py-8 text-sm text-muted-foreground">
      <Info className="size-4 shrink-0" />
      <span>
        Renseignez d’abord le{" "}
        <strong className="font-medium text-foreground">nom de la marque</strong>{" "}
        (section Identité) pour organiser les {what}.
      </span>
    </div>
  );
}
