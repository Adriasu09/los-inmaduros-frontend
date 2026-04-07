"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { NAV_LINKS } from "@/constants";
import NavLink from "./NavLink";

interface NavbarMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavbarMobileMenu({
  isOpen,
  onClose,
}: NavbarMobileMenuProps) {
  const pathname = usePathname();

  // Cierra el menú automáticamente si cambia la ruta
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isOpen) return null;

  return (
    <nav id="mobile-menu" className="md:hidden pb-4 flex flex-col space-y-1" aria-label="Menú móvil">
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={link.label}
          isActive={pathname === link.href}
          onClick={onClose}
          className="py-3"
        />
      ))}
    </nav>
  );
}
