"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

type Room = {
  id: number;
  title: string;
  location: string;
  price: number;
  walkTime: number;
  photos?: string[];
};

export default function Home() {
  const ember = "rgb(160, 12, 48)";
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [searchLocation, setSearchLocation] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [maxWalkTime, setMaxWalkTime] = useState("");

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [typedText, setTypedText] = useState("");
  const fullText = "Find affordable rooms through your peers";

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/rooms");
      if (!res.ok) throw new Error("Failed to fetch rooms");
      const data = await res.json();
      setRooms(data || []);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [pathname]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  
    return () => clearInterval(interval);
  }, []);
  

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  const filteredRooms = rooms.filter((room) => {
    return (
      room.location.toLowerCase().includes(searchLocation.toLowerCase()) &&
      (maxRent === "" || room.price <= parseInt(maxRent)) &&
      (maxWalkTime === "" || room.walkTime <= parseInt(maxWalkTime))
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 relative">
      {/* HERO SECTION */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Local Video Background */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          src="/videos/IUT.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white text-center px-4 z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Rent Near IUT</h1>
          <p className="text-lg md:text-xl mb-6">{typedText}</p>
          <Link href="#listings">
            <button className="px-6 py-3 bg-white text-black rounded-full font-semibold shadow hover:scale-105 transition">
              Browse Listings
            </button>
          </Link>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="absolute top-0 left-0 w-full flex flex-col md:flex-row justify-between items-center p-4 bg-white/80 backdrop-blur-md z-30 shadow-md space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold" style={{ color: ember }}>
          Rent Near IUT
        </h1>

        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-full shadow-md px-2 py-1 max-w-2xl w-full">
          <div className="flex-1 px-4 py-2 hover:bg-gray-100 rounded-full">
            <input
              type="text"
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex-1 px-4 py-2 hover:bg-gray-100 rounded-full">
            <input
              type="number"
              placeholder="Max Rent (৳)"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex-1 px-4 py-2 hover:bg-gray-100 rounded-full">
            <input
              type="number"
              placeholder="Max Walk Time (min)"
              value={maxWalkTime}
              onChange={(e) => setMaxWalkTime(e.target.value)}
              className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
          <div className="ml-2 bg-[rgb(160,12,48)] text-white p-2 rounded-full cursor-pointer">
            🔍
          </div>
        </div>

        {/* Post + Avatar */}
        <div className="flex items-center gap-4 relative" ref={userMenuRef}>
          <button
            onClick={() => router.push("/post-room")}
            className="px-4 py-2 bg-[rgb(160,12,48)] text-white rounded-full font-medium hover:bg-[rgb(130,9,40)] transition"
          >
            Post a Room
          </button>

          <div
            className="flex items-center gap-2 cursor-pointer relative"
            onClick={() => {
              if (!session) router.push("/login");
              else setUserMenuOpen(!userMenuOpen);
            }}
          >
            <Image
              src={session?.user?.image || "/default-avatar.png"}
              alt="Avatar"
              width={40}
              height={40}
              className="rounded-full border-2 border-gray-300 hover:border-[rgb(160,12,48)] transition cursor-pointer"
            />
            <span className="font-medium text-gray-700">
              {session ? session.user?.name?.split(" ")[0] : "Sign In"}
            </span>

            {userMenuOpen && session && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
                <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <Link href="/my-rooms" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  My Rooms
                </Link>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    signOut();
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* LISTINGS */}
      <section id="listings" className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-semibold mb-6">Listings</h3>

        {loading ? (
          <p className="text-gray-600">Loading rooms...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : filteredRooms.length === 0 ? (
          <p className="text-gray-600">No rooms match your search.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredRooms.map((room) => (
              <div key={room.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
                {room.photos && room.photos.length > 0 ? (
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
                <h4 className="text-lg font-semibold">{room.title}</h4>
                <p className="text-gray-600">৳{room.price}/month</p>
                <p className="text-gray-500 text-sm">{room.walkTime} min walk</p>
                <p className="text-gray-500 text-sm">{room.location}</p>
                <Link href={`/rooms/${room.id}`}>
                  <span className="mt-2 text-[rgb(160,12,48)] hover:underline cursor-pointer block">
                    View Details
                  </span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
