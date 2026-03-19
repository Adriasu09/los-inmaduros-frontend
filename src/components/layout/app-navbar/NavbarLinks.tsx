"use client";

import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants";
import NavLink from "./NavLink";

export default function NavbarLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex md:items-center gap-1">
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={link.label}
          isActive={pathname === link.href}
          className="py-2"
        />
      ))}
    </nav>
  );
}
