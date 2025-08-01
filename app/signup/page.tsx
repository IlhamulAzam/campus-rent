"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    department: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (res.status === 409) {
      setSuccessMessage("You already have an account. Redirecting you to the sign-in page...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Something went wrong.");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white border border-[#b91c1c] px-8 py-10 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-[#b91c1c] mb-6">Sign Up</h1>

        {error && <p className="text-[#b91c1c] text-sm mb-4">{error}</p>}
        {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-[#b91c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b91c1c] text-gray-800 placeholder-gray-700"
          />
          <input
            type="text"
            name="studentId"
            placeholder="Student ID"
            value={formData.studentId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-[#b91c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b91c1c] text-gray-800 placeholder-gray-700"
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-[#b91c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b91c1c] text-gray-800 placeholder-gray-700"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-[#b91c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b91c1c] text-gray-800 placeholder-gray-700"
          />

          <button
            type="submit"
            className="w-full bg-[#b91c1c] text-white py-2 rounded-lg hover:bg-[#991b1b] transition duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
