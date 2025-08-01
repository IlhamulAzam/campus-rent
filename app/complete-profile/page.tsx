"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

const departments = ["CSE", "SWE", "EEE", "MPE", "IPE", "Civil", "BTM"];

export default function CompleteProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState(departments[0]);
  const [name, setName] = useState(session?.user?.name || "");
  const [preferredContactMode, setPreferredContactMode] = useState("email");
  const [contactInfo, setContactInfo] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/user/complete-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        department,
        name,
        preferredContactMode,
        contactInfo: preferredContactMode === "email" ? null : contactInfo,
        bio,
        image,
      }),
    });

    if (res.ok) {
      // Refresh session so new values show immediately
      await signIn("google", { redirect: false });
      router.push("/profile");
    } else {
      alert("Failed to save profile. Try again.");
    }
  }

  if (!session) return <p className="p-6">Please sign in first.</p>;

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold text-[rgb(160,12,48)] mb-6">
        Complete Your Profile
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        {/* Name */}
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Student ID */}
        <div>
          <label className="block mb-1 font-semibold">Student ID</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Department */}
        <div>
          <label className="block mb-1 font-semibold">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            {departments.map((dept) => (
              <option key={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Preferred Contact Mode */}
        <fieldset>
          <legend className="font-semibold mb-2">Preferred Mode of Contact</legend>
          <label className="mr-4">
            <input
              type="radio"
              name="preferredContactMode"
              value="email"
              checked={preferredContactMode === "email"}
              onChange={(e) => setPreferredContactMode(e.target.value)}
            /> Email
          </label>
          <label className="mr-4">
            <input
              type="radio"
              name="preferredContactMode"
              value="whatsapp"
              checked={preferredContactMode === "whatsapp"}
              onChange={(e) => setPreferredContactMode(e.target.value)}
            /> WhatsApp
          </label>
          <label>
            <input
              type="radio"
              name="preferredContactMode"
              value="messenger"
              checked={preferredContactMode === "messenger"}
              onChange={(e) => setPreferredContactMode(e.target.value)}
            /> Messenger
          </label>
        </fieldset>

        {/* Contact Info */}
        {(preferredContactMode === "whatsapp" || preferredContactMode === "messenger") && (
          <div>
            <label className="block mb-1 font-semibold">
              {preferredContactMode === "whatsapp" ? "WhatsApp Number" : "Messenger ID"}
            </label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        )}

        {/* Bio */}
        <div>
          <label className="block mb-1 font-semibold">Bio (optional)</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Avatar Image URL */}
        <div>
          <label className="block mb-1 font-semibold">Profile Image URL</label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="https://example.com/your-photo.jpg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[rgb(160,12,48)] text-white py-3 rounded font-semibold hover:opacity-90"
        >
          Save Profile
        </button>
      </form>
    </main>
  );
}
