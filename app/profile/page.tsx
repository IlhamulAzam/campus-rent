"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";

type UserProfile = {
  name: string | null;
  email: string;
  studentId: string | null;
  department: string | null;
  preferredContactMode: string | null;
  contactInfo: string | null;
  bio: string | null;
  image?: string | null;
};

type EditableFields = keyof Omit<UserProfile, "email" | "image">;

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState<UserProfile>({
    name: "",
    email: "",
    studentId: "",
    department: "",
    preferredContactMode: "email",
    contactInfo: "",
    bio: "",
    image: null,
  });
  const [editingFields, setEditingFields] = useState<EditableFields[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchUser(email: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!data.error) {
        setUser(data);
        setFormState({
          name: data.name || "",
          email: data.email,
          studentId: data.studentId || "",
          department: data.department || "",
          preferredContactMode: data.preferredContactMode || "email",
          contactInfo: data.contactInfo || "",
          bio: data.bio || "",
          image: data.image || null,
        });
      }
    } catch {
      // ignore error
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchUser(session.user.email);
    }
  }, [status, session]);

  if (status === "loading" || loading) return <p className="p-6">Loading...</p>;
  if (!session) return <p className="p-6">You must be signed in.</p>;

  function toggleEdit(field: EditableFields) {
    setEditingFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
    setMessage("");
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    if (
      (formState.preferredContactMode === "whatsapp" || formState.preferredContactMode === "messenger") &&
      (!formState.contactInfo || formState.contactInfo.trim() === "")
    ) {
      setMessage("Please enter your contact info for WhatsApp or Messenger.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Profile updated successfully.");
        setEditingFields([]);
        await fetchUser(formState.email);
      } else {
        setMessage(data.error || "Failed to update profile.");
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  }

  function isEditing(field: EditableFields) {
    return editingFields.includes(field);
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[rgb(160,12,48)] mb-6 text-center">Your Profile</h1>

        {/* Avatar */}
        {formState.image && (
          <div className="flex justify-center mb-6">
            <img
              src={formState.image}
              alt={`${formState.name || "User"} avatar`}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Bio */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm relative">
            <p className="text-sm font-semibold text-gray-500 mb-1">Bio (optional)</p>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formState.bio || ""}
              disabled={!isEditing("bio")}
              onChange={handleChange}
              className={`w-full text-lg text-gray-800 bg-transparent border-b resize-none ${
                isEditing("bio") ? "border-[rgb(160,12,48)] focus:outline-none" : "border-transparent"
              }`}
              placeholder="Add any additional info about yourself..."
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => toggleEdit("bio")}
              className="absolute right-4 top-2 p-1 text-gray-600 hover:text-[rgb(160,12,48)]"
              aria-label={isEditing("bio") ? "Cancel editing bio" : "Edit bio"}
            >
              {isEditing("bio") ? <XMarkIcon className="h-5 w-5" /> : <PencilIcon className="h-5 w-5" />}
            </button>
          </div>

          {/* Editable Fields */}
          {[
            { label: "Name", name: "name", type: "text", required: true },
            { label: "Student ID", name: "studentId", type: "text", required: false },
            { label: "Department", name: "department", type: "text", required: false },
          ].map(({ label, name, type, required }) => (
            <div
              key={name}
              className="bg-gray-50 p-4 rounded-lg shadow-sm relative"
            >
              <p className="text-sm font-semibold text-gray-500 mb-1">{label}</p>
              <input
                type={type}
                id={name}
                name={name}
                value={formState[name as keyof UserProfile] || ""}
                onChange={handleChange}
                disabled={!isEditing(name as EditableFields)}
                required={required}
                className={`w-full text-lg text-gray-800 bg-transparent border-b ${
                  isEditing(name as EditableFields)
                    ? "border-[rgb(160,12,48)] focus:outline-none"
                    : "border-transparent"
                }`}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => toggleEdit(name as EditableFields)}
                className="absolute right-4 top-6 p-1 text-gray-600 hover:text-[rgb(160,12,48)]"
                aria-label={
                  isEditing(name as EditableFields)
                    ? `Cancel editing ${label}`
                    : `Edit ${label}`
                }
              >
                {isEditing(name as EditableFields) ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <PencilIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          ))}

          {/* Email - no edit */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm font-semibold text-gray-500 mb-1">Email</p>
            <p className="text-lg text-gray-800">{formState.email}</p>
          </div>

          {/* Preferred Contact Mode */}
          <fieldset className="bg-gray-50 p-4 rounded-lg shadow-sm relative">
            <legend className="font-semibold mb-2 text-gray-500">Preferred Mode of Contact</legend>
            <div className="flex items-center space-x-6">
              {["email", "whatsapp", "messenger"].map((mode) => (
                <label key={mode} className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    name="preferredContactMode"
                    value={mode}
                    checked={formState.preferredContactMode === mode}
                    disabled={!isEditing("preferredContactMode")}
                    onChange={handleChange}
                  />
                  <span className="capitalize text-gray-800">{mode}</span>
                </label>
              ))}
              <button
                type="button"
                onClick={() => toggleEdit("preferredContactMode")}
                className="ml-4 p-1 text-gray-600 hover:text-[rgb(160,12,48)]"
                aria-label={
                  isEditing("preferredContactMode")
                    ? "Cancel editing preferred contact mode"
                    : "Edit preferred contact mode"
                }
              >
                {isEditing("preferredContactMode") ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <PencilIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </fieldset>

          {/* Contact Info - conditional */}
          {(formState.preferredContactMode === "whatsapp" ||
            formState.preferredContactMode === "messenger") && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm relative">
              <p className="text-sm font-semibold text-gray-500 mb-1">
                {formState.preferredContactMode === "whatsapp" ? "WhatsApp Number" : "Messenger ID"}
              </p>
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                value={formState.contactInfo || ""}
                disabled={!isEditing("contactInfo")}
                onChange={handleChange}
                required
                className={`w-full text-lg text-gray-800 bg-transparent border-b ${
                  isEditing("contactInfo")
                    ? "border-[rgb(160,12,48)] focus:outline-none"
                    : "border-transparent"
                }`}
                placeholder={
                  formState.preferredContactMode === "whatsapp"
                    ? "+8801XXXXXXXXX"
                    : "Messenger username or ID"
                }
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => toggleEdit("contactInfo")}
                className="absolute right-4 top-6 p-1 text-gray-600 hover:text-[rgb(160,12,48)]"
                aria-label={
                  isEditing("contactInfo") ? "Cancel editing contact info" : "Edit contact info"
                }
              >
                {isEditing("contactInfo") ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <PencilIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={saving || editingFields.length === 0}
            className="bg-[rgb(160,12,48)] text-white px-6 py-2 rounded hover:bg-[rgb(130,10,40)] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
        </form>
      </div>
    </main>
  );
}
