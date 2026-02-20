"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { NAV_LINKS } from "@/constants";

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
  }, [pathname]);

  if (!isOpen) return null;

  return (
    <nav className="md:hidden pb-4 flex flex-col space-y-1">
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`
              px-4 py-3 rounded-full font-medium text-sm transition-all duration-200
              ${
                isActive
                  ? "bg-sky-400/20 text-sky-400 font-semibold"
                  : "text-slate-700 dark:text-slate-300 hover:text-sky-400 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }
            `}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
