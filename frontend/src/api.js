import axios from "axios";

// Direct URL ki jagah Vite proxy ke sath compatible base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

export async function getAnalysis() {
  const response = await api.get("/analysis/");
  return response.data;
}

export async function analyzeIncidentWithAI(incident) {
  const response = await api.post("/analysis/ai", incident);
  return response.data;
}

export async function getLogs() {
  const response = await api.get("/logs/");
  return response.data;
}

// Support both File Object & Raw Text String Ingestion
export async function uploadLogs(fileOrContent) {
  if (typeof fileOrContent === "string") {
    // Handling raw text log ingestion
    const response = await api.post("/logs/ingest", {
      raw_logs: fileOrContent,
    });
    return response.data;
  } else {
    // Handling file upload
    const formData = new FormData();
    formData.append("file", fileOrContent);

    const response = await api.post("/logs/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

export async function loginAdmin(username, password) {
  const response = await api.post("/admin/login", { username, password });
  return response.data;
}

function adminHeaders(token) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function getAdminSession(token) {
  const response = await api.get("/admin/session", adminHeaders(token));
  return response.data;
}

export async function getSystems(token) {
  const response = await api.get("/admin/systems", adminHeaders(token));
  return response.data;
}

export async function registerSystem(token, payload) {
  const response = await api.post(
    "/admin/systems",
    payload,
    adminHeaders(token)
  );
  return response.data;
}

export default api;