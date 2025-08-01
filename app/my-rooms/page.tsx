"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Room = {
  id: number;
  title: string;
  location: string;
  price: number;
  walkTime: number;
  photos?: string[];
};

export default function MyRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);

  useEffect(() => {
    async function fetchRooms() {
      const res = await fetch("/api/rooms?my=true");
      const data = await res.json();
      setRooms(data);
      setLoading(false);
    }
    fetchRooms();
  }, []);

  function confirmDelete(id: number) {
    setRoomToDelete(id);
    setShowModal(true);
  }

  async function handleDelete() {
    if (roomToDelete !== null) {
      await fetch(`/api/rooms/${roomToDelete}`, { method: "DELETE" });
      setRooms((prev) => prev.filter((r) => r.id !== roomToDelete));
      setShowModal(false);
      setRoomToDelete(null);
    }
  }

  if (loading) return <p className="p-4">Loading your rooms...</p>;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Rooms</h1>
        {rooms.length === 0 ? (
          <p>You haven’t posted any rooms yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white p-4 rounded-lg shadow">
                {room.photos?.[0] ? (
                  <img
                    src={room.photos[0]}
                    alt={room.title}
                    className="h-40 w-full object-cover rounded mb-3"
                  />
                ) : (
                  <div className="h-40 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <h2 className="text-lg font-semibold">{room.title}</h2>
                <p className="text-gray-600">৳{room.price}/month</p>
                <p className="text-gray-500 text-sm">{room.walkTime} min walk</p>
                <p className="text-gray-500 text-sm">{room.location}</p>
                <div className="flex justify-between mt-3">
                  <Link
                    href={`/rooms/${room.id}`}
                    className="text-[rgb(160,12,48)] hover:underline"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => confirmDelete(room.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 className="text-lg font-semibold mb-4">Delete Room?</h2>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this room?
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded bg-gray-200 text-black hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </main>
  );
}
