import { notFound } from "next/navigation";
import { getRouteCallByIdServer } from "@/features/route-calls";
import EditRouteCallForm from "./components/EditRouteCallForm";

interface EditRouteCallPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRouteCallPage({
  params,
}: EditRouteCallPageProps) {
  const { id } = await params;

  const response = await getRouteCallByIdServer(id);

  if (!response?.success || !response?.data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EditRouteCallForm routeCall={response.data} />
      </div>
    </div>
  );
}
