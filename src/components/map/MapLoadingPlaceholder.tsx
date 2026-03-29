import { Route } from "lucide-react";

interface MapLoadingPlaceholderProps {
  message?: string;
}

export default function MapLoadingPlaceholder({
  message = "Cargando mapa...",
}: MapLoadingPlaceholderProps) {
  return (
    <div className="w-full h-full rounded-lg bg-muted flex flex-col items-center justify-center gap-2">
      <Route className="w-8 h-8 text-faint-foreground" />
      <p className="text-faint-foreground text-body-sm text-center px-4">
        {message}
      </p>
    </div>
  );
}
