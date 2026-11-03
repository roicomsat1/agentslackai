import { AuthForm } from "@/components/AuthForm";
import { Logo } from "@/components/Nav";
import { googleEnabled } from "@/auth";
export const metadata = { title: "Login" };
export default function P() { return <div className="min-h-screen grid place-items-center px-5 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,.25),transparent_60%)]"><div className="flex flex-col items-center gap-8 w-full"><Logo /><AuthForm mode="login" google={googleEnabled} /></div></div>; }
