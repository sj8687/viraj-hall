// import { loginSchema } from "@repo/zod";
// import bcrypt from "bcryptjs";
// import NextAuth, { AuthError, type NextAuthConfig } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
// import axios from "axios";
// import { toast } from "react-toastify";

// //  Admin credentials
// const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
// const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!;

// // declare module "next-auth" {
// //   interface Session {
// //     user: {
// //       name?: string | null;
// //       email?: string | null;
// //       image?: string | null;
// //       isAdmin?: boolean;
// //     };
// //   }
// //   interface User {
// //     isAdmin?: boolean;
// //   }
// // }


// declare module "next-auth" {
//   interface User {
//     role?: string;
//   }

//   interface Session {
//     user?: {
//       id?: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//       role?: string;
//     };
//   }

//   interface JWT {
//     role?: string;
//   }
// }

// const config: NextAuthConfig = {
//   providers: [
//     Google({
//       clientId: process.env.AUTH_GOOGLE_ID!,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET!,
//     }),
//     Credentials({
//       credentials: { email: {}, password: {} },
//       authorize: async (credentials) => {
//         const email = credentials?.email as string;
//         const password = credentials?.password as string;

//         //  Special case for admin login
//         if (email === ADMIN_EMAIL) {
//           const isAdmin = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
//           if (!isAdmin) {
//             throw new Error("Invalid admin password");
//           }
//           return {
//             id: "0",
//             name: "Shreyash Jadhav",
//             email: ADMIN_EMAIL,
//             isAdmin: true,
//           };
//         }


//         const validInput = loginSchema.safeParse({ email, password });
//         if (!validInput.success) {
//           throw new Error(validInput.error.errors[0]?.message ?? "Invalid input");
//         }

//         // Call  
//         try {
//           const response = await axios.post(
//             `${process.env.NEXT_PUBLIC_Backend_URL}/login/validate`,
//             { email, password },
//           );
//           console.log("Backend response:", response.data);
//           return response.data.user;
//         } catch (err: any) {
//           if (err.response?.status === 429) {
//             toast.error('Too many requests. Please wait.');
//           } else {
//             console.error("Backend error:", err.response?.data || err.message);
//             throw new Error(err.response?.data?.message || "Login failed");
//           }

//         }
//       },
//     }),
//   ],

//   pages: {
//     signIn: "/login",
//   },



//   callbacks: {
//     async signIn({ user, account }) {
//       if (account?.provider === "google") {
//         const { email, id, name, image } = user;
//         if (!email) throw new AuthError("Google login error: missing email");

//         try {
//           await axios.post(`${process.env.NEXT_PUBLIC_Backend_URL}/login/google`, {
//             email,
//             name,
//             image,
//             googleId: id?.toString(),
//           });
//         } catch (err) {
//           console.log(err);

//         }
//       }
//       return true;
//     },

//     //  admin logic in session callback
//     // async session({ session }) {
//     //   if (session?.user?.email) {
//     //     session.user.isAdmin = session.user.email === ADMIN_EMAIL;
//     //   }
//     //   return session;
//     // },


//      async session({ token, session }) {
//       if (token.role && session.user) {
//         session.user.role = token.role as string;
//       }
//       if (token.id && session.user) {
//         session.user.id = token.id.toString();
//       }
//       return session;
//     },
//     async jwt({ token }) {
//       const existing_user = await axios.post(
//         `${process.env.NEXT_PUBLIC_Backend_URL}/verify/user`,
//         { email: token.email, customeData: "select only id and role" },
//       );
//       if (!existing_user) return token;

//       token.role = existing_user?.data?.role;
//       token.id = existing_user?.data?.id;
//       return token;
//     },
//   },

//   // custome cookie for my error in be req.cookie is null cheking this work orr noy 

//   useSecureCookies: process.env.NODE_ENV === "development" ? false : true,
//   cookies: {
//     sessionToken: {
//       name:
//         process.env.NODE_ENV === "development"
//           ? "authjs.session-token"
//           : "__Secure-authjs.session-token",
//       options: {
//         httpOnly: true,
//         sameSite: process.env.NODE_ENV === "development" ? "lax" : "lax",
//         path: "/",
//         secure: process.env.NODE_ENV === "development" ? false : true,
//         domain:
//           process.env.NODE_ENV === "development"
//             ? undefined
//             : ".viraj-multipurpose-hall.vercel.app",
//       },
//     },
//   },
// };

// const nextAuth = NextAuth(config);

// export const handlers = nextAuth.handlers;
// export const signIn: typeof nextAuth.signIn = nextAuth.signIn;
// export const signOut: typeof nextAuth.signOut = nextAuth.signOut;
// export const auth: typeof nextAuth.auth = nextAuth.auth;
















import { loginSchema } from "@repo/zod";
import axios from "axios";
import bcrypt from "bcryptjs";
import NextAuth, { CredentialsSignin, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";



declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }

  interface JWT {
    role?: string;
  }
}


const config: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),

    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {

        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password)
          throw new CredentialsSignin("provide both email password", {
            cause: "both required email and password",
          });

        const validInput = loginSchema.safeParse({ email, password });
        if (!validInput.success) {
          throw new CredentialsSignin(validInput.error.errors[0]?.message, {
            cause: validInput.error.errors[0]?.message + "....",
          });
        }

        const user = await axios.post(
          `${process.env.NEXT_PUBLIC_Backend_URL}/login/validate`,
          { email,password },
        );

        if (!user) {
          throw new CredentialsSignin("Invalid credentials.", {
            cause: "invalid credential",
          });
        }
        const validPassword = await bcrypt.compare(
          password!,
          user?.data?.password!,
        );
        if (!validPassword) {
          throw new CredentialsSignin("Invalid password.", {
            cause: "invalid credential",
          });
        }

        return {
          id: user?.data?.id.toString(),
          name: user?.data?.name,
          email: user?.data?.email.toString(),
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn: async ({ user, account, email, profile }) => {
      if (account?.provider === "google") {
        // try {
        const { email, id, name, image } = user;

        if (!email) {
          throw new Error("Invalid email");
        }
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_Backend_URL}/login/google`,
          { email, id, name, image },
        );
        if (res.status === 200) {
          return true;
        } else {
          return false;
        }

      }
      return true; // i got error remember always allow non google git oauth providers also
      // if set both false no google work or last for credential it also not work
    },
    async session({ token, session }) {
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }
      if (token.id && session.user) {
        session.user.id = token.id.toString();
      }
      return session;
    },
    async jwt({ token }) {
      const existing_user = await axios.post(
        `${process.env.NEXT_PUBLIC_Backend_URL}/login/validate`,
        { email: token.email, customeData: "select only id and role" },
      );
      if (!existing_user) return token;

      token.role = existing_user?.data?.role;
      token.id = existing_user?.data?.id;
      return token;
    },
  },

  // custome cookie for my error in be req.cookie is null cheking this work orr noy 

  useSecureCookies: process.env.NODE_ENV === "development" ? false : true,
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "development"
          ? "authjs.session-token"
          : "__Secure-authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        path: "/",
        secure: process.env.NODE_ENV === "development" ? false : true,
        domain:
          process.env.NODE_ENV === "development"
            ? undefined
            : ".viraj-multipurpose-hall.vercel.app",
      },
    },
  },
};

const nextAuth = NextAuth(config);

export const handlers = nextAuth.handlers;
export const signIn: typeof nextAuth.signIn = nextAuth.signIn;
export const signOut: typeof nextAuth.signOut = nextAuth.signOut;
export const auth: typeof nextAuth.auth = nextAuth.auth;