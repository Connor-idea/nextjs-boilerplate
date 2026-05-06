const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  getBootstrap() {
    return request('/bootstrap');
  },
  syncLeadSnapshot(payload) {
    return request('/leads/snapshot', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  confirmAssignments(payload) {
    return request('/leads/confirm-assignments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  syncSupplierBills(payload) {
    return request('/supplier-bills/snapshot', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  markNotificationsRead() {
    return request('/notifications/mark-read', {
      method: 'POST',
    });
  },
};