import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

interface GitHubProfile {
  login: string; // GitHub username
  [key: string]: any;
}

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: "repo user" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "defaultsecret",
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "github") {
        const githubUsername = (profile as GitHubProfile).login;
        console.log("🐙 GitHub Username in signIn:", githubUsername);
        (account as any).githubUsername = githubUsername;
      }
      return true;
    },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.githubUsername = (account as any).githubUsername;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      // @ts-ignore
      session.githubUsername = token.githubUsername;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
