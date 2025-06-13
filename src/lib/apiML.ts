import apiFetch from "./apiBase";

interface MLPrediction {
  id: string;
  babyId: string;
  type: "cry" | "development" | "health";
  prediction: string;
  confidence: number;
  createdAt: string;
}

const handleAuthError = () => {
  alert("Your session has expired. Please login again.");
  window.location.href = "/login";
};

const getAuthHeaders = (): Record<string, string> => {
  const accessToken = localStorage.getItem("auth_token");
  if (!accessToken) {
    handleAuthError();
    return {};
  }
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

export const apiML = {
  // Get predictions for a baby
  getPredictions: (babyId: string) =>
    apiFetch(`/ml/predictions/${babyId}`, {
      headers: getAuthHeaders(),
    }),

  // Get a specific prediction
  getPrediction: (id: string) =>
    apiFetch(`/ml/prediction/${id}`, {
      headers: getAuthHeaders(),
    }),

  // Request a new prediction
  requestPrediction: (babyId: string, type: MLPrediction["type"]) =>
    apiFetch(`/ml/predict/${babyId}`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type }),
    }),

  // Get model status
  getModelStatus: () =>
    apiFetch("/ml/status", {
      headers: getAuthHeaders(),
    }),

  // Get model metrics
  getModelMetrics: () =>
    apiFetch("/ml/metrics", {
      headers: getAuthHeaders(),
    }),

  // Get available ML classes
  getClasses: () =>
    apiFetch("/ml/classes", {
      headers: getAuthHeaders(),
    }),

  // Analyze a recording
  analyzeRecording: (recordingId: string) =>
    apiFetch(`/ml/analyze/${recordingId}`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    }),

  // Get analysis results for a recording
  getAnalysis: (recordingId: string) =>
    apiFetch(`/ml/analysis/${recordingId}`, {
      headers: getAuthHeaders(),
    }),

  // Get ML analysis statistics for a user
  getStats: (userId: string) =>
    apiFetch(`/ml/stats/${userId}`, {
      headers: getAuthHeaders(),
    }),
};

export default apiML;
