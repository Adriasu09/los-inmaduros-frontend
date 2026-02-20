"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import NavbarLinks from "./NavbarLinks";
import NavbarActions from "./NavbarActions";
import NavbarMobileMenu from "./NavbarMobileMenu";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-slate-100/90 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            {mounted && (
              <Image
                src={theme === "dark" ? "/Logo_dark.png" : "/Logo_light.png"}
                alt="Logo Los Inmaduros Roller Madrid"
                width={180}
                height={48}
                className="h-auto w-45"
                priority
              />
            )}
          </Link>

          <NavbarLinks />

          <div className="flex items-center space-x-2">
            <NavbarActions />

            <button
              className="md:hidden p-2 rounded-full text-slate-700 dark:text-slate-300 hover:text-sky-400 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <NavbarMobileMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
      </div>
    </header>
  );
}
