
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface VoiceSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const VoiceSelect = ({ value, onChange }: VoiceSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const voices = [
    'Male Pop',
    'Female RnB',
    'Robotic',
    'Soft Lofi',
    'Anime Style',
    'Auto Harmony'
  ];

  // Group voices by gender for better organization
  const voicesByGender = {
    male: ['Male Pop'],
    female: ['Female RnB', 'Soft Lofi', 'Anime Style'],
    neutral: ['Robotic', 'Auto Harmony']
  };

  useEffect(() => {
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

  const handleSelect = (voice: string) => {
    onChange(voice);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="flex items-center justify-between p-3 bg-studio-card border border-gray-700 rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || 'Select Voice'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="dropdown-content max-h-60 overflow-y-auto bg-studio-card border border-gray-700 rounded-md mt-1">
          {/* Male voices */}
          <div className="p-2 text-xs text-gray-400 border-b border-gray-700">Male Voices</div>
          {voicesByGender.male.map((voice) => (
            <div
              key={voice}
              className={`p-3 cursor-pointer hover:bg-gray-700 ${voice === value ? 'bg-studio-accent bg-opacity-10 text-studio-accent' : ''}`}
              onClick={() => handleSelect(voice)}
            >
              {voice}
            </div>
          ))}

          {/* Female voices */}
          <div className="p-2 text-xs text-gray-400 border-b border-gray-700">Female Voices</div>
          {voicesByGender.female.map((voice) => (
            <div
              key={voice}
              className={`p-3 cursor-pointer hover:bg-gray-700 ${voice === value ? 'bg-studio-accent bg-opacity-10 text-studio-accent' : ''}`}
              onClick={() => handleSelect(voice)}
            >
              {voice}
            </div>
          ))}

          {/* Neutral voices */}
          <div className="p-2 text-xs text-gray-400 border-b border-gray-700">Special Voices</div>
          {voicesByGender.neutral.map((voice) => (
            <div
              key={voice}
              className={`p-3 cursor-pointer hover:bg-gray-700 ${voice === value ? 'bg-studio-accent bg-opacity-10 text-studio-accent' : ''}`}
              onClick={() => handleSelect(voice)}
            >
              {voice}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceSelect;
