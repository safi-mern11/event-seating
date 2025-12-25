import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SelectedSeat } from '../../types/venue';
import { calculateTotal, formatPrice } from '../../utils/pricing';

interface SelectionSummaryProps {
  selectedSeats: SelectedSeat[];
  remainingSlots: number;
  maxSelection: number;
  onClear: () => void;
}

const SelectionSummary = memo(({ selectedSeats, remainingSlots, maxSelection, onClear }: SelectionSummaryProps) => {
  const total = useMemo(() => {
    const tiers = selectedSeats.map(seat => seat.priceTier);
    return calculateTotal(tiers);
  }, [selectedSeats]);

  const hasSelection = selectedSeats.length > 0;

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Your Cart</h2>
          {hasSelection && (
            <motion.button
              onClick={onClear}
              className="text-sm text-white/90 hover:text-white font-medium transition-colors bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear All
            </motion.button>
          )}
        </div>
      </div>

      {/* Selection Progress */}
      <div className="p-6 bg-gray-800/30">
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-gray-300 font-medium">
            {selectedSeats.length} of {maxSelection} seats selected
          </span>
          <motion.span
            className="text-blue-400 font-bold"
            key={remainingSlots}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
          >
            {remainingSlots} remaining
          </motion.span>
        </div>
        <div className="relative w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(selectedSeats.length / maxSelection) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {hasSelection ? (
        <>
          {/* Selected Seats List */}
          <div className="px-6 py-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            <AnimatePresence>
              {selectedSeats.map((seat, index) => (
                <motion.div
                  key={seat.id}
                  className="mb-3 p-4 bg-gradient-to-r from-gray-800/50 to-gray-800/30 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg rounded-b-xl bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-blue-400 shadow-lg flex items-center justify-center">
                          <div className="w-6 h-3 rounded-t-md bg-white/30" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{seat.section}</div>
                          <div className="text-sm text-gray-400">
                            Row {seat.row.split('-R')[1]}, Seat {seat.col}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-blue-400">
                        {formatPrice(seat.priceTier === 1 ? 150 : seat.priceTier === 2 ? 100 : 50)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {seat.priceTier === 1 ? 'VIP' : seat.priceTier === 2 ? 'Premium' : 'Standard'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Total and Checkout */}
          <div className="p-6 bg-gradient-to-r from-gray-800/50 to-gray-800/30 border-t border-gray-700">
            <motion.div
              className="flex items-center justify-between mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-xl font-bold text-white">Total</span>
              <motion.span
                className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                key={total}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {formatPrice(total)}
              </motion.span>
            </motion.div>

            <motion.button
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Proceed to Checkout
              </span>
            </motion.button>
          </div>
        </>
      ) : (
        <div className="text-center py-16 px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No seats selected</h3>
          <p className="text-gray-500 text-sm">Click on available seats to add them to your cart</p>
        </div>
      )}
    </motion.div>
  );
});

SelectionSummary.displayName = 'SelectionSummary';

export default SelectionSummary;
