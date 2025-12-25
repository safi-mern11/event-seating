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

  const getChairColor = () => {
    if (isSelected) return { seat: '#3B82F6', back: '#2563EB', base: '#1E40AF' };
    if (isHovered && isAvailable) return { seat: '#34D399', back: '#10B981', base: '#059669' };

    switch (seat.status) {
      case 'available':
        return { seat: '#10B981', back: '#059669', base: '#047857' };
      case 'reserved':
        return { seat: '#F59E0B', back: '#D97706', base: '#B45309' };
      case 'sold':
        return { seat: '#6B7280', back: '#4B5563', base: '#374151' };
      case 'held':
        return { seat: '#A855F7', back: '#9333EA', base: '#7E22CE' };
    }
  };

  const getBorderColor = () => {
    switch (seat.priceTier) {
      case 1: return '#EAB308'; // Gold
      case 2: return '#E5E7EB'; // Silver
      case 3: return '#FB923C'; // Bronze
    }
  };

  const colors = getChairColor();
  const borderColor = getBorderColor();

  return (
    <motion.div
      className={`relative flex items-center justify-center ${isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={isAvailable ? { scale: 1.2, zIndex: 50 } : {}}
      whileTap={isAvailable ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      role="button"
      aria-label={`${section} ${row} Seat ${seat.col}, ${seat.status}, $${seat.priceTier === 1 ? '150' : seat.priceTier === 2 ? '100' : '50'}`}
      aria-pressed={isSelected}
      tabIndex={isAvailable ? 0 : -1}
    >
      {/* Theater Chair SVG */}
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        className={`${isSelected ? 'drop-shadow-2xl' : 'drop-shadow-lg'} transition-all duration-200`}
        style={{
          filter: isSelected ? 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))' : undefined
        }}
      >
        {/* Chair Base */}
        <rect
          x="10"
          y="38"
          width="30"
          height="8"
          rx="2"
          fill={colors.base}
          stroke={borderColor}
          strokeWidth="1.5"
        />

        {/* Left Armrest */}
        <path
          d="M 8 20 L 8 38 L 12 38 L 12 24 C 12 21 10 20 8 20 Z"
          fill={colors.back}
          stroke={borderColor}
          strokeWidth="1.5"
        />

        {/* Right Armrest */}
        <path
          d="M 42 20 L 42 38 L 38 38 L 38 24 C 38 21 40 20 42 20 Z"
          fill={colors.back}
          stroke={borderColor}
          strokeWidth="1.5"
        />

        {/* Seat Cushion */}
        <ellipse
          cx="25"
          cy="28"
          rx="13"
          ry="10"
          fill={colors.seat}
          stroke={borderColor}
          strokeWidth="2"
        />

        {/* Seat Cushion Highlight */}
        <ellipse
          cx="25"
          cy="26"
          rx="10"
          ry="6"
          fill="url(#seatGradient)"
          opacity="0.4"
        />

        {/* Backrest */}
        <rect
          x="14"
          y="8"
          width="22"
          height="15"
          rx="8"
          fill={colors.back}
          stroke={borderColor}
          strokeWidth="2"
        />

        {/* Backrest Padding */}
        <rect
          x="17"
          y="10"
          width="16"
          height="11"
          rx="6"
          fill="url(#backGradient)"
          opacity="0.3"
        />

        {/* Seat Number Badge (on hover or selected) */}
        {(isHovered || isSelected) && isAvailable && (
          <g>
            <circle cx="25" cy="28" r="8" fill="rgba(0,0,0,0.8)" />
            <text
              x="25"
              y="32"
              textAnchor="middle"
              fill="white"
              fontSize="10"
              fontWeight="bold"
            >
              {seat.col}
            </text>
          </g>
        )}

        {/* Gradients */}
        <defs>
          <linearGradient id="seatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="backGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Tooltip on Hover */}
      {(isHovered || isSelected) && isAvailable && (
        <motion.div
          initial={{ opacity: 0, y: -5, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs whitespace-nowrap z-[100] shadow-2xl border-2 border-purple-500"
        >
          <div className="font-bold text-sm">Seat {seat.col}</div>
          <div className="text-purple-300">
            ${seat.priceTier === 1 ? '150' : seat.priceTier === 2 ? '100' : '50'}
            <span className="text-gray-400 ml-1">
              {seat.priceTier === 1 ? 'VIP' : seat.priceTier === 2 ? 'Premium' : 'Standard'}
            </span>
          </div>
          {/* Tooltip Arrow */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-gray-900 border-r-2 border-b-2 border-purple-500" />
        </motion.div>
      )}
    </motion.div>
  );
});

Seat.displayName = 'Seat';

export default Seat;
