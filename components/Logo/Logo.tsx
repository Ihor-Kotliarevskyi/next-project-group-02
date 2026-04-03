import Link from "next/link";
import Image from "next/image";

// type LogoProps = {
//   onClick?: () => void;
// };
// { onClick }: LogoProps
export default function Logo() {
  return (
    <div>
      {/* onClick={onClick} */}
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
