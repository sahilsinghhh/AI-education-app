export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = { ...getAuthHeaders(), ...options.headers };
  
  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Something went wrong');
  }
  
  if (response.status !== 204) {
    return response.json();
  }
};
