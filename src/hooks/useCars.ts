"use client";

import { useState, useEffect, useCallback } from "react";
import type { CarWithRelations, CarFilters, PaginatedResponse } from "@/types";
import { buildQueryString } from "@/lib/utils";

export function useCars(filters: CarFilters = {}) {
  const [cars, setCars] = useState<CarWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = buildQueryString(filters as Record<string, string | number | boolean | undefined | null>);
      const res = await fetch(`/api/cars${query}`);
      if (!res.ok) throw new Error("Failed to fetch cars");
      const data: PaginatedResponse<CarWithRelations> = await res.json();
      setCars(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return { cars, loading, error, pagination, refetch: fetchCars };
}

export function useCar(id: string) {
  const [car, setCar] = useState<CarWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/cars/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Car not found");
        return res.json();
      })
      .then((data) => setCar(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { car, loading, error };
}
