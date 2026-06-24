"use client";

import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MarqueDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  marqueNom: string | null;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function MarqueDeleteDialog({
  open,
  onOpenChange,
  marqueNom,
  onConfirm,
  isDeleting,
}: MarqueDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={!isDeleting}>
        <DialogHeader>
          <DialogTitle className="font-serif tracking-tight">
            Supprimer la marque
          </DialogTitle>
          <DialogDescription>
            La marque{" "}
            <span className="font-medium text-foreground">{marqueNom}</span>{" "}
            sera définitivement supprimée, ainsi que ses images stockées. Cette
            action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="size-4 animate-spin" />}
            {isDeleting ? "Suppression…" : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
