import { Nav, Footer } from "@/components/Nav";
export default function L({ children }: { children: React.ReactNode }) { return <><Nav /><main>{children}</main><Footer /></>; }
