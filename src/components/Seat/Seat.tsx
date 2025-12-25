import { memo } from 'react';
import type { Seat as SeatType } from '../../types/venue';

interface SeatProps {
  seat: SeatType;
  isSelected: boolean;
  onClick: () => void;
  section: string;
  row: string;
}

const SEAT_COLORS = {
  available: '#10b981',
  reserved: '#f59e0b',
  sold: '#ef4444',
  held: '#8b5cf6',
};

const Seat = memo(({ seat, isSelected, onClick, section, row }: SeatProps) => {
  const isAvailable = seat.status === 'available';
  const fillColor = isSelected ? '#3b82f6' : SEAT_COLORS[seat.status];
  const cursor = isAvailable ? 'pointer' : 'not-allowed';

  const handleClick = () => {
    if (isAvailable) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isAvailable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <circle
      cx={seat.x}
      cy={seat.y}
      r={4}
      fill={fillColor}
      stroke={isSelected ? '#1d4ed8' : 'none'}
      strokeWidth={isSelected ? 1.5 : 0}
      style={{ cursor }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isAvailable ? 0 : -1}
      role="button"
      aria-label={`${section} ${row} Seat ${seat.col}, ${seat.status}, $${seat.priceTier === 1 ? '150' : seat.priceTier === 2 ? '100' : '50'}`}
      aria-pressed={isSelected}
      data-seat-id={seat.id}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    />
  );
});

Seat.displayName = 'Seat';

export default Seat;
