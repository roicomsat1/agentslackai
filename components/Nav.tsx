import Link from "next/link";
export function Logo() {
  return <Link href="/" className="flex items-center gap-2 font-bold text-lg"><span className="grad-bg w-8 h-8 rounded-lg grid place-items-center text-white text-sm">AS</span>AgentSlack <span className="grad-text">AI</span></Link>;
}
export function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[#07060f]/70 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex gap-7 text-sm text-white/70">
          <Link href="/features" className="hover:text-white">Features</Link>
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </nav>
        <div className="flex gap-2 text-sm"><Link href="/login" className="btn btn-ghost !py-2">Log in</Link><Link href="/signup" className="btn btn-primary !py-2">Start free</Link></div>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-6xl mx-auto px-5 py-10 grid md:grid-cols-4 gap-8 text-sm text-white/60">
        <div><Logo /><p className="mt-3">AI agents that create content so you can focus on growing your business.</p></div>
        <div className="flex flex-col gap-2"><b className="text-white">Product</b><Link href="/features">Features</Link><Link href="/pricing">Pricing</Link><Link href="/signup">Get started</Link></div>
        <div className="flex flex-col gap-2"><b className="text-white">Company</b><Link href="/about">About</Link><Link href="/contact">Contact</Link></div>
        <div className="flex flex-col gap-2"><b className="text-white">Legal</b><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
      </div>
      <p className="text-center text-xs text-white/40 pb-8">© {new Date().getFullYear()} AgentSlack AI. All rights reserved.</p>
    </footer>
  );
}
