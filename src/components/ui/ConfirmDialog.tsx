"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  // Both optional: a dialog whose action is impossible right now shows only the
  // dismiss button instead of offering a click that is bound to fail.
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  isPending?: boolean;
  errorMessage?: string | null;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Volver",
  onConfirm,
  isPending = false,
  errorMessage,
  isDestructive = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        // Escape and the overlay must not close the dialog mid-request: the
        // mutation would still land with the user left staring at nothing.
        if (!isPending) onOpenChange(next);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {errorMessage && (
          <p
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {errorMessage}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="ghost" size="sm" disabled={isPending}>
              {cancelLabel}
            </Button>
          </AlertDialogCancel>
          {onConfirm && (
            <Button
              size="sm"
              onClick={onConfirm}
              disabled={isPending}
              aria-busy={isPending}
              className={cn(
                isDestructive &&
                  // The dark palette's --destructive is light enough that white
                  // text on it falls to 2.9:1; dark text clears AA instead.
                  "bg-destructive text-white hover:bg-destructive/90 dark:text-background",
              )}
            >
              {confirmLabel}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
