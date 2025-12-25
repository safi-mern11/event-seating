import { useState, useCallback } from 'react';
import SeatingMap from './components/SeatingMap/SeatingMap';
import SelectionSummary from './components/SelectionSummary/SelectionSummary';
import SeatDetails from './components/SeatDetails/SeatDetails';
import { useSeatingMap } from './hooks/useSeatingMap';
import { useSelection } from './hooks/useSelection';
import type { Seat } from './types/venue';

function App() {
  const { venue, loading, error } = useSeatingMap();
  const {
    selectedSeatIds,
    selectedSeats,
    toggleSeat,
    clearSelection,
    maxSelection,
    remainingSlots,
  } = useSelection();

  const [focusedSeat, setFocusedSeat] = useState<{
    seat: Seat;
    section: string;
    row: string;
  } | null>(null);

  const handleSeatClick = useCallback(
    (seat: Seat, section: string, row: string) => {
      toggleSeat(seat, section, row);
      setFocusedSeat({ seat, section, row });
    },
    [toggleSeat]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading seating map...</p>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-600 mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
            Failed to Load Venue
          </h2>
          <p className="text-gray-600 text-center">{error || 'Unknown error occurred'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SeatingMap
              venue={venue}
              selectedSeatIds={selectedSeatIds}
              onSeatClick={handleSeatClick}
            />
          </div>

          <div className="space-y-6">
            <SelectionSummary
              selectedSeats={selectedSeats}
              remainingSlots={remainingSlots}
              maxSelection={maxSelection}
              onClear={clearSelection}
            />

            <SeatDetails
              seat={focusedSeat?.seat ?? null}
              section={focusedSeat?.section}
              row={focusedSeat?.row}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
