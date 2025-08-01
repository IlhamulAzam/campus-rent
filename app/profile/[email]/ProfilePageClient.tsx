"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserData = {
  name: string | null;
  email: string;
  studentId: string | null;
  department: string | null;
  preferredContactMode: string | null;
  contactInfo: string | null;
  bio: string | null;
  image: string | null;
};

interface ProfilePageClientProps {
  email: string;
}

export default function ProfilePageClient({ email }: ProfilePageClientProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const resSession = await fetch("/api/auth/session");
      const sessionData = await resSession.json();

      if (!sessionData?.user) {
        router.push("/login");
        return;
      }

      try {
        const decodedEmail = decodeURIComponent(email);
        const res = await fetch(`/api/user?email=${encodeURIComponent(decodedEmail)}`);

        if (!res.ok) {
          throw new Error("User not found");
        }

        const data = await res.json();
        setUserData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [email, router]);

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-8 space-y-4">
        <h1 className="text-3xl font-bold text-red-900">{userData?.name || "Student Name"}</h1>




          {userData?.bio && (
            <p className="text-base text-gray-800">{userData.bio}</p>
          )}

          <div className="space-y-2 text-base text-gray-900">
            <p><span className="font-semibold">Student ID:</span> {userData?.studentId || "N/A"}</p>
            <p><span className="font-semibold">Department:</span> {userData?.department || "N/A"}</p>
            <p><span className="font-semibold">Email:</span> {userData?.email}</p>
            {userData?.preferredContactMode && (
              <p><span className="font-semibold">Preferred Contact:</span> {userData.preferredContactMode}</p>
            )}
            {(userData?.preferredContactMode === "whatsapp" ||
              userData?.preferredContactMode === "messenger") && (
                <p><span className="font-semibold">Contact Info:</span> {userData.contactInfo || "N/A"}</p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 bg-green-100 relative flex items-center justify-center p-8">
          {userData?.image && (
            <img
              src={userData.image}
              alt="User Avatar"
              className="w-40 h-40 rounded-full object-cover shadow-lg border border-white"
              loading="eager"
              decoding="async"
             
            />
          )}
        </div>
      </div>
    </main>
  );
}
