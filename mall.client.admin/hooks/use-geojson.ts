"use client";
import { useQuery } from "@tanstack/react-query";

type GeoJSONLike = Record<string, any>;

export function useGeoJSON(path: string) {
  return useQuery<GeoJSONLike, Error>({
    queryKey: ["geojson", path],
    queryFn: async () => {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
      }
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
  });
}
