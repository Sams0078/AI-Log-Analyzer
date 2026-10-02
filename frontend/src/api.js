import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8001";

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

export async function uploadLogs(file) {
  const form = new FormData();
  form.append("file", file);
  const response = await api.post("/logs/upload", form);
  return response.data;
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
  const response = await api.post("/admin/systems", payload, adminHeaders(token));
  return response.data;
}

export default api;
