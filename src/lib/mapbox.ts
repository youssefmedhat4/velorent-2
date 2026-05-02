export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

export interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number];
  text: string;
  context?: Array<{ id: string; text: string }>;
}

export async function geocodeAddress(
  query: string
): Promise<MapboxFeature[]> {
  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "pk.placeholder") return [];

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?access_token=${MAPBOX_TOKEN}&types=place,address&limit=5`;

  const res = await fetch(url);
  if (!res.ok) return [];

  const data = await res.json();
  return data.features ?? [];
}
