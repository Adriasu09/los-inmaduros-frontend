"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useCreateReview } from "@/features/reviews";
import { Button } from "@/components/ui/Button";

interface RouteReviewFormProps {
  routeId: string;
  routeSlug: string;
  onSuccess: () => void; // ← para cerrar la modal al terminar
}

export default function RouteReviewForm({
  routeId,
  routeSlug,
  onSuccess,
}: RouteReviewFormProps) {
  const {
    mutate: submitReview,
    isPending,
    isError,
  } = useCreateReview(routeId, routeSlug);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  function handleSubmit() {
    if (rating === 0) return;
    submitReview(
      { rating, comment: comment.trim() || undefined },
      { onSuccess }, // ← al tener éxito, llama a onSuccess (cierra la modal)
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Selector de estrellas */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-muted-foreground text-body-sm">
          Selecciona tu puntuación
        </p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-125"
            >
              <Star
                className={`w-9 h-9 transition-colors cursor-pointer ${
                  star <= (hoverRating || rating)
                    ? "text-primary fill-primary"
                    : "text-border dark:text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div className="flex flex-col gap-1">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="Comparte detalles sobre tu experiencia en esta ruta..."
          className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-body-sm text-foreground placeholder:text-faint-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-faint-foreground text-caption text-right">
          {comment.length}/500
        </p>
      </div>

      {isError && (
        <p className="text-destructive text-body-sm text-center">
          Ha ocurrido un error. Inténtalo de nuevo.
        </p>
      )}

      <Button
        size="sm"
        onClick={handleSubmit}
        disabled={rating === 0 || isPending}
        className="w-full rounded-lg"
      >
        {isPending ? "Publicando..." : "Publicar"}
      </Button>
    </div>
  );
}
