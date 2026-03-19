"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, X, PenLine } from "lucide-react";
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

// ← cyan-500 en vez de yellow-500
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "text-cyan-500 fill-cyan-500"
              : "text-slate-300 dark:text-slate-600"
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
      <p className="text-slate-400 text-sm animate-pulse">
        Cargando reseñas...
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <h2 className="text-slate-900 dark:text-white text-xl font-bold">
          Puntuación y Comentarios
        </h2>

        {totalReviews > 0 ? (
          <div className="flex flex-wrap gap-8 items-start">
            <div className="flex flex-col gap-1 items-center min-w-20">
              <p className="text-slate-900 dark:text-white text-5xl font-black leading-none">
                {averageRating.toFixed(1)}
              </p>
              <StarRating rating={Math.round(averageRating)} />
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                {totalReviews} reseñas
              </p>
            </div>

            <div className="flex flex-col gap-2 flex-1 min-w-40">
              {ratingDistribution.map(({ star, percent }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400 text-xs w-3 shrink-0">
                    {star}
                  </span>
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full transition-all duration-500" // ← cyan
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 text-xs w-8 text-right shrink-0">
                    {percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Todavía no hay reseñas para esta ruta. ¡Sé el primero!
          </p>
        )}

        {/* Botón escribir opinión */}
        <button
          onClick={() => {
            if (isSignedIn) {
              setIsModalOpen(true);
            } else {
              openSignIn({ forceRedirectUrl: pathname });
            }
          }}
          className="flex items-center gap-2 self-start bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-full text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700"
        >
          <PenLine className="w-4 h-4" />
          Escribir una opinión
        </button>

        {/* Lista — solo las visibles */}
        <div className="flex flex-col gap-6">
          {visibleReviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col gap-3 pb-6 border-b border-slate-200 dark:border-slate-800 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                  {review.user?.imageUrl ? (
                    <Image
                      src={review.user.imageUrl}
                      alt={review.user.name ?? "Usuario"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm font-bold">
                      {(review.user?.name ?? "U")[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white text-sm font-semibold">
                    {review.user?.name ?? "Usuario anónimo"}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    {timeAgo(review.createdAt)}
                  </p>
                </div>
              </div>

              <StarRating rating={review.rating} />

              {review.comment && (
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
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
            className="self-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-sm font-medium transition-colors underline underline-offset-2"
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
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold">
                Escribe tu opinión
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
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
