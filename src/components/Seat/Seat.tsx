import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Seat as SeatType } from '../../types/venue';

interface SeatProps {
  seat: SeatType;
  isSelected: boolean;
  onClick: () => void;
  section: string;
  row: string;
}

const Seat = memo(({ seat, isSelected, onClick, section, row }: SeatProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isAvailable = seat.status === 'available';

  const handleClick = () => {
    if (isAvailable) {
      onClick();
    }
  };

  const getColorClass = () => {
    if (isSelected) return 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50';
    if (isHovered && isAvailable) return 'bg-gradient-to-br from-green-400 to-green-500 shadow-md shadow-green-500/50 scale-110';

    switch (seat.status) {
      case 'available':
        return 'bg-gradient-to-br from-emerald-400 to-emerald-500 hover:shadow-md';
      case 'reserved':
        return 'bg-gradient-to-br from-amber-400 to-amber-500 opacity-60';
      case 'sold':
        return 'bg-gradient-to-br from-gray-400 to-gray-500 opacity-40';
      case 'held':
        return 'bg-gradient-to-br from-purple-400 to-purple-500 opacity-60';
    }
  };

  const getPriceColor = () => {
    switch (seat.priceTier) {
      case 1: return 'border-yellow-400';
      case 2: return 'border-gray-300';
      case 3: return 'border-orange-400';
    }
  };

  return (
    <motion.div
      className={`relative ${isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={isAvailable ? { scale: 1.15, zIndex: 10 } : {}}
      whileTap={isAvailable ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      role="button"
      aria-label={`${section} ${row} Seat ${seat.col}, ${seat.status}, $${seat.priceTier === 1 ? '150' : seat.priceTier === 2 ? '100' : '50'}`}
      aria-pressed={isSelected}
      tabIndex={isAvailable ? 0 : -1}
    >
      {/* Seat body */}
      <div className={`
        w-7 h-7 rounded-lg rounded-b-xl
        ${getColorClass()}
        border-2 ${getPriceColor()}
        transition-all duration-200
        flex items-center justify-center
        shadow-sm
        ${isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-blue-600' : ''}
      `}>
        {/* Seat cushion detail */}
        <div className="w-5 h-3 rounded-t-md bg-white/20" />
      </div>

      {/* Seat number on hover or selected */}
      {(isHovered || isSelected) && isAvailable && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-50 shadow-xl"
        >
          <div className="font-semibold">Seat {seat.col}</div>
          <div className="text-gray-300 text-[10px]">${seat.priceTier === 1 ? '150' : seat.priceTier === 2 ? '100' : '50'}</div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
        </motion.div>
      )}
    </motion.div>
  );
});

Seat.displayName = 'Seat';

export default Seat;
