"use client";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { btnPink } from "@/lib/styles";

/** Web3Forms access key, from .env.local. It's a public key, made to be used in the browser. */
const ACCESS_KEY = process.env.NEXT_WEB3FORMS_ACCESS_KEY;

type Field = "name" | "email" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type Status = { kind: "idle" | "sending" } | { kind: "success" | "error"; text: string };

const EMPTY: Values = { name: "", email: "", message: "" };
const MAX: Record<Field, number> = { name: 80, email: 254, message: 3000 };
const SUCCESS_SECONDS = 5;

/** Strips markup, invisible control characters and stray whitespace, then caps the length. */
function sanitize(field: Field, value: string) {
  let text = value
    .normalize("NFKC")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    // Keep line breaks and tabs in the message, drop every other control character
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028-\u202E\u2060-\u206F\uFEFF]/g, "");
  text = field === "message" ? text.replace(/\n{3,}/g, "\n\n") : text.replace(/\s+/g, " ");
  if (field === "email") text = text.replace(/\s/g, "").toLowerCase();
  return text.trim().slice(0, MAX[field]);
}

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.length < 2) errors.name = "Please tell me your name.";
  else if (!/^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u.test(values.name)) errors.name = "Names can only have letters, spaces, apostrophes and hyphens.";
  if (!values.email) errors.email = "I need your email to reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) errors.email = "That email doesn't look right.";
  if (values.message.length < 10) errors.message = "Tell me a little more (at least 10 characters).";
  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  // The success message clears itself after a few seconds; errors stay until the visitor acts on them
  useEffect(() => {
    if (status.kind !== "success") return;
    const timer = setTimeout(() => setStatus({ kind: "idle" }), SUCCESS_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [status]);

  const update = (field: Field) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    // Clear a field's error as soon as it's fixed
    if (errors[field] && !validate({ ...values, [field]: sanitize(field, event.target.value) })[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "sending") return;

    // Bots tick the hidden box; pretend it went through and send nothing
    if (new FormData(event.currentTarget).get("botcheck")) {
      setStatus({ kind: "success", text: "Thanks! Your message is on its way." });
      return;
    }

    const clean: Values = { name: sanitize("name", values.name), email: sanitize("email", values.email), message: sanitize("message", values.message) };
    const found = validate(clean);
    setValues(clean);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus({ kind: "error", text: "Please fix the highlighted fields." });
      return;
    }
    if (!ACCESS_KEY) {
      setStatus({ kind: "error", text: "The form isn't set up yet. Please reach me on any of my socials below." });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `New portfolio message from ${clean.name}`,
          from_name: "Portfolio contact form",
          ...clean,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      setValues(EMPTY);
      setStatus({ kind: "success", text: "Thanks! Your message is on its way. I'll get back to you soon." });
    } catch {
      setStatus({ kind: "error", text: "Something went wrong and your message wasn't sent. Please try again or reach me on any of my socials below." });
    }
  }

  const input = (field: Field) =>
    `w-full rounded-2xl border bg-light-red/5 px-5 py-4 text-white outline-none transition placeholder:text-light-red/40 focus:bg-light-red/10 ${
      errors[field] ? "border-red-400" : "border-light-red/20 focus:border-vivid-pink"
    }`;
  const aria = (field: Field) => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });

  return (
    <form onSubmit={submit} noValidate className="mx-auto mt-11 grid max-w-2xl gap-4 text-left md:grid-cols-2">
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div>
        <label htmlFor="name" className="sr-only">Name</label>
        <input id="name" name="name" autoComplete="name" placeholder="Your name" maxLength={MAX.name} value={values.name} onChange={update("name")} className={input("name")} {...aria("name")} />
        <FieldError field="name" errors={errors} />
      </div>

      <div>
        <label htmlFor="email" className="sr-only">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="Your email" maxLength={MAX.email} value={values.email} onChange={update("email")} className={input("email")} {...aria("email")} />
        <FieldError field="email" errors={errors} />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="message" className="sr-only">Message</label>
        <textarea id="message" name="message" rows={5} placeholder="Tell me about your project" maxLength={MAX.message} value={values.message} onChange={update("message")} className={`${input("message")} resize-y`} {...aria("message")} />
        <FieldError field="message" errors={errors} />
      </div>

      <div className="flex flex-col items-center gap-4 md:col-span-2">
        <button type="submit" disabled={status.kind === "sending"} className={`${btnPink} w-full disabled:pointer-events-none disabled:opacity-60 md:w-auto`}>
          {status.kind === "sending" ? "Sending..." : "Send message"}
        </button>
        <p role="status" aria-live="polite" className={`text-center text-[15px] font-medium ${status.kind === "success" ? "text-green-400" : "text-red-400"}`}>
          {(status.kind === "success" || status.kind === "error") && status.text}
        </p>
      </div>
    </form>
  );
}

function FieldError({ field, errors }: { field: Field; errors: Errors }) {
  if (!errors[field]) return null;
  return (
    <p id={`${field}-error`} className="mt-2 px-2 text-sm text-red-400">
      {errors[field]}
    </p>
  );
}
