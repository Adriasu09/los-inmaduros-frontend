"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants";

export default function NavbarLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex md:items-center gap-1">
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              px-4 py-2 rounded-full font-medium text-sm transition-all duration-200
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
