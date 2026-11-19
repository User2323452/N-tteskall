import Image from "next/image";

/** Oscars merke: brun hasselnøtt med «kr», uten flis. Nøtten er ikke tegnet på nytt. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/mark.png?v=6"
      alt=""
      width={200}
      height={199}
      priority
      unoptimized
      className={className ?? "h-9 w-9 object-contain"}
    />
  );
}
