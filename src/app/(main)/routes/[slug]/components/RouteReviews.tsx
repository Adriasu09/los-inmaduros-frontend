"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, X, PenLine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth, useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useRoute } from "@/features/routes";
import RouteReviewForm from "./RouteReviewForm";

interface RouteReviewsProps {
  routeSlug: string;
  routeId: string;
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Hace 1 día";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
  return `Hace ${Math.floor(diffDays / 365)} años`;
}

// Estrellas usando token primary
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "text-primary fill-primary"
              : "text-border dark:text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

const REVIEWS_PER_PAGE = 5; // cuántas se muestran inicialmente y cuántas se añaden al pulsar "Ver más"

export default function RouteReviews({
  routeSlug,
  routeId,
}: RouteReviewsProps) {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const pathname = usePathname();
  const { data: response, isLoading } = useRoute(routeSlug);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE); // ← nuevo

  const route = response?.data;
  const reviews = route?.reviews ?? [];
  const totalReviews = route?._count?.reviews ?? 0;
  const averageRating = route?.averageRating ?? 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percent =
      totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { star, count, percent };
  });

  // Las reviews que mostramos ahora mismo (slice = "cortar" el array)
  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length; // ¿quedan reseñas por mostrar?

  if (isLoading) {
    return (
      <p className="text-faint-foreground text-sm animate-pulse">
        Cargando reseñas...
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <h2 className="text-foreground text-xl font-bold">
          Puntuación y Comentarios
        </h2>

        {totalReviews > 0 ? (
          <div className="flex flex-wrap gap-8 items-start">
            <div className="flex flex-col gap-1 items-center min-w-20">
              <p className="text-foreground text-5xl font-black leading-none">
                {averageRating.toFixed(1)}
              </p>
              <StarRating rating={Math.round(averageRating)} />
              <p className="text-muted-foreground text-xs mt-1">
                {totalReviews} reseñas
              </p>
            </div>

            <div className="flex flex-col gap-2 flex-1 min-w-40">
              {ratingDistribution.map(({ star, percent }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs w-3 shrink-0">
                    {star}
                  </span>
                  <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground text-xs w-8 text-right shrink-0">
                    {percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Todavía no hay reseñas para esta ruta. ¡Sé el primero!
          </p>
        )}

        {/* Botón escribir opinión */}
        <Button
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={() => {
            if (isSignedIn) {
              setIsModalOpen(true);
            } else {
              openSignIn({ forceRedirectUrl: pathname });
            }
          }}
          leftIcon={<PenLine className="w-4 h-4" />}
        >
          Escribir una opinión
        </Button>

        {/* Lista — solo las visibles */}
        <div className="flex flex-col gap-6">
          {visibleReviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col gap-3 pb-6 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-accent shrink-0">
                  {review.user?.imageUrl ? (
                    <Image
                      src={review.user.imageUrl}
                      alt={review.user.name ?? "Usuario"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-bold">
                      {(review.user?.name ?? "U")[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">
                    {review.user?.name ?? "Usuario anónimo"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {timeAgo(review.createdAt)}
                  </p>
                </div>
              </div>

              <StarRating rating={review.rating} />

              {review.comment && (
                <p className="text-soft-foreground text-sm leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Botón "Ver más" — solo si quedan reseñas */}
        {hasMore && (
          <button
            onClick={() => setVisibleCount((prev) => prev + REVIEWS_PER_PAGE)}
            className="self-center text-primary hover:text-primary-hover text-sm font-medium transition-colors underline underline-offset-2"
          >
            Ver más reseñas ({reviews.length - visibleCount} restantes)
          </button>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-foreground text-lg font-bold">
                Escribe tu opinión
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-faint-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <RouteReviewForm
              routeId={routeId}
              routeSlug={routeSlug}
              onSuccess={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
