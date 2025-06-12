import apiFetch from './apiBase';

interface MLPrediction {
  id: string;
  babyId: string;
  type: 'cry' | 'development' | 'health';
  prediction: string;
  confidence: number;
  createdAt: string;
}

export const apiML = {
  // Get predictions for a baby
  getPredictions: (babyId: string) => apiFetch(`/ml/predictions/${babyId}`),

  // Get a specific prediction
  getPrediction: (id: string) => apiFetch(`/ml/prediction/${id}`),

  // Request a new prediction
  requestPrediction: (babyId: string, type: MLPrediction['type']) =>
    apiFetch(`/ml/predict/${babyId}`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    }),

  // Get model status
  getModelStatus: () => apiFetch('/ml/status'),

  // Get model metrics
  getModelMetrics: () => apiFetch('/ml/metrics'),
};

export default apiML; 