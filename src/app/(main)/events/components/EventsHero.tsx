import CreateRouteCallButton from "@/components/home/CreateRouteCallButton";

export default function EventsHero() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 className="text-foreground text-title">
          Rutas Programadas y Pasadas
        </h1>
        <p className="text-muted-foreground text-body-sm mt-2">
          Explora, únete a futuras rutas o rememora aventuras pasadas.
        </p>
      </div>
      <CreateRouteCallButton />
    </div>
  );
}
