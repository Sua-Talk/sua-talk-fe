"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BabyProfile } from "@/types/baby";
import apiBabies from "@/lib/apiBabies";

const HomePage = () => {
  const router = useRouter();
  const { isAuthenticated, getUserInfo, isLoading: authLoading } = useAuth();
  const [selectedBaby, setSelectedBaby] = useState<BabyProfile | null>(null);
  const [babies, setBabies] = useState<BabyProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return; // Wait for auth check to complete

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const fetchBabies = async () => {
      try {
        const response = (await apiBabies.getBabies()) as {
          success: boolean;
          data: { babies: unknown[] };
        };
        if (response.success && Array.isArray(response.data.babies)) {
          const mappedBabies = response.data.babies.map((baby: unknown) => {
            const babyObj = baby as Record<string, unknown>;
            return {
              id: babyObj.id as string,
              name: babyObj.name as string,
              birthDate: babyObj.birthDate as string,
              gender: babyObj.gender as "male" | "female",
              weight: {
                birth:
                  ((babyObj.weight as Record<string, unknown>)
                    ?.birth as number) || 0,
                current:
                  ((babyObj.weight as Record<string, unknown>)
                    ?.current as number) || 0,
              },
              height: {
                birth:
                  ((babyObj.height as Record<string, unknown>)
                    ?.birth as number) || 0,
                current:
                  ((babyObj.height as Record<string, unknown>)
                    ?.current as number) || 0,
              },
              notes: (babyObj.notes as string) || "",
              photoUrl:
                ((babyObj.profilePicture as Record<string, unknown>)
                  ?.original as string) || "",
            };
          });
          setBabies(mappedBabies);

          // Get selected baby from localStorage or use first baby
          const storedBabyId = localStorage.getItem("selectedBabyId");
          const babyToSelect = storedBabyId
            ? mappedBabies.find((b: BabyProfile) => b.id === storedBabyId)
            : mappedBabies[0];

          if (babyToSelect) {
            setSelectedBaby(babyToSelect);
            localStorage.setItem("selectedBabyId", babyToSelect.id);
          }
        } else {
          setError("Failed to fetch babies");
        }
      } catch (err) {
        setError("An error occurred while fetching babies");
        console.error("Error fetching babies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBabies();
  }, [isAuthenticated, router, authLoading]);

  const handleBabySelect = (baby: BabyProfile) => {
    setSelectedBaby(baby);
    localStorage.setItem("selectedBabyId", baby.id);
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated
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
              </button>
              <button
                onClick={() => router.push("/auth/logout")}
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
                Track and monitor your baby&apos;s development with ease.
              </p>
            </header>

            {/* Baby Data Section */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Baby Data
                </h2>
                <button
                  onClick={() => router.push("/babies")}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  View All Babies
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              ) : babies.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                  <p className="text-gray-500 mb-4">No babies added yet</p>
                  <button
                    onClick={() => router.push("/babies/new")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add your first baby
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Baby Selector */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {babies.map((baby) => (
                      <button
                        key={baby.id}
                        onClick={() => handleBabySelect(baby)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                          selectedBaby?.id === baby.id
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {baby.name}
                      </button>
                    ))}
                  </div>

                  {/* Selected Baby Card */}
                  {selectedBaby && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">
                            Name
                          </h3>
                          <p className="mt-1 text-lg">{selectedBaby.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">
                            Birth Date
                          </h3>
                          <p className="mt-1 text-lg">
                            {new Date(
                              selectedBaby.birthDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">
                            Gender
                          </h3>
                          <p className="mt-1 text-lg capitalize">
                            {selectedBaby.gender}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">
                            Current Weight
                          </h3>
                          <p className="mt-1 text-lg">
                            {selectedBaby.weight.current}g
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Audio Upload Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Upload Audio
              </h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-gray-600 mb-4">
                  Record and analyze your baby&apos;s sounds to track their
                  development.
                </p>
                <button
                  onClick={() => router.push("/sound")}
                  className="bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                  Start Recording
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
