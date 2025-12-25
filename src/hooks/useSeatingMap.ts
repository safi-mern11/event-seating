import { useState, useEffect } from 'react';
import type { Venue, Seat, Section } from '../types/venue';

export function useSeatingMap() {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVenue = async () => {
      try {
        const response = await fetch('/venue.json');
        if (!response.ok) {
          throw new Error('Failed to load venue data');
        }
        const data = await response.json();
        setVenue(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadVenue();
  }, []);

  return { venue, loading, error };
}

export function findSeat(venue: Venue | null, seatId: string): { seat: Seat; section: Section; rowId: string } | null {
  if (!venue) return null;

  for (const section of venue.sections) {
    for (const row of section.rows) {
      const seat = row.seats.find(s => s.id === seatId);
      if (seat) {
        return { seat, section, rowId: row.id };
      }
    }
  }

  return null;
}
