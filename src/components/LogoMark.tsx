import Image from "next/image";

/** Oscars merke: brun hasselnøtt med «kr» på hvit bakgrunn. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/mark.png"
      alt=""
      width={440}
      height={412}
      priority
      unoptimized
      className={className ?? "h-9 w-9 object-contain"}
    />
  );
}
