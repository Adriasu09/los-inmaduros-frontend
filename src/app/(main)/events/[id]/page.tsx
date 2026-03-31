import { notFound } from "next/navigation";
import { getRouteCallByIdServer } from "@/features/route-calls";
import RouteCallDetail from "./components/RouteCallDetail";

interface RouteCallDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RouteCallDetailPage({
  params,
}: RouteCallDetailPageProps) {
  const { id } = await params;

  const response = await getRouteCallByIdServer(id);

  if (!response?.success || !response?.data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RouteCallDetail routeCall={response.data} />
      </div>
    </div>
  );
}
