"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const roomFeatures = ["WiFi", "Attached Bathroom", "Balcony", "IPS/Generator", "Maid Service"];
const departments = ["CSE", "SWE", "EEE", "MPE", "IPE", "Civil", "BTM"];
const roomTypes = ["Single", "Shared"];

export default function PostRoom() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [roomType, setRoomType] = useState(roomTypes[0]);
  const [department, setDepartment] = useState(departments[0]);
  const [features, setFeatures] = useState<string[]>([]);
  const [mapLink, setMapLink] = useState("");
  const [photos, setPhotos] = useState<string[]>([]); // Base64 strings
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  function toggleFeature(feature: string) {
    setFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const base64Photos = await Promise.all(
      files.slice(0, 10).map((file) => convertToBase64(file))
    );
    setPhotos((prev) => [...prev, ...base64Photos].slice(0, 10));
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  }

  function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) {
      alert("You must be logged in to post a room.");
      return;
    }

    setLoading(true);

    try {
      const newRoom = {
        title: `${roomType} Room at ${location}`,
        location,
        price: Number(rent),
        availableFrom,
        roomType,
        department,
        features,
        mapLink,
        photos,
        walkTime: Math.floor(Math.random() * 15) + 1,
      };

      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });

      if (!res.ok) throw new Error("Failed to post room");

      router.push("/post-room/thank-you");
    } catch (err) {
      alert("Error posting room. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return <div className="p-6 max-w-3xl mx-auto">Loading session...</div>;
  }

  if (status === "unauthenticated") {
    return <div className="p-6 max-w-3xl mx-auto">Redirecting to login...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[rgb(160,12,48)] mb-6 text-center">
          Post a Room
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[rgb(160,12,48)] focus:outline-none"
              required
            />
          </div>

          {/* Rent */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium" htmlFor="rent">
              Rent (৳)
            </label>
            <input
              id="rent"
              type="number"
              min={0}
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              placeholder="Enter rent amount"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[rgb(160,12,48)] focus:outline-none"
              required
            />
          </div>

          {/* Available From */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium" htmlFor="availableFrom">
              Available From
            </label>
            <input
              id="availableFrom"
              type="date"
              value={availableFrom}
              onChange={(e) => setAvailableFrom(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[rgb(160,12,48)] focus:outline-none"
              required
            />
          </div>

          {/* Room Type */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium" htmlFor="roomType">
              Room Type
            </label>
            <select
              id="roomType"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[rgb(160,12,48)] focus:outline-none"
            >
              {roomTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium" htmlFor="department">
              Department of Poster
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[rgb(160,12,48)] focus:outline-none"
            >
              {departments.map((dept) => (
                <option key={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Features */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">Features</label>
            <div className="flex flex-wrap gap-3">
              {roomFeatures.map((feature) => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  className={`px-4 py-2 rounded-full border transition ${
                    features.includes(feature)
                      ? "bg-[rgb(160,12,48)] text-white border-[rgb(160,12,48)]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>

          {/* Google Map Link */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium" htmlFor="mapLink">
              Google Map Link
            </label>
            <input
              id="mapLink"
              type="url"
              value={mapLink}
              onChange={(e) => setMapLink(e.target.value)}
              placeholder="Paste Google map link"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[rgb(160,12,48)] focus:outline-none"
              required
            />
          </div>

          {/* Upload Photos */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Upload Photos (max 10)
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="inline-block cursor-pointer bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              Choose Photos
            </label>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={photo}
                    alt={`Uploaded ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[rgb(160,12,48)] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[rgb(130,10,40)] transition disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Room"}
          </button>
        </form>
      </div>
    </main>
  );
}
