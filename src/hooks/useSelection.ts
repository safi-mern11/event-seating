import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Seat, SelectedSeat } from '../types/venue';

const MAX_SELECTION = 8;
const STORAGE_KEY = 'selected-seats';
const STORAGE_KEY_DETAILS = 'selected-seats-details';

interface UseSelectionProps {
  onSelectionChange?: (seats: SelectedSeat[]) => void;
}

export function useSelection({ onSelectionChange }: UseSelectionProps = {}) {
  const [selectedSeatIds, setSelectedSeatIds] = useLocalStorage<string[]>(STORAGE_KEY, []);
  const [selectedSeats, setSelectedSeats] = useLocalStorage<SelectedSeat[]>(STORAGE_KEY_DETAILS, []);

  const isSelected = useCallback(
    (seatId: string) => selectedSeatIds.includes(seatId),
    [selectedSeatIds]
  );

  const canSelect = useCallback(
    () => selectedSeatIds.length < MAX_SELECTION,
    [selectedSeatIds]
  );

  const toggleSeat = useCallback(
    (seat: Seat, section: string, row: string) => {
      if (seat.status !== 'available') return;

      const isCurrentlySelected = selectedSeatIds.includes(seat.id);

      if (isCurrentlySelected) {
        // Remove seat
        setSelectedSeatIds(prev => prev.filter(id => id !== seat.id));
        setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
      } else if (selectedSeatIds.length < MAX_SELECTION) {
        // Add seat
        setSelectedSeatIds(prev => [...prev, seat.id]);
        setSelectedSeats(prev => [...prev, { ...seat, section, row }]);
      }
    },
    [selectedSeatIds, setSelectedSeatIds, setSelectedSeats]
  );

  const clearSelection = useCallback(() => {
    setSelectedSeatIds([]);
    setSelectedSeats([]);
  }, [setSelectedSeatIds, setSelectedSeats]);

  const remainingSlots = MAX_SELECTION - selectedSeatIds.length;

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedSeats);
    }
  }, [selectedSeats, onSelectionChange]);

  return {
    selectedSeatIds,
    selectedSeats,
    isSelected,
    canSelect,
    toggleSeat,
    clearSelection,
    maxSelection: MAX_SELECTION,
    remainingSlots,
  };
}
