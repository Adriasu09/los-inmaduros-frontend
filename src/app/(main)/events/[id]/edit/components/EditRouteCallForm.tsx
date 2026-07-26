"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/errors";
import { getMadridDateTimeParts, madridDateTimeToIso } from "@/lib/date-utils";
import {
  CoverImageSection,
  PaceMultiSelect,
  editRouteCallSchema,
  useRouteCallPermissions,
  useUpdateRouteCall,
  type EditRouteCallFormData,
  type UpdateRouteCallPayload,
} from "@/features/route-calls";
import { uploadPhoto } from "@/features/photos";
import type { RouteCall, RoutePace } from "@/types";

const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-45 bg-muted border border-border rounded-lg animate-pulse" />
  ),
});

interface EditRouteCallFormProps {
  routeCall: RouteCall;
}

export default function EditRouteCallForm({
  routeCall,
}: EditRouteCallFormProps) {
  const router = useRouter();
  const { canEdit } = useRouteCallPermissions(routeCall);
  const updateRouteCall = useUpdateRouteCall(routeCall.id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initial = getMadridDateTimeParts(routeCall.dateRoute);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditRouteCallFormData>({
    resolver: zodResolver(editRouteCallSchema),
    defaultValues: {
      title: routeCall.title,
      description: routeCall.description,
      dateRoute: initial.date,
      startTime: initial.time,
      paces: routeCall.paces,
      coverImage: null,
    },
  });

  const backToDetail = (
    <Link
      href={`/events/${routeCall.id}`}
      className="flex items-center gap-2 text-body-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
    >
      <ArrowLeft className="w-4 h-4" />
      Volver a la convocatoria
    </Link>
  );

  // The route is public (middleware matches /events(.*)), so the form itself is
  // the gate. The backend rejects it too — this is the outer layer, not the only one.
  if (!canEdit) {
    return (
      <div className="flex flex-col gap-4">
        {backToDetail}
        <p className="text-muted-foreground text-body">
          {routeCall.status === "SCHEDULED"
            ? "Solo quien organiza esta convocatoria puede editarla."
            : "Esta convocatoria ya no se puede editar: solo se editan las que siguen programadas."}
        </p>
      </div>
    );
  }

  const onSubmit = async (data: EditRouteCallFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Partial update: only changed fields travel. An absent field is left
    // untouched by the backend; `description: null` is what clears it.
    const payload: UpdateRouteCallPayload = {};

    if (data.title !== routeCall.title) {
      payload.title = data.title;
    }

    const description = data.description?.trim() ? data.description : null;
    if (description !== routeCall.description) {
      payload.description = description;
    }

    if (data.dateRoute !== initial.date || data.startTime !== initial.time) {
      payload.dateRoute = madridDateTimeToIso(data.dateRoute, data.startTime);
    }

    const pacesChanged =
      data.paces.length !== routeCall.paces.length ||
      data.paces.some((pace) => !routeCall.paces.includes(pace));
    if (pacesChanged) {
      payload.paces = data.paces;
    }

    try {
      if (Object.keys(payload).length > 0) {
        await updateRouteCall.mutateAsync(payload);
      }
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        // 400 with a field map: put each message on its own input (D13).
        for (const [field, messages] of Object.entries(error.errors)) {
          if (field in data) {
            setError(field as keyof EditRouteCallFormData, {
              message: messages[0],
            });
          }
        }
      }
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "No se han podido guardar los cambios. Inténtalo de nuevo.",
      );
      setIsSubmitting(false);
      return;
    }

    // The cover travels in its own request, so a failure here must NOT be
    // reported as "the edit failed": the edit already landed.
    if (data.coverImage) {
      try {
        await uploadPhoto({
          image: data.coverImage,
          context: "ROUTE_CALL_COVER",
          routeCallId: routeCall.id,
        });
      } catch (error) {
        setSubmitError(
          error instanceof ApiError
            ? `Los cambios se guardaron, pero la portada no se pudo subir: ${error.message}`
            : "Los cambios se guardaron, pero la portada no se pudo subir. Vuelve a intentarlo desde el formulario.",
        );
        setIsSubmitting(false);
        return;
      }
    }

    router.push(`/events/${routeCall.id}`);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      {backToDetail}

      <h1 className="text-foreground text-title">Editar convocatoria</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <section className="flex flex-col gap-1.5">
          <label
            htmlFor="title"
            className="text-label font-semibold text-foreground"
          >
            Título *
          </label>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <input
                {...field}
                id="title"
                type="text"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-body-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
          />
          {errors.title && (
            <p id="title-error" className="text-destructive text-caption">
              {errors.title.message}
            </p>
          )}
        </section>

        <section>
          <Controller
            control={control}
            name="coverImage"
            render={({ field }) => (
              <CoverImageSection
                routeImageUrl={routeCall.image}
                coverImage={field.value}
                onImageChange={(file) => field.onChange(file)}
              />
            )}
          />
        </section>

        <section>
          <h2 className="text-label font-semibold text-foreground mb-3">
            Fecha y hora de inicio
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="dateRoute"
                className="text-caption font-medium text-soft-foreground"
              >
                Fecha *
              </label>
              <Controller
                control={control}
                name="dateRoute"
                render={({ field }) => (
                  <input
                    {...field}
                    id="dateRoute"
                    type="date"
                    aria-invalid={!!errors.dateRoute}
                    aria-describedby={
                      errors.dateRoute ? "dateRoute-error" : undefined
                    }
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-body-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
              />
              {errors.dateRoute && (
                <p
                  id="dateRoute-error"
                  className="text-destructive text-caption"
                >
                  {errors.dateRoute.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="startTime"
                className="text-caption font-medium text-soft-foreground"
              >
                Hora *
              </label>
              <Controller
                control={control}
                name="startTime"
                render={({ field }) => (
                  <input
                    {...field}
                    id="startTime"
                    type="time"
                    aria-invalid={!!errors.startTime}
                    aria-describedby={
                      errors.startTime ? "startTime-error" : undefined
                    }
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-body-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
              />
              {errors.startTime && (
                <p
                  id="startTime-error"
                  className="text-destructive text-caption"
                >
                  {errors.startTime.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <section>
          <Controller
            control={control}
            name="paces"
            render={({ field }) => (
              <PaceMultiSelect
                selected={field.value}
                onChange={(paces) => field.onChange(paces as RoutePace[])}
                error={errors.paces?.message}
              />
            )}
          />
        </section>

        <section>
          <label className="text-label font-semibold text-foreground mb-3 block">
            Descripción / Comentarios
          </label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <RichTextEditor
                value={field.value ?? ""}
                onChange={(html) => field.onChange(html || null)}
                placeholder="Deja tu comentario o especificaciones de la ruta. Puedes usar negritas, cursivas y viñetas..."
              />
            )}
          />
          {errors.description && (
            <p className="text-destructive text-caption mt-1.5">
              {errors.description.message}
            </p>
          )}
        </section>

        {submitError && (
          <p
            role="alert"
            className="text-destructive text-body-sm text-center bg-destructive/10 rounded-lg p-3"
          >
            {submitError}
          </p>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Link href={`/events/${routeCall.id}`}>
            <Button type="button" variant="ghost" size="lg" className="w-full">
              Descartar
            </Button>
          </Link>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            leftIcon={
              isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : undefined
            }
          >
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
