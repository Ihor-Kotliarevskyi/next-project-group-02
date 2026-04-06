"use client";

import Link from "next/link";
import Image from "next/image";

export default function Logout() {
  return (
    <div>
      <Link href="/logout-confirm">
        <Image src="/logout.svg" alt="Exit" width={24} height={24} />
      </Link>
    </div>
  );
}
