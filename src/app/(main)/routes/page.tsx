import { getRoutesServer } from "@/features/routes";
import RouteGrid from "./components/RouteGrid";
import RoutesHero from "./components/RoutesHero";

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
        <RoutesHero />
        <RouteGrid routes={routes} />
      </div>
    </div>
  );
}
