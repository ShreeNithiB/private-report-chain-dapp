// Central API configuration - all backend calls go through here
export const API_BASE = "http://localhost:3000";

export const API_ENDPOINTS = {
  submitReport: `${API_BASE}/submit-report`,
  updateReport: `${API_BASE}/update-report`,
  getReport: (id: string) => `${API_BASE}/report/${id}`,
  getAllReports: `${API_BASE}/reports`,
};
