"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  createRouteCallSchema,
  type CreateRouteCallFormData,
} from "@/features/route-calls/schemas/create-route-call-schema";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateRouteCall } from "@/features/route-calls/hooks/use-route-calls";
import { uploadPhoto } from "@/features/photos/services/photos-service";
import { queryKeys } from "@/lib/api/query-keys";
import type { CreateRouteCallPayload } from "@/features/route-calls/services/route-calls-service";
import type { Route, RoutePace } from "@/types";
import { PREDEFINED_MEETING_POINTS } from "@/constants";
import RouteSelector from "./RouteSelector";
import CoverImageSection from "./CoverImageSection";
import PaceMultiSelect from "./PaceMultiSelect";
import MeetingPointSelector from "./MeetingPointSelector";
import type { MeetingPointValue } from "./MeetingPointSelector";

// Lazy import RichTextEditor (not needed for SSR)
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(
  () => import("@/components/ui/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-45 bg-muted border border-border rounded-lg animate-pulse" />
    ),
  },
);

export default function CreateRouteCallForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createRouteCall = useCreateRouteCall();
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateRouteCallFormData>({
    resolver: zodResolver(createRouteCallSchema),
    defaultValues: {
      routeId: null,
      title: "",
      description: null,
      dateRoute: "",
      startTime: "",
      paces: [],
      primaryMeetingPoint: {
        predefinedId: null,
        customName: null,
        location: null,
        time: null,
      },
      hasSecondaryMeetingPoint: false,
      secondaryMeetingPoint: null,
      coverImage: null,
    },
  });

  const hasSecondaryMeetingPoint = watch("hasSecondaryMeetingPoint");
  const routeId = watch("routeId");
  const title = watch("title");

  // Handle route selection change
  const handleRouteChange = (route: Route | null) => {
    setSelectedRoute(route);
    if (route) {
      setValue("routeId", route.id);
      setValue("title", route.name);
    } else {
      setValue("routeId", null);
      setValue("title", "");
    }
  };

  // Convert a location value to a Google Maps URL
  const toGoogleMapsUrl = (location: string | null): string | undefined => {
    if (!location) return undefined;
    // Already a URL
    if (location.startsWith("http")) return location;
    // It's coordinates "lat,lng" — convert to Google Maps URL
    const [lat, lng] = location.split(",");
    if (lat && lng) {
      return `https://www.google.com/maps?q=${lat.trim()},${lng.trim()}`;
    }
    return undefined;
  };

  // Build meeting point payload from form value
  // Returns clean object with no null values (backend uses .optional(), not .nullable())
  const buildMeetingPointPayload = (
    mp: MeetingPointValue,
    type: "PRIMARY" | "SECONDARY",
    dateStr: string,
  ): CreateRouteCallPayload["meetingPoints"][number] => {
    // Convert time "HH:mm" to ISO datetime using the route date
    const isoTime =
      mp.time && dateStr
        ? new Date(`${dateStr}T${mp.time}`).toISOString()
        : undefined;

    if (mp.predefinedId) {
      const predefined = PREDEFINED_MEETING_POINTS.find(
        (p) => p.id === mp.predefinedId,
      );
      return {
        type,
        name: predefined?.name ?? mp.predefinedId,
        location: predefined?.googleMapsUrl ?? toGoogleMapsUrl(mp.location),
        ...(isoTime && { time: isoTime }),
      };
    }

    return {
      type,
      name: mp.customName?.trim() || "",
      ...(mp.customName?.trim() && { customName: mp.customName.trim() }),
      ...(toGoogleMapsUrl(mp.location) && { location: toGoogleMapsUrl(mp.location) }),
      ...(isoTime && { time: isoTime }),
    };
  };

  const onSubmit = async (data: CreateRouteCallFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Build payload
      // Combine date + time into ISO string
      const dateRoute = new Date(
        `${data.dateRoute}T${data.startTime}`,
      ).toISOString();

      const meetingPoints = [
        buildMeetingPointPayload(data.primaryMeetingPoint, "PRIMARY", data.dateRoute),
      ];

      if (data.hasSecondaryMeetingPoint && data.secondaryMeetingPoint) {
        meetingPoints.push(
          buildMeetingPointPayload(data.secondaryMeetingPoint, "SECONDARY", data.dateRoute),
        );
      }

      const payload: CreateRouteCallPayload = {
        ...(data.routeId && { routeId: data.routeId }),
        title: data.title,
        ...(data.description && { description: data.description }),
        dateRoute,
        paces: data.paces,
        meetingPoints,
      };

      // 2. Create route call
      const result = await createRouteCall.mutateAsync(payload);
      const newRouteCallId = result.data.id;

      // 3. Upload cover image if present
      if (data.coverImage) {
        await uploadPhoto({
          image: data.coverImage,
          context: "ROUTE_CALL_COVER",
          routeCallId: newRouteCallId,
        });
        // Re-invalidate after photo upload so the home page fetches the updated image URL
        await queryClient.invalidateQueries({
          queryKey: queryKeys.routeCalls.lists(),
        });
      }

      // 4. Redirect to home
      router.push("/");
    } catch {
      setSubmitError(
        "Ha ocurrido un error al crear la convocatoria. Inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      {/* ─── Section 1: Route Selection ─── */}
      <section>
        <Controller
          control={control}
          name="routeId"
          render={() => (
            <RouteSelector
              selectedRouteId={routeId}
              onRouteChange={handleRouteChange}
              customTitle={title}
              onCustomTitleChange={(t) => setValue("title", t)}
              titleError={errors.title?.message}
            />
          )}
        />
      </section>

      {/* ─── Section 2: Cover Image ─── */}
      <section>
        <Controller
          control={control}
          name="coverImage"
          render={({ field }) => (
            <CoverImageSection
              routeImageUrl={selectedRoute?.image}
              coverImage={field.value}
              onImageChange={(file) => field.onChange(file)}
            />
          )}
        />
      </section>

      {/* ─── Section 3: Date & Time ─── */}
      <section>
        <h3 className="text-label font-semibold text-foreground mb-3">
          Fecha y hora de inicio
        </h3>
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
                  min={today}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-body-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
            />
            {errors.dateRoute && (
              <p className="text-destructive text-caption">
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
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-body-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
            />
            {errors.startTime && (
              <p className="text-destructive text-caption">
                {errors.startTime.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ─── Section 4: Pace Selection ─── */}
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

      {/* ─── Section 5: Primary Meeting Point ─── */}
      <section>
        <Controller
          control={control}
          name="primaryMeetingPoint"
          render={({ field }) => (
            <MeetingPointSelector
              value={field.value}
              onChange={field.onChange}
              showTimeInput={false}
              label="Punto de encuentro"
              error={errors.primaryMeetingPoint?.message}
            />
          )}
        />
      </section>

      {/* ─── Section 6: Secondary Meeting Point ─── */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <label className="text-label font-semibold text-foreground">
            Punto de encuentro secundario
          </label>
          <Controller
            control={control}
            name="hasSecondaryMeetingPoint"
            render={({ field }) => (
              <button
                type="button"
                onClick={() => {
                  const newValue = !field.value;
                  field.onChange(newValue);
                  if (newValue) {
                    setValue("secondaryMeetingPoint", {
                      predefinedId: null,
                      customName: null,
                      location: null,
                      time: null,
                    });
                  } else {
                    setValue("secondaryMeetingPoint", null);
                  }
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors touch-manipulation ${
                  field.value ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    field.value ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            )}
          />
        </div>

        {hasSecondaryMeetingPoint && (
          <Controller
            control={control}
            name="secondaryMeetingPoint"
            render={({ field }) => (
              <MeetingPointSelector
                value={
                  field.value ?? {
                    predefinedId: null,
                    customName: null,
                    location: null,
                    time: null,
                  }
                }
                onChange={field.onChange}
                showTimeInput={true}
                label=""
                error={errors.secondaryMeetingPoint?.message}
                timeError={
                  (
                    errors.secondaryMeetingPoint as
                      | { time?: { message?: string } }
                      | undefined
                  )?.time?.message
                }
              />
            )}
          />
        )}
      </section>

      {/* ─── Section 7: Description ─── */}
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
      </section>

      {/* ─── Submit Error ─── */}
      {submitError && (
        <p className="text-destructive text-body-sm text-center bg-destructive/10 rounded-lg p-3">
          {submitError}
        </p>
      )}

      {/* ─── Submit Button ─── */}
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        leftIcon={
          isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : undefined
        }
        className="w-full"
      >
        {isSubmitting ? "Creando convocatoria..." : "Convocar"}
      </Button>
    </form>
  );
}
