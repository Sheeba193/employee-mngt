const API_BASE_URL = 'https://localhost:5001/api';

function defaultHeaders() {
  const token = localStorage.getItem('employee-management-token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { ...defaultHeaders(), ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    let err = 'Request failed';
    try {
      const json = JSON.parse(text);
      err = json.message || JSON.stringify(json);
    } catch (e) {
      if (text) err = text;
    }
    const error = new Error(err);
    error.status = response.status;
    throw error;
  }

  // return empty for 204
  if (response.status === 204) return null;

  return response.json();
}
