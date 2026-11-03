"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
export function AuthForm({ mode, google }: { mode: "login" | "signup"; google: boolean }) {
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr(""); setBusy(true);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")), password = String(f.get("password"));
    if (mode === "signup") {
      const r = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: f.get("name"), email, password }) });
      if (!r.ok) { setErr((await r.json()).error || "Sign-up failed"); setBusy(false); return; }
    }
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) { setErr("Invalid email or password."); setBusy(false); return; }
    window.location.href = "/dashboard";
  }
  return <div className="card p-8 w-full max-w-md">
    <h1 className="text-2xl font-bold text-white">{mode === "login" ? "Welcome back" : "Create your free account"}</h1>
    <p className="text-sm text-white/60 mt-1">{mode === "login" ? "Log in to your AI agents." : "50 free credits. No card required."}</p>
    {google && <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="btn btn-ghost w-full mt-6">Continue with Google</button>}
    <form onSubmit={submit} className="mt-6 space-y-3">
      {mode === "signup" && <input name="name" placeholder="Name" className="input" />}
      <input name="email" type="email" required placeholder="Email" className="input" autoComplete="email" />
      <input name="password" type="password" required minLength={8} placeholder="Password (8+ characters)" className="input" autoComplete={mode === "login" ? "current-password" : "new-password"} />
      {err && <p className="text-sm text-rose-400">{err}</p>}
      <button disabled={busy} className="btn btn-primary w-full">{busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}</button>
    </form>
    <p className="text-sm text-white/60 mt-5 text-center">{mode === "login" ? <>New here? <Link className="text-violet-300" href="/signup">Create an account</Link></> : <>Already have an account? <Link className="text-violet-300" href="/login">Log in</Link></>}</p>
  </div>;
}
