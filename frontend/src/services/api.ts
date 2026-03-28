import type {
  BackendAlert,
  BackendFoundReport,
  BackendMissingReport,
  CreateFoundPayload,
  CreateMissingPayload,
} from "@/types";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: string;
  role: "user" | "authority";
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

interface BackendError {
  detail?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = "Request failed";
    try {
      const errorBody = (await response.json()) as BackendError;
      detail = errorBody.detail ?? detail;
    } catch {
      // Keep fallback detail message when response body is not JSON.
    }
    throw new Error(detail);
  }
  return (await response.json()) as T;
}

export async function signupWithEmail(payload: {
  name: string;
  email: string;
  password: string;
  role: "user" | "authority";
}): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse<AuthResponse>(response);
}

export async function loginWithEmail(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse<AuthResponse>(response);
}

export async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken }),
  });
  return parseResponse<AuthResponse>(response);
}

export async function getMe(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseResponse<AuthUser>(response);
}

export async function createMissingReport(
  payload: CreateMissingPayload,
  token: string,
): Promise<void> {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("age", payload.age);
  formData.append("gender", payload.gender);
  formData.append("last_seen_location", payload.lastSeenLocation);
  formData.append("additional_info", payload.description);
  formData.append("image", payload.image);

  const response = await fetch(`${API_BASE_URL}/missing/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  await parseResponse<Record<string, unknown>>(response);
}

export async function createFoundReport(
  payload: CreateFoundPayload,
  token: string,
): Promise<void> {
  const formData = new FormData();
  formData.append("found_location", payload.location);
  formData.append("contact_info", payload.contact);
  formData.append("additional_info", payload.description);
  formData.append("image", payload.image);

  const response = await fetch(`${API_BASE_URL}/found/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  await parseResponse<Record<string, unknown>>(response);
}

export async function fetchMissingReports(
  token: string,
): Promise<BackendMissingReport[]> {
  const response = await fetch(`${API_BASE_URL}/admin/missing`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await parseResponse<{
    missing_reports: BackendMissingReport[];
  }>(response);
  return payload.missing_reports;
}

export async function fetchFoundReports(
  token: string,
): Promise<BackendFoundReport[]> {
  const response = await fetch(`${API_BASE_URL}/admin/found`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await parseResponse<{ found_reports: BackendFoundReport[] }>(
    response,
  );
  return payload.found_reports;
}

export async function fetchAlerts(token: string): Promise<BackendAlert[]> {
  const response = await fetch(`${API_BASE_URL}/admin/alerts`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await parseResponse<{ alerts: BackendAlert[] }>(response);
  return payload.alerts;
}
