
import { useState } from 'react';

interface StyleChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const StyleChip = ({ label, selected, onClick }: StyleChipProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
        selected 
          ? 'bg-studio-accent text-white' 
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
};

export default StyleChip;
