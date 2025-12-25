import { memo } from "react";
import { motion } from "framer-motion";
import SeatGrid from "../SeatGrid/SeatGrid";
import type { Venue, Seat } from "../../types/venue";

interface SeatingMapProps {
  venue: Venue;
  selectedSeatIds: string[];
  onSeatClick: (seat: Seat, section: string, row: string) => void;
}

const SeatingMap = memo(
  ({ venue, selectedSeatIds, onSeatClick }: SeatingMapProps) => {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-6">
          <motion.h1
            className="text-3xl font-bold text-white tracking-wide"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {venue.name}
          </motion.h1>
          <p className="text-purple-100">Select your perfect seat</p>
        </div>

        {/* Legend */}
        <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-700">
          <div className="flex flex-wrap gap-6 text-sm">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-6 h-6 rounded-lg rounded-b-xl bg-gradient-to-br from-emerald-400 to-emerald-500 border-2 border-gray-300 shadow-sm" />
              <span className="text-white font-medium">Available</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-6 h-6 rounded-lg rounded-b-xl bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-gray-300 shadow-lg shadow-blue-500/50" />
              <span className="text-white font-medium">Selected</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-6 h-6 rounded-lg rounded-b-xl bg-gradient-to-br from-amber-400 to-amber-500 border-2 border-gray-300 opacity-60 shadow-sm" />
              <span className="text-gray-400">Reserved</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-6 h-6 rounded-lg rounded-b-xl bg-gradient-to-br from-gray-400 to-gray-500 border-2 border-gray-300 opacity-40 shadow-sm" />
              <span className="text-gray-400">Sold</span>
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg rounded-b-xl bg-gradient-to-br from-emerald-400 to-emerald-500 border-2 border-yellow-400 shadow-sm" />
              <span className="text-yellow-400 font-semibold">VIP $150</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg rounded-b-xl bg-gradient-to-br from-emerald-400 to-emerald-500 border-2 border-gray-300 shadow-sm" />
              <span className="text-gray-300 font-semibold">Premium $100</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg rounded-b-xl bg-gradient-to-br from-emerald-400 to-emerald-500 border-2 border-orange-400 shadow-sm" />
              <span className="text-orange-400 font-semibold">
                Standard $50
              </span>
            </div>
          </div>
        </div>

        {/* Seat Grid - Scrollable */}
        <div className="h-[calc(100vh-400px)] min-h-[600px] overflow-y-auto">
          <SeatGrid
            venue={venue}
            selectedSeatIds={selectedSeatIds}
            onSeatClick={onSeatClick}
          />
        </div>
      </div>
    );
  }
);

SeatingMap.displayName = "SeatingMap";

export default SeatingMap;
