import { z } from "zod";

const VALID_PACES = [
  "ROCA",
  "CARACOL",
  "GUSANO",
  "MARIPOSA",
  "EXPERIMENTADO",
  "LOCURA_TOTAL",
  "MIAUCORNIA",
] as const;

const meetingPointSchema = z.object({
  predefinedId: z.string().nullable(),
  customName: z.string().nullable(),
  location: z.string().nullable(),
  time: z.string().nullable(),
});

export const createRouteCallSchema = z
  .object({
    routeId: z.string().nullable(),
    title: z
      .string()
      .min(3, "El título debe tener al menos 3 caracteres")
      .max(100, "El título no puede superar 100 caracteres"),
    description: z.string().nullable(),
    dateRoute: z.string().min(1, "La fecha es obligatoria"),
    startTime: z.string().min(1, "La hora es obligatoria"),
    paces: z
      .array(z.enum(VALID_PACES))
      .min(1, "Selecciona al menos un ritmo"),
    primaryMeetingPoint: meetingPointSchema,
    hasSecondaryMeetingPoint: z.boolean(),
    secondaryMeetingPoint: meetingPointSchema.nullable(),
    coverImage: z.custom<File>().nullable(),
  })
  .refine(
    (data) => {
      const mp = data.primaryMeetingPoint;
      return (
        mp.predefinedId !== null ||
        (mp.customName !== null && mp.customName.trim().length > 0)
      );
    },
    {
      message: "Indica el punto de encuentro",
      path: ["primaryMeetingPoint"],
    },
  )
  .refine(
    (data) => {
      if (!data.hasSecondaryMeetingPoint || !data.secondaryMeetingPoint)
        return true;
      const mp = data.secondaryMeetingPoint;
      return (
        mp.predefinedId !== null ||
        (mp.customName !== null && mp.customName.trim().length > 0)
      );
    },
    {
      message: "Indica el punto de encuentro secundario",
      path: ["secondaryMeetingPoint"],
    },
  )
  .refine(
    (data) => {
      if (!data.hasSecondaryMeetingPoint || !data.secondaryMeetingPoint)
        return true;
      return (
        data.secondaryMeetingPoint.time !== null &&
        data.secondaryMeetingPoint.time.trim().length > 0
      );
    },
    {
      message: "El punto secundario requiere una hora",
      path: ["secondaryMeetingPoint", "time"],
    },
  )
  .refine(
    (data) => {
      if (!data.dateRoute || !data.startTime) return true;
      const selectedDate = new Date(`${data.dateRoute}T${data.startTime}`);
      return selectedDate > new Date();
    },
    {
      message: "La fecha y hora deben ser futuras",
      path: ["dateRoute"],
    },
  )
  .refine(
    (data) => {
      if (
        !data.hasSecondaryMeetingPoint ||
        !data.secondaryMeetingPoint?.time ||
        !data.startTime
      )
        return true;
      return data.secondaryMeetingPoint.time > data.startTime;
    },
    {
      message:
        "La hora del punto secundario debe ser posterior a la hora de inicio",
      path: ["secondaryMeetingPoint", "time"],
    },
  );

export type CreateRouteCallFormData = z.infer<typeof createRouteCallSchema>;
