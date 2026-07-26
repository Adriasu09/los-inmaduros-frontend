"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";
import type { RouteCall } from "@/types";
import { useRouteCallPermissions } from "../hooks/use-route-call-permissions";
import { useCancelRouteCall } from "../hooks/use-route-calls";

const ACTION_BUTTON =
  "grid place-items-center w-8 h-8 rounded-full bg-background/85 backdrop-blur-sm shadow-md transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

interface RouteCallCardActionsProps {
  routeCall: RouteCall;
}

export default function RouteCallCardActions({
  routeCall,
}: RouteCallCardActionsProps) {
  const router = useRouter();
  const { canEdit, canCancel } = useRouteCallPermissions(routeCall);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const {
    mutate: cancel,
    isPending: isCancelling,
    error: cancelError,
    reset: resetCancel,
  } = useCancelRouteCall(routeCall.id);

  if (!canEdit && !canCancel) return null;

  // The whole card is a <Link>, so a plain click here would navigate to the
  // detail page instead of running the action.
  const intercept = (event: React.MouseEvent, action: () => void) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };

  const handleCancel = () => {
    cancel(undefined, {
      onSuccess: () => {
        setIsCancelOpen(false);
        // The hook invalidates the list queries, which covers /events. The home
        // page renders its cards on the server, so it needs the refresh too.
        router.refresh();
      },
    });
  };

  return (
    <>
      <div className="absolute top-3 right-3 flex items-center gap-2">
        {canEdit && (
          <button
            type="button"
            aria-label={`Editar ${routeCall.title}`}
            onClick={(event) =>
              intercept(event, () =>
                router.push(`/events/${routeCall.id}/edit`),
              )
            }
            className={cn(ACTION_BUTTON, "text-foreground hover:bg-background")}
          >
            <Pencil size={15} />
          </button>
        )}
        {canCancel && (
          <button
            type="button"
            aria-label={`Cancelar ${routeCall.title}`}
            onClick={(event) =>
              intercept(event, () => {
                resetCancel();
                setIsCancelOpen(true);
              })
            }
            className={cn(
              ACTION_BUTTON,
              "text-destructive hover:bg-destructive hover:text-white dark:hover:text-background",
            )}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <ConfirmDialog
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        title="¿Cancelar esta convocatoria?"
        description={`"${routeCall.title}" quedará marcada como cancelada y se anunciará en el canal de Telegram. Si la compartiste por WhatsApp o en otros grupos, avisa también allí: esos mensajes no se actualizan solos. Esta acción no se puede deshacer.`}
        confirmLabel="Sí, cancelar"
        onConfirm={handleCancel}
        isPending={isCancelling}
        errorMessage={cancelError?.message}
        isDestructive
      />
    </>
  );
}
