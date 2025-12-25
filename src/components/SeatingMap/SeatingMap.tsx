import { memo, useState } from 'react';
import SeatGrid from '../SeatGrid/SeatGrid';
import type { Venue, Seat } from '../../types/venue';

interface SeatingMapProps {
  venue: Venue;
  selectedSeatIds: string[];
  onSeatClick: (seat: Seat, section: string, row: string) => void;
}

const SeatingMap = memo(({ venue, selectedSeatIds, onSeatClick }: SeatingMapProps) => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => setZoom(1);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{venue.name}</h1>
        <div className="flex gap-2">
          <button
            onClick={handleZoomOut}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors text-sm font-medium"
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors text-sm font-medium"
            aria-label="Reset zoom"
          >
            Reset
          </button>
          <button
            onClick={handleZoomIn}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors text-sm font-medium"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500" />
          <span className="text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <span className="text-gray-700">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500" />
          <span className="text-gray-700">Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500" />
          <span className="text-gray-700">Sold</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-purple-500" />
          <span className="text-gray-700">On Hold</span>
        </div>
      </div>

      <div className="overflow-auto border border-gray-300 rounded-lg" style={{ maxHeight: '70vh' }}>
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.2s' }}>
          <SeatGrid
            venue={venue}
            selectedSeatIds={selectedSeatIds}
            onSeatClick={onSeatClick}
          />
        </div>
      </div>
    </div>
  );
});

SeatingMap.displayName = 'SeatingMap';

export default SeatingMap;
