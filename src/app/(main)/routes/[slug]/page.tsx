import { notFound } from "next/navigation";
import { getRouteBySlugServer } from "@/features/routes";
import RouteDetailHero from "./components/RouteDetailHero";
import RouteReviews from "./components/RouteReviews";

interface RouteDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function RouteDetailPage({
  params,
}: RouteDetailPageProps) {
  const { slug } = await params;

  const response = await getRouteBySlugServer(slug);

  if (!response?.success || !response?.data) {
    notFound();
  }

  const route = response.data;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RouteDetailHero route={route} />
      </div>
    </div>
  );
}
