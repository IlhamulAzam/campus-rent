"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000); // Redirect after 3 seconds
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="flex flex-col items-center space-y-6 bg-white rounded-lg shadow-lg p-10 max-w-md">
        <svg
          className="w-20 h-20 text-[rgb(160,12,48)] animate-bounce"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>

        <h1 className="text-3xl font-semibold text-[rgb(160,12,48)]">Thank You!</h1>
        <p className="text-gray-700 text-center">
          Your room has been posted successfully.
          <br />
          Redirecting to homepage...
        </p>
      </div>
    </main>
  );
}
