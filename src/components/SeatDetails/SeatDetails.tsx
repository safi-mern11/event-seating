import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Seat, SeatStatus } from '../../types/venue';
import { formatPrice, getPriceForTier } from '../../utils/pricing';

interface SeatDetailsProps {
  seat: Seat | null;
  section?: string;
  row?: string;
}

const STATUS_LABELS: Record<SeatStatus, string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
  held: 'On Hold',
};

const STATUS_COLORS: Record<SeatStatus, string> = {
  available: 'from-emerald-500 to-green-600',
  reserved: 'from-amber-500 to-orange-600',
  sold: 'from-gray-500 to-gray-600',
  held: 'from-purple-500 to-purple-600',
};

const SeatDetails = memo(({ seat, section, row }: SeatDetailsProps) => {
  if (!seat) {
    return (
      <motion.div
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
          <h2 className="text-2xl font-bold text-white">Seat Details</h2>
        </div>
        <div className="text-center py-16 px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Select a Seat</h3>
          <p className="text-gray-500 text-sm">Click on any seat to view its details</p>
        </div>
      </motion.div>
    );
  }

  const price = getPriceForTier(seat.priceTier);
  const tierName = seat.priceTier === 1 ? 'VIP' : seat.priceTier === 2 ? 'Premium' : 'Standard';

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      key={seat.id}
    >
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
        <h2 className="text-2xl font-bold text-white">Seat Details</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Seat Visual */}
        <div className="flex justify-center">
          <motion.div
            className="w-24 h-24 rounded-2xl rounded-b-3xl bg-gradient-to-br from-emerald-400 to-emerald-500 border-4 border-yellow-400 shadow-2xl flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="w-16 h-10 rounded-t-xl bg-white/30" />
          </motion.div>
        </div>

        {/* Section Info */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 rounded-xl p-4 border border-gray-700">
          <label className="text-sm font-medium text-gray-400 block mb-2">Section</label>
          <div className="text-2xl font-bold text-white">{section || 'N/A'}</div>
        </div>

        {/* Row & Seat */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 rounded-xl p-4 border border-gray-700">
            <label className="text-sm font-medium text-gray-400 block mb-2">Row</label>
            <div className="text-xl font-bold text-white">
              {row ? row.split('-R')[1] : 'N/A'}
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 rounded-xl p-4 border border-gray-700">
            <label className="text-sm font-medium text-gray-400 block mb-2">Seat</label>
            <div className="text-xl font-bold text-white">{seat.col}</div>
          </div>
        </div>

        {/* Price */}
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/50">
          <label className="text-sm font-medium text-purple-300 block mb-2">Price</label>
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {formatPrice(price)}
          </div>
          <div className="text-sm text-purple-300 mt-1">{tierName} Tier</div>
        </div>

        {/* Status */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 rounded-xl p-4 border border-gray-700">
          <label className="text-sm font-medium text-gray-400 block mb-2">Status</label>
          <div>
            <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r ${STATUS_COLORS[seat.status]} shadow-lg`}>
              {STATUS_LABELS[seat.status]}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

SeatDetails.displayName = 'SeatDetails';

export default SeatDetails;
