"use client";

import { FormEvent, useState } from "react";

import AppNavbar from "@/components/AppNavbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Button from "@/components/ui/Button";
import { InputField, TextAreaField } from "@/components/ui/FormFields";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { createFoundReport } from "@/services/api";

export default function ReportFoundPage() {
  const { token } = useAuth();
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!location || !description || !contact || !image) {
      setToast("Please complete all details and add an image.");
      return;
    }

    setLoading(true);
    setToast("");
    try {
      if (!token) {
        throw new Error("You are not authenticated. Please login again.");
      }

      await createFoundReport(
        {
          location,
          description,
          contact,
          image,
        },
        token,
      );

      setToast("Found person report submitted successfully.");
      setLocation("");
      setDescription("");
      setContact("");
      setImage(null);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to submit report. Please try again.";
      setToast(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar />
      <ProtectedRoute>
        <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
          <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Report Found Person
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Record discovered-person details for possible AI matching.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label
                htmlFor="image"
                className="block text-sm font-semibold text-slate-700"
              >
                Image Upload
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>

              <InputField
                id="location"
                label="Location"
                placeholder="Where was the person found?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <TextAreaField
                id="description"
                label="Description"
                placeholder="Appearance, behavior, observed details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <InputField
                id="contact"
                label="Contact Information"
                placeholder="Phone, station desk, NGO contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />

              {toast ? (
                <Toast
                  message={toast}
                  tone={toast.includes("successfully") ? "success" : "error"}
                />
              ) : null}

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? (
                  <LoadingSpinner label="Submitting report..." />
                ) : (
                  "Submit Report"
                )}
              </Button>
            </form>
          </section>
        </main>
      </ProtectedRoute>
    </div>
  );
}
