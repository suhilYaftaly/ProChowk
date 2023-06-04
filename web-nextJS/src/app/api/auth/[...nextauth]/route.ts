import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// import GithubProvider from "next-auth/providers/github";
import { AuthOptions } from "next-auth";
import bcrypt from "bcrypt";

import prisma from "@/src/libs/prismadb";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        email: { label: "Email", type: "text", placeholder: "jsmith" },
      },
      async authorize(cred, req) {
        if (!cred?.email || !cred.password) {
          throw new Error("Please enter an email and password");
        }

        //check to see if user exists
        const user = await prisma.user.findUnique({
          where: { email: cred.email },
        });
        if (!user || !user?.password) throw new Error("No user found");

        //check to see if password matches
        const passMatch = await bcrypt.compare(cred.password, user.password);
        if (!passMatch) throw new Error("Incorrect email or password");

        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async session({ session, token }) {
      // Fetch the user information using the `token` if needed
      const user = await prisma.user.findUnique({ where: { id: token?.sub } });
      if (user) return { ...session, user };
      return session;
    },
  },
} as AuthOptions;

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
