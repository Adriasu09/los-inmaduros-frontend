import { getUpcomingRouteCallsServer } from "@/features/route-calls";
import HeroSection from "./components/HeroSection";
import UpcomingRoutesSection from "./components/UpcomingRoutesSection";

export default async function HomePage() {
  const response = await getUpcomingRouteCallsServer();
  const routeCalls = response?.data ?? [];

  return (
    <>
      <HeroSection />
      <UpcomingRoutesSection routeCalls={routeCalls} />
    </>
  );
}
