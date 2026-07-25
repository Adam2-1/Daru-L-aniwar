export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

/**
 * Safely fetches an API endpoint and parses JSON without throwing SyntaxError exceptions.
 * Handles HTML fallback, non-200 responses, network drops, and authorization headers gracefully.
 */
export async function safeFetchJson<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('darulanwar_token');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, { ...options, headers });
    const contentType = res.headers.get('content-type') || '';
    
    let rawText = '';
    try {
      rawText = await res.text();
    } catch {
      rawText = '';
    }

    if (!rawText || !rawText.trim()) {
      if (res.ok) {
        return { success: true, status: res.status };
      }
      return {
        success: false,
        status: res.status,
        message: `Server returned empty response (HTTP ${res.status})`,
        error: `HTTP ${res.status}`
      };
    }

    // Attempt to parse JSON safely if content-type indicates JSON or string looks like JSON
    let json: any = null;
    if (contentType.includes('application/json') || rawText.trim().startsWith('{') || rawText.trim().startsWith('[')) {
      try {
        json = JSON.parse(rawText);
      } catch (jsonErr) {
        console.warn(`JSON parse notice on ${url}:`, jsonErr);
      }
    }

    if (json !== null) {
      if (res.ok) {
        return {
          success: true,
          data: json,
          message: json.message || 'Operation successful',
          status: res.status
        };
      } else {
        return {
          success: false,
          status: res.status,
          message: json.message || json.error || `Request failed with status ${res.status}`,
          error: json.error || json.message || `HTTP ${res.status}`
        };
      }
    }

    // Server returned non-JSON (e.g. HTML error page)
    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: `Server endpoint error (${res.status}). Please try again.`,
        error: `Non-JSON response received (${res.status})`
      };
    }

    return {
      success: false,
      status: res.status,
      message: 'Unexpected non-JSON response from server.',
      error: 'Non-JSON content type'
    };
  } catch (netErr: any) {
    return {
      success: false,
      status: 0,
      message: netErr?.message || 'Network connection error. Please check your internet connection.',
      error: netErr?.message || 'Network error'
    };
  }
}
