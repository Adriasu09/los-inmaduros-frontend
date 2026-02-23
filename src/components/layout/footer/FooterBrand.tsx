"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function FooterBrand() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link href="/">
      {mounted && (
        <Image
          src={theme === "dark" ? "/Logo_dark.png" : "/Logo_light.png"}
          alt="Logo Los Inmaduros Roller Madrid"
          width={150}
          height={80}
          className="h-17.5 w-auto"
        />
      )}
    </Link>
  );
}
