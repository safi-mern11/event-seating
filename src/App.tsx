import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import SelectionSummary from './components/SelectionSummary/SelectionSummary';
import SeatDetails from './components/SeatDetails/SeatDetails';
import VenueControls from './components/VenueControls/VenueControls';
import SeatGrid from './components/SeatGrid/SeatGrid';
import VirtualizedSeatGrid from './components/SeatGrid/VirtualizedSeatGrid';
import { useSeatingMap } from './hooks/useSeatingMap';
import { useSelection } from './hooks/useSelection';
import { generateVenue } from './utils/venueGenerator';
import type { Seat, Venue } from './types/venue';

function App() {
  const { venue: defaultVenue, loading, error } = useSeatingMap();
  const [dynamicVenue, setDynamicVenue] = useState<Venue | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Use dynamic venue if available, otherwise use default
  const venue = dynamicVenue || defaultVenue;

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

  const handleSeatCountChange = useCallback((count: number) => {
    setIsGenerating(true);
    // Clear selections when changing venue
    clearSelection();
    setFocusedSeat(null);

    // Generate new venue asynchronously to keep UI responsive
    setTimeout(() => {
      const newVenue = generateVenue(count);
      setDynamicVenue(newVenue);
      setIsGenerating(false);
    }, 100);
  }, [clearSelection]);

  // Calculate total seat count
  const totalSeatCount = useMemo(() => {
    if (!venue) return 0;
    return venue.sections.reduce((total, section) => {
      return total + section.rows.reduce((rowTotal, row) => rowTotal + row.seats.length, 0);
    }, 0);
  }, [venue]);

  // Use virtualized grid for large venues (>5000 seats)
  const useVirtualization = totalSeatCount > 5000;

  if (loading && !dynamicVenue) {
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
          <p className="text-purple-300 text-sm mt-2">Preparing seats for you</p>
        </motion.div>
      </div>
    );
  }

  if (error && !dynamicVenue && !venue) {
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

  if (!venue) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 md:p-6">
      <motion.div
        className="max-w-[1920px] mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Venue Controls */}
        <div className="mb-6">
          <VenueControls
            onSeatCountChange={handleSeatCountChange}
            isGenerating={isGenerating}
            currentSeatCount={totalSeatCount}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {isGenerating ? (
              <div className="h-[calc(100vh-300px)] flex items-center justify-center bg-gradient-to-b from-indigo-950 via-purple-950 to-gray-900 rounded-3xl">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                    <div className="absolute inset-0 w-16 h-16 m-auto border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                  </div>
                  <p className="text-white font-semibold text-lg mt-6">Generating venue...</p>
                  <p className="text-purple-300 text-sm mt-2">Creating {totalSeatCount.toLocaleString()} seats</p>
                </motion.div>
              </div>
            ) : (
              <div className="bg-gradient-to-b from-indigo-950 via-purple-950 to-gray-900 rounded-3xl overflow-hidden shadow-2xl">
                {/* Header with venue info */}
                <div className="bg-gradient-to-r from-purple-900/60 via-pink-900/60 to-purple-900/60 p-6 border-b-2 border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-4xl font-black text-white bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                        {venue.name}
                      </h1>
                      <p className="text-purple-300 text-sm mt-1">
                        {totalSeatCount.toLocaleString()} seats • {venue.sections.length} sections
                        {useVirtualization && ' • Virtualized rendering'}
                      </p>
                    </div>

                    {/* Legend */}
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-500"></div>
                        <span className="text-white">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                        <span className="text-white">Selected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-500"></div>
                        <span className="text-white">Reserved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-500"></div>
                        <span className="text-white">Sold</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid - use virtualized or normal based on seat count */}
                <div className="h-[calc(100vh-500px)] min-h-[600px] overflow-y-auto">
                  {useVirtualization ? (
                    <VirtualizedSeatGrid
                      venue={venue}
                      selectedSeatIds={selectedSeatIds}
                      onSeatClick={handleSeatClick}
                    />
                  ) : (
                    <SeatGrid
                      venue={venue}
                      selectedSeatIds={selectedSeatIds}
                      onSeatClick={handleSeatClick}
                    />
                  )}
                </div>
              </div>
            )}
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
