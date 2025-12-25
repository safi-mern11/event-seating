import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 m-auto border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="text-white font-semibold text-lg mt-6">Loading venue...</p>
          <p className="text-purple-300 text-sm mt-2">Preparing 14,750 seats for you</p>
        </motion.div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-red-900 to-black p-4">
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 max-w-md border border-red-500/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-red-500 mb-6">
            <svg
              className="h-16 w-16 mx-auto"
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
          <h2 className="text-2xl font-bold text-white text-center mb-3">
            Unable to Load Venue
          </h2>
          <p className="text-gray-400 text-center">{error || 'Unknown error occurred'}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full mt-6 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 md:p-6">
      <motion.div
        className="max-w-[1920px] mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
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
      </motion.div>
    </div>
  );
}

export default App;
