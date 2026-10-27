"use client";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "./actions";

export default function LoginForm() {
  const [state, action] = useFormState(login, null);
  return (
    <form action={action} className="mt-8 w-full max-w-sm space-y-4">
      <label htmlFor="password" className="block text-sm font-semibold">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className="w-full rounded-xl border border-crimson/20 bg-white px-4 py-3 outline-none transition focus:border-vivid-pink"
      />
      <SubmitButton />
      {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full rounded-full bg-crimson px-6 py-3 font-semibold text-light-red transition hover:bg-vivid-pink hover:text-white disabled:opacity-60">
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}
