import Link from "next/link";
export default function N() { return <div className="min-h-screen grid place-items-center text-center"><div><h1 className="text-6xl font-bold grad-text">404</h1><p className="text-white/60 mt-2">This page doesn't exist.</p><Link href="/" className="btn btn-primary mt-6">Go home</Link></div></div>; }
