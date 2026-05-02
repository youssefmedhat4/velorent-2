"use client";

import { useState, useEffect } from "react";
import type { BookingWithRelations } from "@/types";

export function useBookings() {
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return { bookings, loading, error, refetch: fetchBookings };
}

export function useBooking(id: string) {
  const [booking, setBooking] = useState<BookingWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/bookings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Booking not found");
        return res.json();
      })
      .then((data) => setBooking(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { booking, loading, error };
}

export function useBookedDates(carId: string) {
  const [bookedDates, setBookedDates] = useState<{ start: Date; end: Date }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!carId) return;
    fetch(`/api/cars/${carId}/availability`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookedDates(
            data.data.map((d: { start: string; end: string }) => ({
              start: new Date(d.start),
              end: new Date(d.end),
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [carId]);

  return { bookedDates, loading };
}
