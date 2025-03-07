type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function apiRequest(method: string, endpoint: string, data?: any) {
  try {
    const url = `http://localhost:3000${endpoint}`;
    console.log(`Making ${method} request to:`, url);

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    // Log response for debugging
    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Response data:', result);
    return result;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}