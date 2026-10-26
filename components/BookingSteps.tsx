"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Booking steps, in order. Icons are 24x24 stroke paths. */
const STEPS = [
  { title: "Pick a package", text: "Choose the one that fits your campaign and tap Book.", icon: "M4 7l8-4 8 4-8 4-8-4zm0 0v10l8 4 8-4V7m-8 4v10" },
  { title: "Send the email", text: "It opens ready to go. Add your brand details and hit send.", icon: "M3 7l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" },
  {
    title: "Clarity call",
    text: "A quick call to agree on your goals, brief and timeline, so we're on the same page.",
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  },
  { title: "Make payment", text: "Pay in full, or pay a deposit, before I start creating.", icon: "M3 10h18M7 15h2m-4 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { title: "I create your videos", text: "I make relatable videos around your brand and brief.", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  {
    title: "I post and tag you",
    text: "Your videos go live on X, Instagram, Facebook and TikTok, with your brand tagged.",
    icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
  },
];

/** The step in the middle of the screen is the active one: its icon goes pink, and the thread fills up to it. */
export default function BookingSteps() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <ol>
      {STEPS.map((step, i) => {
        const last = i === STEPS.length - 1;
        const current = i === active;
        return (
          <motion.li
            key={step.title}
            className={`group relative flex gap-5 ${last ? "" : "pb-9"}`}
            // A thin band across the middle of the screen; whichever step crosses it becomes active
            viewport={{ margin: "-45% 0px -50% 0px" }}
            onViewportEnter={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
          >
            {/* Thread down to the next step: a faint track that fills pink once you've scrolled past this step */}
            {!last && (
              <span aria-hidden className="absolute bottom-1 left-6 top-[60px] w-px bg-light-red/15">
                <motion.span
                  className="absolute inset-0 origin-top bg-vivid-pink"
                  initial={false}
                  animate={{ scaleY: i < active ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: "easeInOut" }}
                />
              </span>
            )}
            <span
              className={`flex size-12 shrink-0 items-center justify-center rounded-full border transition duration-300 group-hover:-rotate-6 group-hover:scale-110 ${
                current ? "border-vivid-pink bg-vivid-pink text-white shadow-[0_0_0_6px_rgba(234,4,93,.18)]" : "border-light-red/25 text-light-red"
              }`}
            >
              <svg aria-hidden className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
              </svg>
            </span>
            <div className={`pt-2.5 transition duration-300 group-hover:translate-x-1 ${i <= active ? "opacity-100" : "opacity-40"}`}>
              <h3 className="text-lg font-bold tracking-tight text-white md:text-xl">{step.title}</h3>
              <p className="mt-1.5 max-w-[46ch] leading-relaxed text-light-red/70">{step.text}</p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
