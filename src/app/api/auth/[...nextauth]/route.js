import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const { data } = await axios.post(
            `https://lesarjet.camp-coding.site/api/user/login`,
            {
              phone: credentials.phone,
              password: credentials.password,
            }
          );

          // لو تسجيل الدخول نجح
          if (data?.success) {
            const u = data.data.data; // بيانات اليوزر نفسه
            return {
              id: u.user_id,
              name: u.username,
              phone: u.phone,
              role: u.role,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
            };
          }

          return null;
        } catch (error) {
          console.log("Login error:", error?.response?.data);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.phone = user.phone;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.phone = token.phone;
      session.user.role = token.role;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };







