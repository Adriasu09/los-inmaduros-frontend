"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NavbarActions() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-4">
      {/* TOGGLE DARK/LIGHT */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="cursor-pointer p-2 rounded-full text-soft-foreground hover:text-primary hover:bg-accent transition-colors"
        aria-label="Cambiar tema"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* AUTH CON CLERK */}
      <SignedOut>
        <Link href="/sign-in">
          <Button size="sm">Únete</Button>
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
