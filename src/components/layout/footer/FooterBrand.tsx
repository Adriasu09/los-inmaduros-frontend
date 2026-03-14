import Image from "next/image";
import Link from "next/link";

export default function FooterBrand() {
  return (
    <Link href="/">
      <Image
        src="/Logo_dark.png"
        alt="Logo Los Inmaduros Roller Madrid"
        width={150}
        height={80}
        className="h-17.5 w-auto hidden dark:block"
      />
      <Image
        src="/Logo_light.png"
        alt="Logo Los Inmaduros Roller Madrid"
        width={150}
        height={80}
        className="h-17.5 w-auto block dark:hidden"
      />
    </Link>
  );
}
