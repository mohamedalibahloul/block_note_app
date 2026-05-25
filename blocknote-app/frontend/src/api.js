const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  register: (body) =>
    fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handleResponse),

  login: (body) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handleResponse),

  getNotes: () =>
    fetch(`${BASE}/notes`, { headers: authHeaders() }).then(handleResponse),

  createNote: (body) =>
    fetch(`${BASE}/notes`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  updateNote: (id, body) =>
    fetch(`${BASE}/notes/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  deleteNote: (id) =>
    fetch(`${BASE}/notes/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then((res) => {
      if (!res.ok) throw new Error('Delete failed');
    }),
};
