import { memo, useMemo } from 'react';
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Selection</h2>
        {hasSelection && (
          <button
            onClick={onClear}
            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            aria-label="Clear all selected seats"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Selected: {selectedSeats.length} / {maxSelection}</span>
          <span className="text-blue-600 font-medium">{remainingSlots} remaining</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(selectedSeats.length / maxSelection) * 100}%` }}
          />
        </div>
      </div>

      {hasSelection ? (
        <>
          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
            {selectedSeats.map(seat => (
              <div
                key={seat.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{seat.section}</div>
                  <div className="text-sm text-gray-600">
                    Row {seat.row.split('-R')[1]}, Seat {seat.col}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">
                    {formatPrice(seat.priceTier === 1 ? 150 : seat.priceTier === 2 ? 100 : 50)}
                  </div>
                  <div className="text-xs text-gray-500">Tier {seat.priceTier}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-800">Subtotal</span>
              <span className="text-2xl font-bold text-blue-600">{formatPrice(total)}</span>
            </div>
          </div>

          <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg">
            Proceed to Checkout
          </button>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          </svg>
          <p className="text-sm">No seats selected</p>
          <p className="text-xs mt-1">Click on available seats to start</p>
        </div>
      )}
    </div>
  );
});

SelectionSummary.displayName = 'SelectionSummary';

export default SelectionSummary;
