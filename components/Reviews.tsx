"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { GOOGLE_REVIEWS, ME, REVIEWS, type Review } from "@/lib/data";
import { wrap } from "@/lib/styles";

/** The brand tags' paper colours plus crimson, so each client gets their own avatar tone. */
const TONES = ["bg-[#ffc8d4] text-crimson", "bg-[#e6ddff] text-crimson", "bg-crimson text-light-red"];

/** Words lifted straight from the reviews, floating around the phone on wide screens. Tilt is in degrees and matches the spot's rotate class. */
const PRAISE = [
  { text: "Smooth, professional and on point", from: "Adaobi Iloduba", spot: "left-0 top-[6%] -rotate-6", tilt: -6 },
  { text: "Skilled and reliable", from: "Olatunbosun Adebola", spot: "left-[6%] top-[42%] rotate-3", tilt: 3 },
  { text: "So lovely to work with", from: "Amaka Mercy", spot: "bottom-[10%] left-0 -rotate-3", tilt: -3 },
  { text: "Highest standard and with precision", from: "Victor Opara", spot: "right-0 top-[16%] rotate-6", tilt: 6 },
  { text: "A 5* personal website", from: "Ayodeji Akiwowo", spot: "bottom-[22%] right-[4%] -rotate-6", tilt: -6 },
];

/** Quick replies a visitor can tap once the reviews are in. I answer each with a way to get started. */
const REPLIES = [
  { ask: "I need a website", answer: "Love that! Tell me about your business and I'll get back to you.", cta: { label: "Send me a message", href: "#contact" } },
  { ask: "I need UGC videos", answer: "Yes! Here are my packages and how booking works.", cta: { label: "See my UGC rate card", href: "/rate-card" } },
  { ask: "Can we hop on a call?", answer: "Of course! Pick a time that works for you.", cta: { label: "Book a call", href: ME.calendly } },
];

type Reply = (typeof REPLIES)[number];
type ChatLine = { from: "you"; text: string } | { from: "me"; reply: Reply };

/** How long the "typing" dots show before each message lands, in ms. */
const TYPING_MS = 1100;

const rated = REVIEWS.filter((review) => review.rating);
const average = rated.length ? (rated.reduce((sum, review) => sum + (review.rating ?? 0), 0) / rated.length).toFixed(1) : null;

/** Every review as a client's message, then my line at the end. */
const MESSAGES = REVIEWS.length + 1;

export default function Reviews() {
  const reduce = useReducedMotion();
  const phone = useRef<HTMLDivElement>(null);
  const thread = useRef<HTMLUListElement>(null);
  const inView = useInView(phone, { once: true, margin: "-150px" });
  // How many messages have arrived so far; they come in one at a time once the phone scrolls into view
  const [shown, setShown] = useState(0);
  const introDone = shown >= MESSAGES;
  // What the visitor has asked through the quick replies, and my answers
  const [chat, setChat] = useState<ChatLine[]>([]);
  const [replying, setReplying] = useState(false);
  const [loved, setLoved] = useState<string[]>([]);
  const [flash, setFlash] = useState<string | null>(null);
  const typing = (inView && !introDone) || replying;

  useEffect(() => {
    if (!inView) return;
    if (introDone) return;
    const timer = setTimeout(() => setShown((n) => n + 1), TYPING_MS);
    return () => clearTimeout(timer);
  }, [inView, reduce, shown, introDone]);

  // Keep the newest message in view inside the phone, like a real chat
  useEffect(() => {
    thread.current?.scrollTo({ top: thread.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [shown, chat.length, replying, reduce]);

  // A clicked sticker scrolls its review into view and lights it up for a moment
  useEffect(() => {
    if (!flash || !thread.current) return;
    const message = thread.current.querySelector<HTMLElement>(`[data-review="${flash}"]`);
    if (message) thread.current.scrollTo({ top: message.offsetTop - 16, behavior: reduce ? "auto" : "smooth" });
    const timer = setTimeout(() => setFlash(null), 1800);
    return () => clearTimeout(timer);
  }, [flash, reduce]);

  const ask = (reply: Reply) => {
    if (replying) return;
    setChat((lines) => [...lines, { from: "you", text: reply.ask }]);
    setReplying(true);
    setTimeout(() => {
      setChat((lines) => [...lines, { from: "me", reply }]);
      setReplying(false);
    }, TYPING_MS);
  };

  const spotlight = (name: string) => {
    setShown(MESSAGES);
    setFlash(name);
  };

  const toggleLove = (name: string) => setLoved((names) => (names.includes(name) ? names.filter((n) => n !== name) : [...names, name]));

  const asked = chat.flatMap((line) => (line.from === "you" ? [line.text] : []));
  const options = REPLIES.filter((reply) => !asked.includes(reply.ask));

  return (
    <section id="reviews" className="py-12 md:py-16">
      <div className={wrap}>
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[clamp(26px,7vw,40px)] font-extrabold leading-[.95] tracking-tighter md:text-[clamp(32px,5vw,72px)]">Reviews</h2>
            <a
              href={GOOGLE_REVIEWS}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex shrink-0 items-center gap-1 pb-1 text-[15px] font-semibold underline decoration-2 underline-offset-4 transition hover:text-vivid-pink md:text-lg"
            >
              {average ? (
                <>
                  <span aria-hidden className="text-gold">★</span>
                  {average} on Google
                </>
              ) : (
                "More on Google"
              )}
              <svg aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-normal md:text-[17px]">
            Read honest reviews from previously served clients.
          </p>
        </Reveal>

        <div className="relative mt-12 lg:py-6">
          {PRAISE.map((praise, i) => {
            const order = REVIEWS.findIndex((review) => review.name === praise.from);
            const arrived = order < shown;
            // Lit while its review is the newest message, or after it's been tapped
            const lit = flash === praise.from || (!introDone && order === shown - 1);
            return (
              <span key={praise.text} className={`absolute z-10 hidden lg:block ${praise.spot}`}>
                {/* Bobs on its own beat */}
                <span className="block animate-float" style={{ animationDelay: `${i * -1.1}s` }}>
                  {/* Pops in when its review arrives in the chat. Drag it around and it springs back; tap it to jump to the review. */}
                  <motion.button
                    type="button"
                    onTap={() => spotlight(praise.from)}
                    aria-label={`Show ${praise.from}'s review`}
                    initial={false}
                    animate={arrived ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18 }}
                    whileHover={{ scale: 1.08, rotate: praise.tilt * -1 }}
                    whileTap={{ scale: 0.95 }}
                    drag
                    dragSnapToOrigin
                    dragElastic={0.5}
                    whileDrag={{ scale: 1.12, cursor: "grabbing" }}
                    className={`flex cursor-grab touch-none select-none items-center gap-2 rounded-full border-2 bg-white px-5 py-2.5 text-[15px] font-semibold shadow-[0_12px_30px_rgba(30,1,7,.1)] transition-[border-color,box-shadow] duration-300 ${
                      lit ? "border-vivid-pink shadow-[0_16px_36px_rgba(234,4,93,.25)]" : "border-transparent"
                    } ${arrived ? "" : "pointer-events-none"}`}
                  >
                    <span className="text-gold">★</span>
                    &ldquo;{praise.text}&rdquo;
                  </motion.button>
                </span>
              </span>
            );
          })}

          <Reveal className="mx-auto w-full max-w-[400px]">
            <div ref={phone} className="relative overflow-hidden rounded-[44px] border-[10px] border-crimson bg-white shadow-[0_30px_60px_rgba(30,1,7,.2)]">
              {/* The phone's notch */}
              <span aria-hidden className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-crimson" />

              <div className="flex items-center gap-3 border-b border-crimson/10 px-5 pb-3.5 pt-9">
                <span aria-hidden className="flex -space-x-2.5">
                  {REVIEWS.slice(0, 3).map((review, i) => (
                    <Avatar key={review.name} review={review} index={i} className="size-9 text-[11px] ring-2 ring-white" />
                  ))}
                </span>
                <div className="min-w-0">
                  <p className="font-bold leading-tight">Happy clients</p>
                  <p className="truncate text-xs text-crimson/60">
                    {REVIEWS.length} reviews
                    {average && (
                      <>
                        {" "}· <span className="text-gold">★</span> {average} on Google
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Messages that haven't arrived yet are still in the page, just hidden, so search engines can read every review */}
              <ul
                ref={thread}
                aria-label="Client reviews"
                aria-live="polite"
                className="scrollbar-hide relative h-[440px] space-y-5 overflow-y-auto bg-[#fff6f5] bg-[radial-gradient(rgba(12,0,3,.06)_1px,transparent_1px)] px-4 py-5 [background-size:18px_18px] md:h-[480px]"
              >
                {REVIEWS.map((review, i) =>
                  i < shown ? (
                    <Arrive key={review.name} data-review={review.name}>
                      <ClientMessage
                        review={review}
                        index={i}
                        loved={loved.includes(review.name)}
                        flashing={flash === review.name}
                        onLove={() => toggleLove(review.name)}
                      />
                    </Arrive>
                  ) : (
                    <li key={review.name} hidden>
                      <ClientMessage review={review} index={i} loved={false} flashing={false} onLove={() => {}} />
                    </li>
                  ),
                )}
                {shown > REVIEWS.length && (
                  <Arrive>
                    <MyMessage>Your project could be next.</MyMessage>
                  </Arrive>
                )}
                {chat.map((line, i) =>
                  line.from === "you" ? (
                    <Arrive key={i} yours>
                      <p className="rounded-[20px] rounded-br-md bg-crimson px-4 py-3 text-[15px] leading-relaxed text-light-red">{line.text}</p>
                    </Arrive>
                  ) : (
                    <Arrive key={i}>
                      <MyMessage>
                        {line.reply.answer}
                        <a
                          href={line.reply.cta.href}
                          {...(line.reply.cta.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="group mt-3 flex items-center justify-between gap-2 rounded-xl bg-white px-3.5 py-2.5 text-sm font-semibold text-crimson transition hover:bg-light-red"
                        >
                          {line.reply.cta.label}
                          <svg aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </a>
                      </MyMessage>
                    </Arrive>
                  ),
                )}
                {typing && <Typing mine={replying || shown === REVIEWS.length} />}
              </ul>

              {/* Quick replies show up once the reviews are all in */}
              <div className="border-t border-crimson/10 bg-white">
                <AnimatePresence initial={false}>
                  {introDone && options.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-3 pt-3">
                        {options.map((reply) => (
                          <button
                            key={reply.ask}
                            type="button"
                            onClick={() => ask(reply)}
                            disabled={replying}
                            className="shrink-0 rounded-full border-2 border-vivid-pink px-3.5 py-1.5 text-sm font-semibold text-vivid-pink transition hover:bg-vivid-pink hover:text-white active:scale-95 disabled:opacity-50"
                          >
                            {reply.ask}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <a
                  href="#contact"
                  className="group m-3 flex items-center gap-3 rounded-full border border-crimson/15 bg-white py-2 pl-5 pr-2 text-sm text-crimson/50 transition hover:border-vivid-pink"
                >
                  <span className="flex-1">Start your project with me…</span>
                  <span className="flex size-9 items-center justify-center rounded-full bg-vivid-pink text-white transition group-hover:scale-110">
                    <svg aria-hidden className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** A message popping into the thread, or fading in with reduced motion. The visitor's own messages sit on the right. */
function Arrive({ children, yours = false, ...rest }: { children: ReactNode; yours?: boolean; "data-review"?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      {...rest}
      className={yours ? "ml-auto w-fit max-w-[80%]" : ""}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      style={{ transformOrigin: yours ? "100% 100%" : "0% 100%" }}
    >
      {children}
    </motion.li>
  );
}

type ClientMessageProps = { review: Review; index: number; loved: boolean; flashing: boolean; onLove: () => void };

/** One review as a chat message: avatar, the quote in a bubble with a heart to tap, then who said it. */
function ClientMessage({ review, index, loved, flashing, onLove }: ClientMessageProps) {
  const about = [review.company, review.service].filter(Boolean).join(" · ");
  return (
    <div className="flex items-end gap-2.5">
      <Avatar review={review} index={index} className="mb-6 size-8 text-[11px]" />
      <div className="min-w-0 max-w-[85%]">
        <div className="relative">
          <blockquote
            className={`space-y-2 rounded-[20px] rounded-bl-md border bg-white px-4 py-3 text-[15px] leading-relaxed shadow-[0_4px_14px_rgba(30,1,7,.05)] transition duration-500 ${
              flashing ? "border-vivid-pink ring-4 ring-vivid-pink/20" : "border-crimson/10"
            }`}
          >
            {review.quote.split("\n\n").map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </blockquote>
          <button
            type="button"
            onClick={onLove}
            aria-pressed={loved}
            aria-label={loved ? `Unlike ${review.name}'s review` : `Love ${review.name}'s review`}
            className={`absolute -bottom-3 -right-2 flex size-7 items-center justify-center rounded-full border shadow-sm transition active:scale-90 ${
              loved ? "border-vivid-pink bg-vivid-pink text-white" : "border-crimson/10 bg-white text-crimson/40 hover:text-vivid-pink"
            }`}
          >
            <motion.svg
              key={String(loved)}
              aria-hidden
              className="size-3.5"
              viewBox="0 0 24 24"
              fill={loved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2.2}
              initial={{ scale: loved ? 0.4 : 1 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 12 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </motion.svg>
          </button>
        </div>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 px-1 text-xs text-crimson/60">
          <span className="font-bold text-crimson">{review.name}</span>
          {about && <span>· {about}</span>}
          {review.rating && (
            <span role="img" aria-label={`${review.rating} out of 5 stars`} className="tracking-wider text-gold">
              {"★".repeat(review.rating)}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

/** A message from me: my photo, then a pink bubble. */
function MyMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-end gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hero.jpg" alt="" className="mb-6 size-8 shrink-0 rounded-full object-cover object-top" />
      <div className="min-w-0 max-w-[85%]">
        <div className="rounded-[20px] rounded-bl-md bg-vivid-pink px-4 py-3 text-[15px] font-medium leading-relaxed text-white">{children}</div>
        <p className="mt-1.5 px-1 text-xs font-bold text-crimson">{ME.name}</p>
      </div>
    </div>
  );
}

/** The three bouncing dots someone shows while typing. Mine are pink. */
function Typing({ mine }: { mine: boolean }) {
  return (
    <li aria-hidden className={`ml-10 flex w-fit gap-1 rounded-[20px] rounded-bl-md px-4 py-3.5 ${mine ? "bg-vivid-pink" : "border border-crimson/10 bg-white"}`}>
      {[0, 1, 2].map((dot) => (
        <span key={dot} className={`size-2 animate-bounce rounded-full ${mine ? "bg-white/80" : "bg-crimson/40"}`} style={{ animationDelay: `${dot * 0.15}s` }} />
      ))}
    </li>
  );
}

function Avatar({ review, index, className }: { review: Review; index: number; className: string }) {
  return (
    <span aria-hidden className={`flex shrink-0 items-center justify-center rounded-full font-extrabold ${TONES[index % TONES.length]} ${className}`}>
      {initials(review.name)}
    </span>
  );
}

/** "Adaobi Iloduba" -> "AI" */
function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
