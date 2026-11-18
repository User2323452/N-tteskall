/** Delt hasselnøtt med «kr» — ett merke, lesbart i 32 px. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="#0f6e56"
        d="M30.3 18c-1.2.6-10.6 4.8-14.2 12.4C12.4 37.6 12.2 46.4 16.2 52.2 19.6 57.2 25.2 58.6 30.3 58.6V18z"
      />
      <path
        fill="#0f6e56"
        d="M33.7 18c1.2.6 10.6 4.8 14.2 12.4C51.6 37.6 51.8 46.4 47.8 52.2 44.4 57.2 38.8 58.6 33.7 58.6V18z"
      />
      <path
        fill="#0a5344"
        d="M29.4 17.2c.85-3.1 4.35-3.1 5.2 0-.9 1.3-4.3 1.3-5.2 0z"
      />
      <g fill="#ffffff">
        <g transform="translate(21 45.2) scale(0.0102 -0.0102)">
          <path d="M128 0V1490H428V688H445L811 1118H1158L740 633L1179 0H826L514 456L428 359V0Z" />
        </g>
        <g transform="translate(33.55 45.2) scale(0.0102 -0.0102)">
          <path d="M128 0V1118H418V923H430Q461 1026 533.5 1079.5Q606 1133 700 1133Q751 1133 797 1123V855Q777 861 738.5 865.5Q700 870 667 870Q563 870 495.5 805Q428 740 428 636V0Z" />
        </g>
      </g>
    </svg>
  );
}
