const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function serverFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    cache: "no-store", // siempre datos frescos
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
