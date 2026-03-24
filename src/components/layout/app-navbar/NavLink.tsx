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
        "px-4 rounded-full font-medium text-body-sm transition-all duration-200",
        isActive
          ? "bg-primary/20 text-primary font-semibold"
          : "text-soft-foreground hover:text-primary hover:bg-accent",
        className,
      )}
    >
      {label}
    </Link>
  );
}
