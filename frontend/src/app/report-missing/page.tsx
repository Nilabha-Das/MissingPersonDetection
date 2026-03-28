"use client";

import { FormEvent, useState } from "react";

import AppNavbar from "@/components/AppNavbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Button from "@/components/ui/Button";
import {
  InputField,
  SelectField,
  TextAreaField,
} from "@/components/ui/FormFields";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { createMissingReport } from "@/services/api";

const genderOptions = [
  { label: "Select gender", value: "" },
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

export default function ReportMissingPage() {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !age || !gender || !description || !image) {
      setToast("Please fill all fields and upload an image.");
      return;
    }

    setLoading(true);
    setToast("");
    try {
      if (!token) {
        throw new Error("You are not authenticated. Please login again.");
      }

      await createMissingReport(
        {
          name,
          age,
          gender,
          description,
          lastSeenLocation: "",
          image,
        },
        token,
      );

      setToast("Missing person report submitted successfully.");
      setName("");
      setAge("");
      setGender("");
      setDescription("");
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
              Report Missing Person
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Submit details to begin AI-assisted matching workflows.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <InputField
                id="name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <InputField
                id="age"
                label="Age"
                type="number"
                min={0}
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <SelectField
                id="gender"
                label="Gender"
                options={genderOptions}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
              <TextAreaField
                id="description"
                label="Description"
                placeholder="Clothing, last-seen details, physical identifiers"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

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
