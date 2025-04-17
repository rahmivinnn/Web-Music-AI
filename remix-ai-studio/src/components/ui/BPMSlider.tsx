
import { useState } from 'react';

interface BPMSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const BPMSlider = ({ value, onChange, min = 50, max = 200 }: BPMSliderProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-400">Target BPM</span>
        <span className="text-sm font-medium">{value} BPM</span>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-studio-accent"
        />
        <span className="text-gray-200 text-sm">{max}</span>
      </div>
    </div>
  );
};

export default BPMSlider;
