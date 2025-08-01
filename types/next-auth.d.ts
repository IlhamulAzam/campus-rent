import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      studentId?: string | null;
      department?: string | null;
    };
  }

  interface User {
    studentId?: string | null;
    department?: string | null;
  }
}
