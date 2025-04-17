
import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { genresData } from '@/data/genres-data';

interface GenreSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const GenreSelect = ({ value, onChange }: GenreSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [effectTooltip, setEffectTooltip] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedGenre = genresData.find(genre => genre.label === value) || genresData[0];

  const handleSelectGenre = (genre: string) => {
    onChange(genre);
    setIsOpen(false);
  };

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-left flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col">
          <span className="text-white">{selectedGenre.label}</span>
          <span className="text-xs text-gray-400">{selectedGenre.effect}</span>
        </div>
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="dropdown-content max-h-60 overflow-y-auto">
          <div className="p-2">
            <input 
              type="text" 
              className="w-full bg-gray-700 border border-gray-600 rounded text-sm p-2 mb-2 focus:outline-none focus:border-studio-accent"
              placeholder="Search genre..."
              autoFocus
            />
            {genresData.map((genre, index) => (
              <div 
                key={index} 
                className={`p-2 rounded hover:bg-gray-700 cursor-pointer transition-colors ${
                  genre.label === value ? 'bg-studio-accent/10 text-studio-accent' : ''
                }`}
                onClick={() => handleSelectGenre(genre.label)}
                onMouseEnter={() => setEffectTooltip(genre.effect)}
                onMouseLeave={() => setEffectTooltip('')}
              >
                <div className="flex flex-col">
                  <span>{genre.label}</span>
                  <span className="text-xs text-gray-400">{genre.effect}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {effectTooltip && !isOpen && (
        <div className="absolute left-0 right-0 bottom-full mb-2 p-2 bg-gray-800 rounded text-xs text-gray-300 z-10">
          {effectTooltip}
        </div>
      )}
    </div>
  );
};

export default GenreSelect;
