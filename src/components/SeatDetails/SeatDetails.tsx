import { memo } from 'react';
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
  available: 'text-green-600 bg-green-50',
  reserved: 'text-amber-600 bg-amber-50',
  sold: 'text-red-600 bg-red-50',
  held: 'text-purple-600 bg-purple-50',
};

const SeatDetails = memo(({ seat, section, row }: SeatDetailsProps) => {
  if (!seat) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Seat Details</h2>
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm">Click on a seat to view details</p>
        </div>
      </div>
    );
  }

  const price = getPriceForTier(seat.priceTier);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Seat Details</h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Section</label>
          <div className="text-lg font-semibold text-gray-800">{section || 'N/A'}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Row</label>
            <div className="text-lg font-semibold text-gray-800">
              {row ? row.split('-R')[1] : 'N/A'}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Seat</label>
            <div className="text-lg font-semibold text-gray-800">{seat.col}</div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Price</label>
          <div className="text-2xl font-bold text-blue-600">{formatPrice(price)}</div>
          <div className="text-xs text-gray-500 mt-1">Price Tier {seat.priceTier}</div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Status</label>
          <div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[seat.status]}`}>
              {STATUS_LABELS[seat.status]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

SeatDetails.displayName = 'SeatDetails';

export default SeatDetails;
