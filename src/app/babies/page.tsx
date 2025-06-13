"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { BabyProfile } from "@/types/baby";
import apiBabies from "@/lib/apiBabies";

interface ApiBabyResponse {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  weight: number;
  height: number;
  notes: string;
  photoUrl: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

const BabiesPage = () => {
  const router = useRouter();
  const { isAuthenticated, getUserInfo, logout } = useAuth();
  const [babies, setBabies] = useState<BabyProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }    const fetchBabies = async () => {
      try {        console.log('Fetching babies...');
        const response = await apiBabies.getBabies() as { success: boolean; data: { babies: BabyProfile[] } };
        console.log('API Response:', response);

        if (response.success && Array.isArray(response.data.babies)) {
          console.log("Response data is valid array:", response.data);
          const mappedBabies = response.data.babies.map((babyData: unknown) => {
            const baby = babyData as ApiBabyResponse;
            console.log("Mapping baby:", baby);
            return {
              id: baby.id,
              name: baby.name,
              birthDate: baby.birthDate,
              gender: baby.gender as "male" | "female",
              weight: {
                birth: baby.weight,
                current: baby.weight,
              },
              height: {
                birth: baby.height,
                current: baby.height,
              },
              notes: baby.notes,
            };
          });
          console.log("Mapped babies:", mappedBabies);
          setBabies(mappedBabies);
        } else {
          console.log("Invalid response format:", response);
          setBabies([]);
          setError("Failed to fetch babies");
        }
      } catch (err) {
        console.error("Error in fetchBabies:", err);
        setBabies([]);
        setError("An error occurred while fetching babies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBabies();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const userInfo = getUserInfo();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-sm bg-white min-h-screen relative">
        {/* Header */}
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 sm:relative">
          <div className="px-4 sm:px-6">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-blue-700">SuaTalk</h1>
              </div>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isSidebarOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <div
          className={`absolute right-0 top-16 w-48 bg-white shadow-lg rounded-lg transform transition-all duration-300 ease-in-out z-40
            ${
              isSidebarOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
        >
          <div className="p-4">
            <h1 className="text-xl font-bold text-blue-700 mb-4">SuaTalk</h1>

            <nav className="space-y-3">
              <button
                onClick={() => router.push("/home")}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push("/babies")}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Babies
              </button>
              <button
                onClick={() => router.push("/sound")}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Sound Analysis
              </button>              <button
                onClick={logout}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="pt-8">
          <div className="px-4 py-8">
            {/* Welcome Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userInfo?.firstName || "User"}!
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your baby profiles here.
              </p>
            </header>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            ) : !Array.isArray(babies) || babies.length === 0 ? (              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">No babies data about your babies for now, let&apos;s get started by adding your first</div>
                <button
                  onClick={() => router.push('/babies/new')}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Create your first baby profile
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {babies.map((baby) => (
                  <Link
                    href={`/babies/${baby.id}`}
                    key={baby.id}
                    className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {baby.name}
                        </h3>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Born:{" "}
                            {new Date(baby.birthDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            {baby.gender.charAt(0).toUpperCase() +
                              baby.gender.slice(1)}
                          </p>
                        </div>
                      </div>
                      <div className="text-blue-500">
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BabiesPage;
