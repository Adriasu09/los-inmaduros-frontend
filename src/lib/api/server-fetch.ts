const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function serverFetch<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`API error ${response.status}: ${endpoint}`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(`Network error fetching ${endpoint}:`, error);
    return null;
  }
}
