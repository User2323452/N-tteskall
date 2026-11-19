import Image from "next/image";

/** Hasselnøtt med «kr» på hvit bakgrunn. Nøtten og bokstavene er uendret. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={217}
      height={217}
      className={className}
      aria-hidden
      priority
      unoptimized
    />
  );
}
