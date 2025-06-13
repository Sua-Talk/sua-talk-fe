"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import apiBabies from "@/lib/apiBabies";

const NewBabyPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "female" as const,
    weight: {
      birth: 0,
      current: 0,
    },
    height: {
      birth: 0,
      current: 0,
    },
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (parent === "weight" || parent === "height") {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: Number(value),
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate weight
    if (formData.weight.birth < 500 || formData.weight.birth > 8000) {
      setError("Birth weight must be between 500g and 8000g");
      setIsSubmitting(false);
      return;
    }

    if (formData.weight.current < 500 || formData.weight.current > 8000) {
      setError("Current weight must be between 500g and 8000g");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = (await apiBabies.createBaby(formData)) as {
        success: boolean;
      };
      if (response.success) {
        router.push("/babies");
      } else {
        setError("Failed to create baby profile");
      }
    } catch (err) {
      setError("An error occurred while creating the baby profile");
      console.error("Error creating baby:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="text-2xl font-bold text-blue-700">
            New Baby Profile
          </div>
        </header>

        {/* Form */}
        <main className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Baby&apos;s Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                placeholder="Enter baby's name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Weight (g)
                </label>
                <input
                  type="number"
                  name="weight.birth"
                  value={formData.weight.birth}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  min="500"
                  max="8000"
                  step="1"
                  placeholder="Enter birth weight (500-8000g)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Must be between 500g and 8000g
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Weight (g)
                </label>
                <input
                  type="number"
                  name="weight.current"
                  value={formData.weight.current}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  min="500"
                  max="8000"
                  step="1"
                  placeholder="Enter current weight (500-8000g)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Must be between 500g and 8000g
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Height (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="height.birth"
                  value={formData.height.birth}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Height (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="height.current"
                  value={formData.height.current}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Add any additional notes about your baby"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  "Create Profile"
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default NewBabyPage;
