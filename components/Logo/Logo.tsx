import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <div>
      <Link href="/">
        <Image
          src="/company_logo.svg"
          alt="Relax Map logo"
          width={129}
          height={36}
        />
      </Link>
    </div>
  );
}
