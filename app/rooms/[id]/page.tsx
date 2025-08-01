'use client';

import { notFound, useParams } from "next/navigation";
import { useState, useEffect } from "react";

type User = {
  name: string | null;
  email: string;
  studentId: string | null;
  department: string | null;
  preferredContactMode: string | null;
  contactInfo: string | null;
  bio: string | null;
};

type Room = {
  id: number;
  title: string;
  location: string;
  price: number;
  walkTime: number;
  availableFrom?: string;
  roomType?: string;
  department?: string;
  features?: string[] | string;
  photos?: string[];
  mapLink?: string;
  description?: string;
  user: User;
};

export default function RoomDetails() {
  const params = useParams();
  const id = params?.id;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRoom = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/rooms/${id}`, { cache: "no-store" });

      if (!res.ok) {
        notFound();
        return;
      }

      const fetchedRoom: Room = await res.json();

      if (fetchedRoom.features && typeof fetchedRoom.features === "string") {
        fetchedRoom.features = JSON.parse(fetchedRoom.features);
      }

      setRoom(fetchedRoom);
    };

    fetchRoom();
  }, [id]);

  if (!room) return <div className="p-4">Loading...</div>;

  const photos = room.photos || [];

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      {/* Title and location */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{room.title}</h1>
        <p className="text-lg text-gray-800">{room.location}</p>
      </div>

      {/* Photos Grid */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 rounded-xl overflow-hidden">
          {photos.length === 1 ? (
            <img
              src={photos[0]}
              alt={room.title}
              className="w-full h-[500px] object-cover col-span-4 cursor-pointer"
              onClick={() => setSelectedImage(photos[0])}
            />
          ) : (
            <>
              {photos[0] && (
                <img
                  src={photos[0]}
                  alt={`${room.title} main`}
                  className="w-full h-[500px] object-cover sm:col-span-2 lg:col-span-2 row-span-2 cursor-pointer"
                  onClick={() => setSelectedImage(photos[0])}
                />
              )}
              {photos.slice(1, 5).map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`${room.title} ${idx + 2}`}
                  className="w-full h-[250px] object-cover cursor-pointer"
                  onClick={() => setSelectedImage(photo)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Full view" className="max-w-full max-h-full" />
        </div>
      )}

      {/* Details and hoverboard */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side: details */}
        <div className="lg:col-span-2 space-y-6">
          {room.description && (
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Description</h3>
              <p className="text-gray-700">{room.description}</p>
            </div>
          )}

          {room.features && Array.isArray(room.features) && room.features.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Features</h3>
              <div className="flex flex-wrap gap-2">
                {room.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-900"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {room.mapLink && (
            <div>
              <a
                href={room.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgb(160,12,48)] underline font-medium"
              >
                View on Google Maps
              </a>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Posted by</h3>
            <p className="text-gray-900">{room.user.name || "Unknown User"}</p>
            <p className="text-sm text-gray-800 mb-4">{room.user.email}</p>

            <a
              href={`/profile/${encodeURIComponent(room.user.email)}`}
              className="inline-block bg-white text-[rgb(160,12,48)] border border-[rgb(160,12,48)] px-6 py-3 rounded-lg font-semibold hover:bg-[rgb(160,12,48)] hover:text-white transition"
            >
              Contact Owner
            </a>
          </div>
        </div>

        <div className="w-full max-w-sm lg:w-80 sticky top-24 self-start bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <p className="text-3xl font-bold text-[rgb(160,12,48)]">৳{room.price}</p>
            <p className="text-gray-900">per month</p>
          </div>

          {room.availableFrom && (
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-1 text-gray-900">Available From</h3>
              <p className="text-gray-900">{new Date(room.availableFrom).toLocaleDateString()}</p>
            </div>
          )}

          {room.walkTime !== undefined && (
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-1 text-gray-900">Walk Time</h3>
              <p className="text-gray-900">{room.walkTime} minutes</p>
            </div>
          )}

          {room.roomType && (
            <div>
              <h3 className="font-semibold text-lg mb-1 text-gray-900">Room Type</h3>
              <p className="text-gray-900">{room.roomType}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
