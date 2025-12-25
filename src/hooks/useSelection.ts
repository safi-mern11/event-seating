import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Seat, SelectedSeat } from '../types/venue';

const MAX_SELECTION = 8;
const STORAGE_KEY = 'selected-seats';

interface UseSelectionProps {
  onSelectionChange?: (seats: SelectedSeat[]) => void;
}

export function useSelection({ onSelectionChange }: UseSelectionProps = {}) {
  const [selectedSeatIds, setSelectedSeatIds] = useLocalStorage<string[]>(STORAGE_KEY, []);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

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

      setSelectedSeatIds(prev => {
        const isCurrentlySelected = prev.includes(seat.id);

        if (isCurrentlySelected) {
          return prev.filter(id => id !== seat.id);
        } else if (prev.length < MAX_SELECTION) {
          return [...prev, seat.id];
        }

        return prev;
      });

      setSelectedSeats(prev => {
        const isCurrentlySelected = prev.some(s => s.id === seat.id);

        if (isCurrentlySelected) {
          return prev.filter(s => s.id !== seat.id);
        } else if (prev.length < MAX_SELECTION) {
          return [...prev, { ...seat, section, row }];
        }

        return prev;
      });
    },
    [setSelectedSeatIds]
  );

  const clearSelection = useCallback(() => {
    setSelectedSeatIds([]);
    setSelectedSeats([]);
  }, [setSelectedSeatIds]);

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
