import { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface VenueControlsProps {
  onSeatCountChange: (count: number) => void;
  isGenerating: boolean;
  currentSeatCount: number;
}

const VenueControls = memo(({ onSeatCountChange, isGenerating, currentSeatCount }: VenueControlsProps) => {
  const [seatCount, setSeatCount] = useState(currentSeatCount);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSeatCount(Number(e.target.value));
  }, []);

  const handleApply = useCallback(() => {
    onSeatCountChange(seatCount);
  }, [seatCount, onSeatCountChange]);

  const presetCounts = [
    { label: 'Small', value: 1635, desc: '~1.6K seats' },
    { label: 'Medium', value: 5000, desc: '5K seats' },
    { label: 'Large', value: 10000, desc: '10K seats' },
    { label: 'Max', value: 15000, desc: '15K seats' }
  ];

  return (
    <motion.div
      className="w-full bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-purple-500/30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-white bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            Venue Configuration
          </h2>
          <p className="text-purple-300 text-sm mt-1">
            Adjust seat count to test performance (max 15,000)
          </p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-black text-white">
            {seatCount.toLocaleString()}
          </div>
          <div className="text-purple-300 text-xs mt-1">Total Seats</div>
        </div>
      </div>

      {/* Slider */}
      <div className="mb-6">
        <input
          type="range"
          min="500"
          max="15000"
          step="100"
          value={seatCount}
          onChange={handleSliderChange}
          disabled={isGenerating}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${((seatCount - 500) / (15000 - 500)) * 100}%, rgb(55, 65, 81) ${((seatCount - 500) / (15000 - 500)) * 100}%, rgb(55, 65, 81) 100%)`
          }}
        />
        <div className="flex justify-between mt-2 text-xs text-purple-300">
          <span>500</span>
          <span>15,000</span>
        </div>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {presetCounts.map(preset => (
          <motion.button
            key={preset.value}
            onClick={() => setSeatCount(preset.value)}
            disabled={isGenerating}
            className={`px-4 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
              seatCount === preset.value
                ? 'bg-purple-600 text-white border-purple-400 shadow-lg'
                : 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:border-purple-500/60'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            whileHover={!isGenerating ? { scale: 1.05 } : {}}
            whileTap={!isGenerating ? { scale: 0.95 } : {}}
          >
            <div>{preset.label}</div>
            <div className="text-xs opacity-70">{preset.desc}</div>
          </motion.button>
        ))}
      </div>

      {/* Apply Button */}
      <motion.button
        onClick={handleApply}
        disabled={isGenerating || seatCount === currentSeatCount}
        className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg rounded-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-purple-500/50 transition-all"
        whileHover={!isGenerating && seatCount !== currentSeatCount ? { scale: 1.02 } : {}}
        whileTap={!isGenerating && seatCount !== currentSeatCount ? { scale: 0.98 } : {}}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center gap-3">
            <motion.div
              className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Generating Venue...
          </div>
        ) : seatCount === currentSeatCount ? (
          'Current Configuration'
        ) : (
          `Apply & Generate ${seatCount.toLocaleString()} Seats`
        )}
      </motion.button>

      {/* Performance Warning */}
      {seatCount > 5000 && (
        <motion.div
          className="mt-4 p-4 bg-amber-900/30 border-2 border-amber-500/50 rounded-xl"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="text-amber-300 font-bold text-sm">Performance Mode Active</div>
              <div className="text-amber-200 text-xs mt-1">
                {seatCount > 10000
                  ? 'Virtualization enabled for optimal rendering of 10K+ seats'
                  : 'Using optimized rendering for smooth 60fps performance'}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});

VenueControls.displayName = 'VenueControls';

export default VenueControls;
