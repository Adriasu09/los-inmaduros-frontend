import {
  getAllUpcomingRouteCallsServer,
  getPastRouteCallsServer,
} from "@/features/route-calls";
import EventsHero from "./components/EventsHero";
import EventsContent from "./components/EventsContent";

export const metadata = {
  title: "Eventos | Los Inmaduros Roller Madrid",
  description:
    "Todas las convocatorias de patinaje — próximas rutas y eventos pasados",
};

export default async function EventsPage() {
  const [upcomingRes, pastRes] = await Promise.all([
    getAllUpcomingRouteCallsServer(),
    getPastRouteCallsServer(),
  ]);

  const initialUpcoming = upcomingRes?.data ?? [];
  const initialPast = pastRes?.data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EventsHero />
        <EventsContent
          initialUpcoming={initialUpcoming}
          initialPast={initialPast}
        />
      </div>
    </div>
  );
}
