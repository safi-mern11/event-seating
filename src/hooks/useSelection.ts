import { useCallback, useEffect } from 'react';
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

  // Debug: log what we loaded from localStorage
  useEffect(() => {
    console.log('🔄 Cart loaded from localStorage:');
    console.log('  - Seat IDs:', selectedSeatIds);
    console.log('  - Seat Details:', selectedSeats);
  }, []);

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
        console.log('❌ Removing seat:', seat.id);
        setSelectedSeatIds(prev => prev.filter(id => id !== seat.id));
        setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
      } else if (selectedSeatIds.length < MAX_SELECTION) {
        // Add seat
        const seatWithDetails = { ...seat, section, row };
        console.log('✅ Adding seat:', seat.id, seatWithDetails);
        setSelectedSeatIds(prev => {
          const newIds = [...prev, seat.id];
          console.log('  → New IDs array:', newIds);
          return newIds;
        });
        setSelectedSeats(prev => {
          const newSeats = [...prev, seatWithDetails];
          console.log('  → New Seats array:', newSeats);
          return newSeats;
        });
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
