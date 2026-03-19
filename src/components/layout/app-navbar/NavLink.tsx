import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}

export default function NavLink({
  href,
  label,
  isActive,
  onClick,
  className,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "px-4 rounded-full font-medium text-sm transition-all duration-200",
        isActive
          ? "bg-sky-400/20 text-sky-400 font-semibold"
          : "text-slate-700 dark:text-slate-300 hover:text-sky-400 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800",
        className,
      )}
    >
      {label}
    </Link>
  );
}
