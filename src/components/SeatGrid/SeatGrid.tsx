import { memo, useMemo, useRef, useEffect, useState } from 'react';
import { FixedSizeGrid } from 'react-window';
import Seat from '../Seat/Seat';
import type { Venue, Seat as SeatType } from '../../types/venue';

interface SeatGridProps {
  venue: Venue;
  selectedSeatIds: string[];
  onSeatClick: (seat: SeatType, section: string, row: string) => void;
}

interface GridItem {
  seat: SeatType;
  section: string;
  row: string;
}

const SEAT_SIZE = 36;
const SEAT_GAP = 8;
const TOTAL_CELL_SIZE = SEAT_SIZE + SEAT_GAP;

const SeatGrid = memo(({ venue, selectedSeatIds, onSeatClick }: SeatGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 800 });
  const selectedSet = useMemo(() => new Set(selectedSeatIds), [selectedSeatIds]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const seatGrid = useMemo(() => {
    const grid: GridItem[][] = [];
    let maxCols = 0;

    venue.sections.forEach(section => {
      section.rows.forEach(row => {
        maxCols = Math.max(maxCols, row.seats.length);
      });
    });

    venue.sections.forEach(section => {
      section.rows.forEach(row => {
        const gridRow: GridItem[] = row.seats.map(seat => ({
          seat,
          section: section.name,
          row: row.id
        }));
        grid.push(gridRow);
      });
    });

    return { grid, maxCols, rowCount: grid.length };
  }, [venue]);

  const Cell = ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
    const item = seatGrid.grid[rowIndex]?.[columnIndex];

    if (!item) {
      return <div style={style} />;
    }

    return (
      <div style={style} className="flex items-center justify-center p-1">
        <Seat
          seat={item.seat}
          isSelected={selectedSet.has(item.seat.id)}
          onClick={() => onSeatClick(item.seat, item.section, item.row)}
          section={item.section}
          row={item.row}
        />
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-xl overflow-hidden">
      {/* Stage */}
      <div className="w-full py-8 bg-gradient-to-b from-purple-600/30 to-transparent border-b-4 border-purple-500/50 mb-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 h-16 rounded-lg shadow-2xl shadow-purple-500/50 flex items-center justify-center">
            <span className="text-white font-bold text-2xl tracking-wider">STAGE</span>
          </div>
        </div>
      </div>

      {/* Section Labels */}
      <div className="grid grid-cols-2 gap-8 px-8 mb-6">
        {venue.sections.map(section => (
          <div key={section.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
            <div className="text-white font-semibold text-lg">{section.name}</div>
            <div className="text-gray-400 text-sm">{section.rows.length} rows</div>
          </div>
        ))}
      </div>

      {/* Virtualized Seat Grid */}
      <div className="px-4">
        <FixedSizeGrid
          columnCount={seatGrid.maxCols}
          columnWidth={TOTAL_CELL_SIZE}
          height={containerSize.height - 250}
          rowCount={seatGrid.rowCount}
          rowHeight={TOTAL_CELL_SIZE}
          width={containerSize.width - 40}
          className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
        >
          {Cell}
        </FixedSizeGrid>
      </div>
    </div>
  );
});

SeatGrid.displayName = 'SeatGrid';

export default SeatGrid;
