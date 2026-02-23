"use client";

import { SOCIAL_LINKS } from "@/constants";
import Link from "next/link";

export default function FooterSocial() {
  return (
    <div>
      <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
        Síguenos
      </h4>
      <div className="flex space-x-4">
        {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
          <Link
            target="_blank"
            key={label}
            href={href}
            aria-label={label}
            className="text-slate-400 hover:text-sky-400 transition-colors"
          >
            <Icon size={24} />
          </Link>
        ))}
      </div>
    </div>
  );
}
