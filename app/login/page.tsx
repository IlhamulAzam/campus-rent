"use client";

import { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const ember = "rgb(160, 12, 48)";
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if status is authenticated and session.user exists
    if (status === "authenticated" && session?.user) {
      // Avoid redirect if on the same page to prevent loops
      const currentPath = window.location.pathname;

      if (!session.user.studentId || !session.user.department) {
        if (currentPath !== "/complete-profile") {
          router.push("/complete-profile");
        }
      } else {
        if (currentPath !== "/") {
          router.push("/");
        }
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <p>Loading...</p>
      </main>
    );
  }

  if (session) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: ember }}>
            Welcome, {session.user?.name || session.user?.email}!
          </h2>
          <p className="mb-4">Redirecting...</p>
          <button
            onClick={() => signOut()}
            className="w-full bg-[rgb(160,12,48)] text-white py-3 rounded font-semibold hover:bg-[rgb(130,9,40)] transition"
          >
            Sign Out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <button
          onClick={() => signIn("google")}
          className="w-full bg-[rgb(160,12,48)] text-white py-3 rounded font-semibold hover:bg-[rgb(130,9,40)] transition"
        >
          Sign in with Google
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-[rgb(160,12,48)] hover:underline">
            Sign Up here
          </a>
        </p>
      </div>
    </main>
  );
}
