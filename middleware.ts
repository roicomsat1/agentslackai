import NextAuth from "next-auth";
const { auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: { authorized: ({ auth }) => !!auth?.user },
});
export default auth;
export const config = { matcher: ["/dashboard/:path*"] };
