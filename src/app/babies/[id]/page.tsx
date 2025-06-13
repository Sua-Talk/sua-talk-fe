'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BabyProfile } from '@/types/baby';
import { useAuth } from '@/context/AuthContext';
import apiBabies from '@/lib/apiBabies';

interface PageParams {
  id: string;
}

const BabyDetailPage = ({ params }: { params: PageParams }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BabyProfile>({
    id: '',
    name: '',
    birthDate: '',
    gender: 'female',
    weight: {
      birth: 0,
      current: 0
    },
    height: {
      birth: 0,
      current: 0
    },
    notes: '',
    photoUrl: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchBaby = async () => {
      try {
        const response = await apiBabies.getBaby(params.id);
        if (response.success && response.data?.baby) {
          // Transform API response to match our frontend type
          const babyData = {
            id: response.data.baby.id,
            name: response.data.baby.name,
            birthDate: response.data.baby.birthDate,
            gender: response.data.baby.gender,
            weight: {
              birth: response.data.baby.weight?.birth || 0,
              current: response.data.baby.weight?.current || 0
            },
            height: {
              birth: response.data.baby.height?.birth || 0,
              current: response.data.baby.height?.current || 0
            },
            notes: response.data.baby.notes || '',
            photoUrl: response.data.baby.profilePicture?.original || ''
          };
          setFormData(babyData);
        } else {
          setError('Failed to fetch baby profile');
        }
      } catch (err) {
        setError('An error occurred while fetching the baby profile');
        console.error('Error fetching baby:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBaby();
  }, [isAuthenticated, router, params.id]);

  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'weight' || parent === 'height') {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: Number(value)
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Convert frontend data to match API type
      const { birthDate, ...rest } = formData;
      const apiData = {
        ...rest,
        dateOfBirth: birthDate
      };

      const response = await apiBabies.updateBaby(params.id, apiData);
      if (response.success) {
        setIsEditing(false);
      } else {
        setError('Failed to update baby profile');
      }
    } catch (err) {
      setError('An error occurred while updating the baby profile');
      console.error('Error updating baby:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this baby profile?')) {
      try {
        const response = await apiBabies.deleteBaby(params.id);
        if (response.success) {
          router.push('/babies');
        } else {
          setError('Failed to delete baby profile');
        }
      } catch (err) {
        setError('An error occurred while deleting the baby profile');
        console.error('Error deleting baby:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-4 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-2xl font-bold text-blue-700">Baby Profile</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Baby's Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
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
                    min="0"
                    step="1"
                  />
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
                    min="0"
                    step="1"
                  />
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
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Name</h3>
                <p className="mt-1 text-lg">{formData.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700">Birth Date</h3>
                <p className="mt-1 text-lg">{new Date(formData.birthDate).toLocaleDateString()}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700">Gender</h3>
                <p className="mt-1 text-lg capitalize">{formData.gender}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Birth Weight</h3>
                  <p className="mt-1 text-lg">{formData.weight.birth}g</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Current Weight</h3>
                  <p className="mt-1 text-lg">{formData.weight.current}g</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Birth Height</h3>
                  <p className="mt-1 text-lg">{formData.height.birth}cm</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Current Height</h3>
                  <p className="mt-1 text-lg">{formData.height.current}cm</p>
                </div>
              </div>

              {formData.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Notes</h3>
                  <p className="mt-1 text-lg whitespace-pre-wrap">{formData.notes}</p>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center flex-1 bg-red-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Profile
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BabyDetailPage; 