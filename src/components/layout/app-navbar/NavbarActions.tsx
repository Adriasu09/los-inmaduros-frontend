"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NavbarActions() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex items-center space-x-4">
      {/* TOGGLE DARK/LIGHT */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full text-slate-700 dark:text-slate-300 hover:text-sky-400 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Cambiar tema"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      )}

      {/* AUTH CON CLERK */}
      <SignedOut>
        <Link href="/sign-in">
          <Button size="sm">Únete</Button>
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}
