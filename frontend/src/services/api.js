const BASE_URL = import.meta.env.VITE_API_URL || '/api/auth';

/**
 * Helper to handle HTTP responses safely and extract user-friendly error messages
 */
async function handleResponse(response) {
  let data = null;
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    // Extract friendly message from server, or fallback to status-based messages
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (data && typeof data.message === 'string') {
      errorMessage = data.message;
    } else if (response.status === 401) {
      errorMessage = 'Invalid email or password.';
    } else if (response.status === 400) {
      errorMessage = 'Please check the entered details and try again.';
    } else if (response.status === 404) {
      errorMessage = 'Requested service endpoint was not found.';
    } else if (response.status >= 500) {
      errorMessage = 'Server is currently unavailable. Please try again shortly.';
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.field = data?.field;
    throw error;
  }

  return data;
}

/**
 * Login API call
 */
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check your network connection.');
    }
    throw error;
  }
}

/**
 * Fetch currently authenticated user session
 */
export async function fetchCurrentUser(token) {
  try {
    const response = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check your network connection.');
    }
    throw error;
  }
}

/**
 * Logout API call
 */
export async function logoutUser(token) {
  try {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return await handleResponse(response);
  } catch (error) {
    // If network fails during logout, we still allow client logout
    console.warn('Network issue during logout request:', error.message);
    return { success: true };
  }
}
