"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import dynamic from "next/dynamic";
import NavbarLinks from "./NavbarLinks";
import NavbarMobileMenu from "./NavbarMobileMenu";

const NavbarActions = dynamic(() => import("./NavbarActions"), { ssr: false });

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  // useCallback garantiza una referencia estable para onClose,
  // evitando que el useEffect de NavbarMobileMenu se dispare en cada render
  const handleCloseMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className="sticky top-0 z-50 bg-muted/90 dark:bg-card/80 backdrop-blur-sm shadow-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/Logo_dark.png"
              alt="Logo Los Inmaduros Roller Madrid"
              width={180}
              height={48}
              className="h-auto w-45 hidden dark:block"
              priority
            />
            <Image
              src="/Logo_light.png"
              alt="Logo Los Inmaduros Roller Madrid"
              width={180}
              height={48}
              className="h-auto w-45 block dark:hidden"
              priority
            />
          </Link>

          <NavbarLinks />

          <div className="flex items-center space-x-2">
            <NavbarActions />

            <button
              className="md:hidden p-2 rounded-full text-soft-foreground hover:text-primary hover:bg-accent transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <NavbarMobileMenu
          isOpen={menuOpen}
          onClose={handleCloseMenu}
        />
      </div>
    </header>
  );
}
