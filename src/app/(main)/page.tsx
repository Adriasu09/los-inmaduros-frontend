import HeroSection from "@/components/home/HeroSection";
import UpcomingRoutesSection from "@/components/home/UpcomingRoutesSection";
import { getUpcomingRouteCallsServer } from "@/features/route-calls";

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
