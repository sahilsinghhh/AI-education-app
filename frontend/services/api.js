export const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const getAuthHeadersFormData = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
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

export const uploadFile = async (endpoint, file, additionalData = {}) => {
  const url = `${API_URL}${endpoint}`;
  const formData = new FormData();
  formData.append('file', file);
  
  // Add additional data to form data
  Object.keys(additionalData).forEach(key => {
    if (additionalData[key]) {
      formData.append(key, additionalData[key]);
    }
  });

  const headers = getAuthHeadersFormData();
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Something went wrong');
  }

  if (response.status !== 204) {
    return response.json();
  }
};
