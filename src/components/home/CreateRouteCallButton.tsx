"use client";

import { useRouter, usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CreateRouteCallButton() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (!isSignedIn) {
      openSignIn({ forceRedirectUrl: pathname });
      return;
    }
    router.push("/events/create");
  };

  return (
    <Button
      variant="outline"
      leftIcon={<PlusCircle size={18} />}
      onClick={handleClick}
    >
      Crear Ruta/Evento
    </Button>
  );
}
