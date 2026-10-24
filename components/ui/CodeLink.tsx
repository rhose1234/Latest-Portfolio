/** A highlighted sign-up code inline in a sentence. With a referral link it opens that link in a new tab. */
export default function CodeLink({ code, href }: { code: string; href?: string }) {
  const look = "rounded-md bg-vivid-pink px-1.5 py-0.5 font-bold tracking-wider text-white";
  if (!href) return <mark className={look}>{code}</mark>;

  return (
    // Sits above the card's own link layer (z-10), so clicking the code never opens the card.
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={`Sign up with code ${code}`}
      className={`${look} relative z-10 inline-flex items-center gap-0.5 transition hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(234,4,93,.45)]`}
    >
      {code}
      <svg aria-hidden className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
      </svg>
    </a>
  );
}
