import type { Metadata } from "next";
import CreateRouteCallForm from "./components/CreateRouteCallForm";

export const metadata: Metadata = {
  title: "Convocar Ruta | Los Inmaduros",
  description:
    "Crea una nueva convocatoria de ruta de patinaje para la comunidad",
};

export default function CreateRouteCallPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-heading md:text-title font-bold text-foreground">
          Convocar Ruta
        </h1>
        <p className="mt-2 text-body-sm text-muted-foreground">
          Crea una convocatoria para que otros patinadores se unan a tu ruta
        </p>
      </div>

      <CreateRouteCallForm />
    </div>
  );
}
