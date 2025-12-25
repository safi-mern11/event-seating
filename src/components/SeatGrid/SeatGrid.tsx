import { memo, useMemo } from 'react';
import Seat from '../Seat/Seat';
import type { Venue, Seat as SeatType } from '../../types/venue';

interface SeatGridProps {
  venue: Venue;
  selectedSeatIds: string[];
  onSeatClick: (seat: SeatType, section: string, row: string) => void;
}

const SeatGrid = memo(({ venue, selectedSeatIds, onSeatClick }: SeatGridProps) => {
  const selectedSet = useMemo(() => new Set(selectedSeatIds), [selectedSeatIds]);

  const allSeats = useMemo(() => {
    const seats: Array<{ seat: SeatType; section: string; row: string }> = [];

    venue.sections.forEach(section => {
      section.rows.forEach(row => {
        row.seats.forEach(seat => {
          seats.push({ seat, section: section.name, row: row.id });
        });
      });
    });

    return seats;
  }, [venue]);

  return (
    <svg
      width={venue.map.width}
      height={venue.map.height}
      viewBox={`0 0 ${venue.map.width} ${venue.map.height}`}
      className="w-full h-auto border border-gray-300 bg-white"
      aria-label={`Seating map for ${venue.name}`}
    >
      {allSeats.map(({ seat, section, row }) => (
        <Seat
          key={seat.id}
          seat={seat}
          isSelected={selectedSet.has(seat.id)}
          onClick={() => onSeatClick(seat, section, row)}
          section={section}
          row={row}
        />
      ))}
    </svg>
  );
});

SeatGrid.displayName = 'SeatGrid';

export default SeatGrid;
