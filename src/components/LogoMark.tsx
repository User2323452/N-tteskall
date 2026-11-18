/** Hasselnøtt med liten krone. Nøtten skal være det man ser i 32 px. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <ellipse cx="32" cy="38.2" rx="17.5" ry="18.6" fill="#7A4A24" />
      <ellipse cx="32" cy="38.2" rx="16.2" ry="17.4" fill="#C6883E" />
      <path
        fill="#A66830"
        d="M33.4 21.2c7.6 1.4 13.4 8.2 14.4 16.4.8 6.6-2 13.4-8 16.8 5-2.4 8.6-8.4 8.4-15.8-.4-9.2-6.8-16.6-14.8-17.4z"
      />
      <ellipse cx="28.2" cy="37" rx="4.2" ry="12.2" fill="#F4DCB0" />
      <ellipse cx="32" cy="53.5" rx="4.2" ry="1.8" fill="#8A562C" />
      <path fill="#0F6E56" d="M23.6 18.8 27.4 9.4 31 18.8z" />
      <path fill="#0F6E56" d="M29 18.8 32 7.4 35 18.8z" />
      <path fill="#0F6E56" d="M33 18.8 36.6 9.4 40.4 18.8z" />
      <path fill="#0F6E56" d="M23.2 17.8h17.6v2.8H23.2z" />
    </svg>
  );
}
