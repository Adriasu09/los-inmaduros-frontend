import Link from "next/link";
import { FOOTER_EXPLORE_LINKS, FOOTER_COMMUNITY_LINKS } from "@/constants";

export default function FooterLinks() {
  return (
    <>
      {/* EXPLORAR */}
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
          Explorar
        </h4>
        <ul className="space-y-2">
          {FOOTER_EXPLORE_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-sky-400 dark:hover:text-sky-400 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* COMUNIDAD */}
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
          Comunidad
        </h4>
        <ul className="space-y-2">
          {FOOTER_COMMUNITY_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-sky-400 dark:hover:text-sky-400 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
