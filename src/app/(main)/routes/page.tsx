import { getRoutesServer } from "@/features/routes";
import RouteGrid from "./components/RouteGrid";

export const metadata = {
  title: "Rutas | Los Inmaduros Roller Madrid",
  description: "Descubre las mejores rutas de patinaje urbano en Madrid",
};

export default async function RoutesPage() {
  const response = await getRoutesServer();
  const routes = response.data ?? [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* CABECERA */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Rutas Prediseñadas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Explora las mejores rutas de patinaje urbano de Madrid,
            seleccionadas por nuestra comunidad.
          </p>
        </div>

        {/* GRID CON BUSCADOR */}
        <RouteGrid routes={routes} />
      </div>
    </div>
  );
}
