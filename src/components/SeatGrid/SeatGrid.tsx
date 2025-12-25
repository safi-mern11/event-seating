import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import Seat from '../Seat/Seat';
import type { Venue, Seat as SeatType } from '../../types/venue';

interface SeatGridProps {
  venue: Venue;
  selectedSeatIds: string[];
  onSeatClick: (seat: SeatType, section: string, row: string) => void;
}

const SeatGrid = memo(({ venue, selectedSeatIds, onSeatClick }: SeatGridProps) => {
  const selectedSet = useMemo(() => new Set(selectedSeatIds), [selectedSeatIds]);

  return (
    <div className="w-full bg-gradient-to-b from-indigo-950 via-purple-950 to-gray-900 rounded-3xl overflow-hidden shadow-2xl">
      {/* Magnificent Stage */}
      <div className="relative w-full py-12 px-8 bg-gradient-to-b from-purple-600/40 via-pink-600/30 to-transparent border-b-8 border-purple-500/60 mb-12">
        <motion.div
          className="max-w-6xl mx-auto relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          {/* Stage Curtains */}
          <div className="absolute inset-0 flex justify-between pointer-events-none">
            <div className="w-32 h-full bg-gradient-to-r from-red-900 to-transparent opacity-60 rounded-l-3xl" />
            <div className="w-32 h-full bg-gradient-to-l from-red-900 to-transparent opacity-60 rounded-r-3xl" />
          </div>

          {/* Main Stage */}
          <div className="relative bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 h-24 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
            {/* Stage Lights Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Stage Text */}
            <motion.span
              className="relative text-white font-black text-5xl tracking-[0.3em] drop-shadow-2xl"
              animate={{ textShadow: ['0 0 20px rgba(255,255,255,0.5)', '0 0 40px rgba(255,255,255,0.8)', '0 0 20px rgba(255,255,255,0.5)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              STAGE
            </motion.span>

            {/* Spotlights */}
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-yellow-300/20 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-yellow-300/20 blur-3xl rounded-full pointer-events-none" />
          </div>

          {/* Stage Border Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-20 blur-xl rounded-3xl -z-10" />
        </motion.div>
      </div>

      {/* Sections Container */}
      <div className="px-8 pb-12 space-y-16">
        {venue.sections.map((section, sectionIdx) => (
          <motion.div
            key={section.id}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIdx * 0.1 }}
          >
            {/* Section Header */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
              <motion.div
                className="relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-30 blur-xl rounded-2xl pointer-events-none" />
                <div className="relative">
                  <h3 className="text-3xl font-black text-white tracking-wide">{section.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-purple-200 text-sm font-semibold">
                      {section.rows.length} Rows
                    </span>
                    <span className="text-purple-300 text-xs">•</span>
                    <span className="text-purple-200 text-sm font-semibold">
                      {section.rows.reduce((sum, row) => sum + row.seats.length, 0)} Seats
                    </span>
                  </div>
                </div>
              </motion.div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
            </div>

            {/* Rows */}
            <div className="space-y-4">
              {section.rows.map((row, rowIdx) => (
                <motion.div
                  key={row.id}
                  className="flex items-center gap-6 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (sectionIdx * 0.1) + (rowIdx * 0.02) }}
                >
                  {/* Row Label */}
                  <div className="w-24 flex-shrink-0">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl px-4 py-3 border-2 border-purple-500/30 group-hover:border-purple-500/60 transition-all shadow-lg">
                      <div className="text-purple-300 text-xs font-semibold uppercase tracking-wider">Row</div>
                      <div className="text-white text-xl font-black">{rowIdx + 1}</div>
                    </div>
                  </div>

                  {/* Seats in Row */}
                  <div className="flex-1 flex items-center justify-center gap-3 flex-wrap bg-gradient-to-r from-gray-900/50 via-purple-900/20 to-gray-900/50 rounded-2xl p-6 border border-purple-500/20">
                    {row.seats.map(seat => (
                      <Seat
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSet.has(seat.id)}
                        onClick={() => onSeatClick(seat, section.name, row.id)}
                        section={section.name}
                        row={row.id}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

SeatGrid.displayName = 'SeatGrid';

export default SeatGrid;
