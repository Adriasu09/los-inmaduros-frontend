import { z } from "zod";
import { isMadridDateTimeInFuture } from "@/lib/date-utils";
import { VALID_PACES } from "./create-route-call-schema";

// Meeting points are deliberately absent: the backend's RouteCallUpdateIn does
// not accept them yet, so the edit form must not offer to change them.
export const editRouteCallSchema = z
  .object({
    title: z
      .string()
      .min(3, "El título debe tener al menos 3 caracteres")
      .max(100, "El título no puede superar 100 caracteres"),
    description: z
      .string()
      .max(1000, "La descripción no puede superar 1000 caracteres")
      .nullable(),
    dateRoute: z.string().min(1, "La fecha es obligatoria"),
    startTime: z.string().min(1, "La hora es obligatoria"),
    paces: z.array(z.enum(VALID_PACES)).min(1, "Selecciona al menos un ritmo"),
    coverImage: z.custom<File>().nullable(),
  })
  .refine(
    (data) => {
      if (!data.dateRoute || !data.startTime) return true;
      return isMadridDateTimeInFuture(data.dateRoute, data.startTime);
    },
    {
      message: "La fecha y hora deben ser futuras",
      path: ["dateRoute"],
    },
  );

export type EditRouteCallFormData = z.infer<typeof editRouteCallSchema>;
