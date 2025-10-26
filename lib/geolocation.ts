export async function reverseGeocode(lat: string, lon: string): Promise<string> {
  try {
    const response = await fetch(
      `/api/reverse-geocode?lat=${lat}&lon=${lon}`,
    );
    const data = await response.json();
    return data.display_name || "View in Map";
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return "View";
  }
}
