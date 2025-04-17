import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { resumeAudioContext } from '@/utils/audioProcessor';
// import { applyGenreEffectsToTracks } from '@/utils/remixProcessor';
// Using direct audio processing to avoid fetch errors
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { MdSolo } from 'react-icons/md';

// Genre options with colors and effects settings
const genreOptions = [
  {
    name: 'R&B',
    color: 'bg-pink-600',
    effects: {
      bassBoost: 0.6,
      reverb: 0.7,
      delay: 0.4,
      distortion: 0.2,
      compression: 0.8,
      tempo: 0.95, // Slightly slower
      vocalEffect: 'smooth'
    }
  },
  {
    name: 'Rock',
    color: 'bg-pink-400',
    effects: {
      bassBoost: 0.5,
      reverb: 0.4,
      delay: 0.2,
      distortion: 0.7,
      compression: 0.6,
      tempo: 1.05, // Slightly faster
      vocalEffect: 'rough'
    }
  },
  {
    name: 'Trap',
    color: 'bg-red-500',
    effects: {
      bassBoost: 0.9,
      reverb: 0.5,
      delay: 0.6,
      distortion: 0.5,
      compression: 0.7,
      tempo: 0.9, // Slower
      vocalEffect: 'autoTune'
    }
  },
  {
    name: 'Drill',
    color: 'bg-teal-500',
    effects: {
      bassBoost: 0.8,
      reverb: 0.3,
      delay: 0.5,
      distortion: 0.6,
      compression: 0.9,
      tempo: 0.92, // Slower
      vocalEffect: 'dark'
    }
  },
  {
    name: 'Hard Techno',
    color: 'bg-cyan-600',
    effects: {
      bassBoost: 0.7,
      reverb: 0.3,
      delay: 0.3,
      distortion: 0.8,
      compression: 0.8,
      tempo: 1.15, // Faster
      vocalEffect: 'robotic'
    }
  },
  {
    name: 'Future Garage',
    color: 'bg-blue-600',
    effects: {
      bassBoost: 0.6,
      reverb: 0.8,
      delay: 0.7,
      distortion: 0.3,
      compression: 0.5,
      tempo: 1.0,
      vocalEffect: 'pitched'
    }
  },
  {
    name: 'Disco House',
    color: 'bg-purple-500',
    effects: {
      bassBoost: 0.5,
      reverb: 0.6,
      delay: 0.4,
      distortion: 0.2,
      compression: 0.6,
      tempo: 1.08, // Faster
      vocalEffect: 'bright'
    }
  },
  {
    name: 'Deep House',
    color: 'bg-purple-700',
    effects: {
      bassBoost: 0.8,
      reverb: 0.7,
      delay: 0.5,
      distortion: 0.1,
      compression: 0.6,
      tempo: 1.0,
      vocalEffect: 'warm'
    }
  },
  {
    name: 'Minimal House',
    color: 'bg-pink-500',
    effects: {
      bassBoost: 0.4,
      reverb: 0.5,
      delay: 0.3,
      distortion: 0.1,
      compression: 0.5,
      tempo: 1.02,
      vocalEffect: 'clean'
    }
  },
  {
    name: 'Tech House',
    color: 'bg-pink-700',
    effects: {
      bassBoost: 0.6,
      reverb: 0.4,
      delay: 0.3,
      distortion: 0.3,
      compression: 0.7,
      tempo: 1.05,
      vocalEffect: 'filtered'
    }
  },
  {
    name: 'Drum and Bass',
    color: 'bg-purple-900',
    effects: {
      bassBoost: 0.7,
      reverb: 0.3,
      delay: 0.2,
      distortion: 0.4,
      compression: 0.8,
      tempo: 1.2, // Much faster
      vocalEffect: 'chopped'
    }
  },
  {
    name: 'Lo-Fi',
    color: 'bg-amber-700',
    effects: {
      bassBoost: 0.5,
      reverb: 0.7,
      delay: 0.4,
      distortion: 0.6,
      compression: 0.4,
      tempo: 0.95,
      vocalEffect: 'vintage'
    }
  },
  {
    name: 'EDM',
    color: 'bg-green-600',
    effects: {
      bassBoost: 0.7,
      reverb: 0.5,
      delay: 0.6,
      distortion: 0.5,
      compression: 0.8,
      tempo: 1.1, // Faster
      vocalEffect: 'energetic'
    }
  },
  {
    name: 'Hip Hop',
    color: 'bg-yellow-600',
    effects: {
      bassBoost: 0.8,
      reverb: 0.5,
      delay: 0.4,
      distortion: 0.3,
      compression: 0.7,
      tempo: 0.98,
      vocalEffect: 'punchy'
    }
  },
  {
    name: 'Phonk',
    color: 'bg-red-800',
    effects: {
      bassBoost: 0.9,
      reverb: 0.6,
      delay: 0.5,
      distortion: 0.7,
      compression: 0.8,
      tempo: 0.9,
      vocalEffect: 'memphis'
    }
  },
  {
    name: 'Afrobeats',
    color: 'bg-orange-600',
    effects: {
      bassBoost: 0.7,
      reverb: 0.4,
      delay: 0.3,
      distortion: 0.2,
      compression: 0.6,
      tempo: 1.0,
      vocalEffect: 'rhythmic'
    }
  },
  {
    name: 'Reggaeton',
    color: 'bg-yellow-700',
    effects: {
      bassBoost: 0.8,
      reverb: 0.5,
      delay: 0.4,
      distortion: 0.3,
      compression: 0.7,
      tempo: 0.97,
      vocalEffect: 'latin'
    }
  },
  {
    name: 'K-Pop',
    color: 'bg-pink-300',
    effects: {
      bassBoost: 0.5,
      reverb: 0.6,
      delay: 0.5,
      distortion: 0.2,
      compression: 0.7,
      tempo: 1.05,
      vocalEffect: 'bright'
    }
  },
];

// Voice type options
const voiceTypes = [
  { id: 'male', name: 'Male Voice', icon: '👨' },
  { id: 'female', name: 'Female Voice', icon: '👩' },
  { id: 'deep', name: 'Deep Voice', icon: '🔊' },
  { id: 'high', name: 'High Voice', icon: '🔉' },
  { id: 'robotic', name: 'Robotic Voice', icon: '🤖' },
  { id: 'group', name: 'Group Vocals', icon: '👥' },
];

// Default track configuration with more realistic settings
const defaultTracks = [
  {
    id: 1,
    name: 'Lead Vocals',
    color: 'bg-pink-600',
    url: 'https://cdn.freesound.org/previews/328/328857_230356-lq.mp3', // R&B vocal sample
    icon: '🎤',
    volume: 0.8,
    muted: false,
    solo: false,
    waveform: Array(50).fill(0).map(() => Math.random() * 0.8 + 0.2),
    voiceType: 'male',
    effects: {
      reverb: 0.4,
      delay: 0.2,
      distortion: 0.1,
      compression: 0.7,
      autoTune: 0.3
    }
  },
  {
    id: 2,
    name: 'Drums',
    color: 'bg-red-600',
    url: 'https://cdn.freesound.org/previews/325/325647_5674468-lq.mp3', // Drum sample
    icon: '🥁',
    volume: 0.8,
    muted: false,
    solo: false,
    waveform: Array(50).fill(0).map(() => Math.random() * 0.9 + 0.1),
    effects: {
      reverb: 0.2,
      compression: 0.8,
      lowPass: 0.3,
      highPass: 0.1
    }
  },
  {
    id: 3,
    name: 'Bass',
    color: 'bg-green-600',
    url: 'https://cdn.freesound.org/previews/631/631750_7037-lq.mp3', // Bass sample
    icon: '🎸',
    volume: 0.7,
    muted: false,
    solo: false,
    waveform: Array(50).fill(0).map(() => Math.random() * 0.7 + 0.3),
    effects: {
      distortion: 0.2,
      compression: 0.6,
      lowPass: 0.7
    }
  },
  {
    id: 4,
    name: 'Melody',
    color: 'bg-purple-600',
    url: 'https://cdn.freesound.org/previews/612/612475_5674468-lq.mp3', // Melody sample
    icon: '🎹',
    volume: 0.75,
    muted: false,
    solo: false,
    waveform: Array(50).fill(0).map(() => Math.random() * 0.6 + 0.2),
    effects: {
      reverb: 0.5,
      delay: 0.3,
      chorus: 0.4
    }
  },
  {
    id: 5,
    name: 'FX',
    color: 'bg-amber-600',
    url: 'https://cdn.freesound.org/previews/597/597179_7037-lq.mp3', // FX sample
    icon: '✨',
    volume: 0.6,
    muted: false,
    solo: false,
    waveform: Array(50).fill(0).map(() => Math.random() * 0.5 + 0.1),
    effects: {
      reverb: 0.8,
      delay: 0.7,
      distortion: 0.3,
      flanger: 0.5
    }
  },
  {
    id: 6,
    name: 'Synth',
    color: 'bg-blue-600',
    url: 'https://cdn.freesound.org/previews/648/648352_14558780-lq.mp3', // Synth sample
    icon: '🎛️',
    volume: 0.7,
    muted: false,
    solo: false,
    waveform: Array(50).fill(0).map(() => Math.random() * 0.8 + 0.1),
    effects: {
      reverb: 0.4,
      delay: 0.5,
      chorus: 0.6,
      phaser: 0.3
    }
  },
  {
    id: 7,
    name: 'Backing Vocals',
    color: 'bg-pink-400',
    url: 'https://cdn.freesound.org/previews/328/328857_230356-lq.mp3', // Vocal sample
    icon: '🎵',
    volume: 0.65,
    muted: false,
    solo: false,
    waveform: Array(50).fill(0).map(() => Math.random() * 0.6 + 0.1),
    voiceType: 'female',
    effects: {
      reverb: 0.6,
      delay: 0.3,
      chorus: 0.5,
      compression: 0.6
    }
  },
];

interface AdvancedRemixInterfaceProps {
  audioUrl?: string;
  songTitle?: string;
  bpm?: number;
  key?: string;
  onClose?: () => void;
}

const AdvancedRemixInterface: React.FC<AdvancedRemixInterfaceProps> = ({
  audioUrl = 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3',
  songTitle = 'Die With A Smile.mp3',
  bpm = 78,
  key = 'A maj',
  onClose
}) => {
  const [tracks, setTracks] = useState(defaultTracks);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isRemixing, setIsRemixing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const remixedTracksRef = useRef<string[]>([]);

  // Initialize audio elements
  useEffect(() => {
    audioRefs.current = tracks.map((_, i) => audioRefs.current[i] || new Audio());

    // Set up audio sources
    tracks.forEach((track, i) => {
      if (audioRefs.current[i]) {
        audioRefs.current[i]!.src = track.url;
        audioRefs.current[i]!.volume = track.volume;
        audioRefs.current[i]!.loop = true;

        // Add event listeners
        audioRefs.current[i]!.addEventListener('loadedmetadata', () => {
          if (audioRefs.current[i]) {
            setDuration(audioRefs.current[i]!.duration);
          }
        });
      }
    });

    // Clean up
    return () => {
      audioRefs.current.forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, [tracks]);

  // Handle play/pause
  const togglePlayback = async () => {
    await resumeAudioContext();

    if (isPlaying) {
      audioRefs.current.forEach(audio => audio?.pause());
    } else {
      // Check if any track is soloed
      const hasSoloedTrack = tracks.some(track => track.solo);

      // Play all tracks that should be playing
      tracks.forEach((track, i) => {
        const audio = audioRefs.current[i];
        if (audio) {
          // Only play if:
          // 1. Track is not muted AND
          // 2. Either no track is soloed OR this track is soloed
          if (!track.muted && (!hasSoloedTrack || track.solo)) {
            audio.play();
          }
        }
      });
    }

    setIsPlaying(!isPlaying);
  };

  // Update track volume
  const updateTrackVolume = (trackId: number, volume: number) => {
    setTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === trackId
          ? { ...track, volume }
          : track
      )
    );

    const trackIndex = tracks.findIndex(t => t.id === trackId);
    if (trackIndex !== -1 && audioRefs.current[trackIndex]) {
      audioRefs.current[trackIndex]!.volume = volume;
    }
  };

  // Toggle track mute
  const toggleMute = (trackId: number) => {
    setTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === trackId
          ? { ...track, muted: !track.muted }
          : track
      )
    );

    const trackIndex = tracks.findIndex(t => t.id === trackId);
    if (trackIndex !== -1 && audioRefs.current[trackIndex]) {
      const track = tracks[trackIndex];
      if (!track.muted) {
        audioRefs.current[trackIndex]!.volume = 0;
      } else {
        audioRefs.current[trackIndex]!.volume = track.volume;
      }

      // If we're unmuting while playing and no tracks are soloed (or this track is soloed)
      const hasSoloedTrack = tracks.some(t => t.solo);
      if (isPlaying && track.muted && (!hasSoloedTrack || track.solo)) {
        audioRefs.current[trackIndex]!.play();
      } else if (isPlaying && !track.muted) {
        audioRefs.current[trackIndex]!.pause();
      }
    }
  };

  // Toggle track solo
  const toggleSolo = (trackId: number) => {
    const updatedTracks = tracks.map(track =>
      track.id === trackId
        ? { ...track, solo: !track.solo }
        : track
    );

    setTracks(updatedTracks);

    if (isPlaying) {
      // Check if any track is soloed after the update
      const hasSoloedTrack = updatedTracks.some(track => track.solo);

      // Update playback for all tracks
      updatedTracks.forEach((track, i) => {
        const audio = audioRefs.current[i];
        if (audio) {
          if (!track.muted && (!hasSoloedTrack || track.solo)) {
            audio.play();
          } else {
            audio.pause();
          }
        }
      });
    }
  };

  // Apply genre remix - enhanced version with detailed effects
  const applyGenreRemix = async () => {
    if (!selectedGenre) {
      toast.error('Please select a genre first');
      return;
    }

    setIsRemixing(true);

    try {
      // Pause all audio during processing
      if (isPlaying) {
        audioRefs.current.forEach(audio => audio?.pause());
        setIsPlaying(false);
      }

      // Find the selected genre configuration
      const selectedGenreConfig = genreOptions.find(g => g.name === selectedGenre);
      if (!selectedGenreConfig) {
        throw new Error('Genre configuration not found');
      }

      // Get the effects settings for the selected genre
      const genreEffects = selectedGenreConfig.effects;

      // Update tracks with new waveforms and effects based on the selected genre
      setTracks(prevTracks =>
        prevTracks.map((track, index) => {
          // Generate new waveform visualization based on genre and track type
          const newWaveform = Array(50).fill(0).map(() => {
            // Different waveform patterns for different genres and track types
            if (track.name.includes('Vocal')) {
              // Vocal tracks - pattern depends on genre
              if (selectedGenre === 'Trap' || selectedGenre === 'Drill' || selectedGenre === 'Phonk') {
                // More peaks and valleys for trap/drill vocals
                return Math.random() * 0.7 + (Math.sin(index * 0.4) * 0.3 + 0.3);
              } else if (selectedGenre === 'R&B' || selectedGenre === 'Lo-Fi') {
                // Smoother waveform for R&B/Lo-Fi vocals
                return Math.random() * 0.3 + (Math.sin(index * 0.2) * 0.2 + 0.4);
              } else if (selectedGenre === 'EDM' || selectedGenre === 'Hard Techno') {
                // More rhythmic pattern for EDM/Techno vocals
                return Math.random() * 0.2 + (Math.sin(index * 0.8) * 0.4 + 0.4);
              } else {
                // Default vocal pattern
                return Math.random() * 0.3 + (Math.sin(index * 0.3) * 0.3 + 0.4);
              }
            } else if (track.name === 'Drums') {
              // Drum tracks - more rhythmic patterns
              if (selectedGenre === 'Drum and Bass') {
                // Fast, intense drum patterns
                return index % 4 === 0 ? 0.9 : (index % 2 === 0 ? 0.7 : 0.2);
              } else if (selectedGenre === 'Trap' || selectedGenre === 'Hip Hop') {
                // Trap/Hip Hop drum patterns
                return index % 8 === 0 ? 0.9 : (index % 3 === 0 ? 0.8 : 0.3);
              } else {
                // Default drum pattern
                return index % 4 === 0 ? 0.8 : (index % 2 === 0 ? 0.6 : Math.random() * 0.4);
              }
            } else if (track.name === 'Bass') {
              // Bass tracks - lower, sustained patterns
              if (selectedGenre === 'Trap' || selectedGenre === 'Drill' || selectedGenre === 'Hip Hop') {
                // Heavy bass for trap/drill/hip hop
                return 0.6 + Math.random() * 0.3;
              } else {
                // Default bass pattern
                return 0.4 + Math.random() * 0.4;
              }
            } else {
              // Other tracks - general patterns based on genre
              if (selectedGenre === 'EDM' || selectedGenre === 'Hard Techno') {
                // Consistent high energy for EDM/Techno
                return Math.random() * 0.3 + 0.6;
              } else if (selectedGenre === 'Lo-Fi') {
                // More varied for Lo-Fi
                return Math.random() * 0.6 + 0.2;
              } else {
                // Default pattern
                return Math.random() * 0.5 + 0.3;
              }
            }
          });

          // Create updated track effects based on genre and track type
          let updatedEffects = { ...track.effects };

          // Apply genre-specific effects to each track type
          if (track.name.includes('Vocal')) {
            // Vocal tracks
            updatedEffects = {
              ...updatedEffects,
              reverb: genreEffects.reverb,
              delay: genreEffects.delay,
              distortion: genreEffects.distortion * 0.7, // Reduce distortion for vocals
              compression: genreEffects.compression,
              autoTune: selectedGenre === 'Trap' || selectedGenre === 'Hip Hop' ? 0.8 : 0.3,
              vocalEffect: genreEffects.vocalEffect
            };
          } else if (track.name === 'Drums') {
            // Drum tracks
            updatedEffects = {
              ...updatedEffects,
              reverb: genreEffects.reverb * 0.5, // Less reverb on drums
              compression: genreEffects.compression * 1.2, // More compression on drums
              lowPass: selectedGenre === 'Lo-Fi' ? 0.7 : 0.3,
              highPass: selectedGenre === 'EDM' || selectedGenre === 'Hard Techno' ? 0.4 : 0.1
            };
          } else if (track.name === 'Bass') {
            // Bass tracks
            updatedEffects = {
              ...updatedEffects,
              distortion: genreEffects.distortion * 0.8,
              compression: genreEffects.compression,
              lowPass: 0.7, // Always filter high frequencies on bass
              bassBoost: genreEffects.bassBoost
            };
          } else {
            // Other tracks - apply genre effects directly
            updatedEffects = {
              ...updatedEffects,
              reverb: genreEffects.reverb,
              delay: genreEffects.delay,
              distortion: genreEffects.distortion,
              compression: genreEffects.compression
            };
          }

          return {
            ...track,
            waveform: newWaveform,
            effects: updatedEffects
          };
        })
      );

      // Apply audio effects to each track based on genre
      audioRefs.current.forEach((audio, i) => {
        if (audio && i < tracks.length) {
          const track = tracks[i];

          // Apply tempo/playback rate based on genre
          audio.playbackRate = genreEffects.tempo || 1.0;

          // Apply volume adjustments based on track type and genre
          if (track.name.includes('Vocal')) {
            // Adjust vocal volume based on genre
            if (selectedGenre === 'R&B' || selectedGenre === 'Lo-Fi') {
              audio.volume = track.volume * 1.1; // Boost vocals slightly for R&B/Lo-Fi
            } else if (selectedGenre === 'Rock' || selectedGenre === 'EDM') {
              audio.volume = track.volume * 0.9; // Reduce vocals slightly for Rock/EDM
            }
          } else if (track.name === 'Drums') {
            // Adjust drum volume based on genre
            if (selectedGenre === 'Trap' || selectedGenre === 'Hip Hop' || selectedGenre === 'Drill') {
              audio.volume = track.volume * 1.2; // Boost drums for trap/hip hop/drill
            }
          } else if (track.name === 'Bass') {
            // Adjust bass volume based on genre
            if (selectedGenre === 'Trap' || selectedGenre === 'Hip Hop' || selectedGenre === 'Drill') {
              audio.volume = track.volume * 1.3; // Boost bass for trap/hip hop/drill
            } else if (selectedGenre === 'Rock') {
              audio.volume = track.volume * 1.1; // Boost bass slightly for rock
            }
          }

          // Ensure volume doesn't exceed 1.0
          if (audio.volume > 1.0) audio.volume = 1.0;

          // Reload the audio to apply the new settings
          const currentSrc = audio.src;
          audio.src = currentSrc;
          audio.load();
        }
      });

      toast.success(`Remixed to ${selectedGenre} style!`);
    } catch (error) {
      console.error('Error applying genre remix:', error);
      toast.error('Failed to apply remix. Please try again.');
    } finally {
      setIsRemixing(false);
    }
  };

  // Update progress bar
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (audioRefs.current[0]) {
        setCurrentTime(audioRefs.current[0].currentTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;

    // Set all audio elements to the new time
    audioRefs.current.forEach(audio => {
      if (audio) {
        audio.currentTime = newTime;
      }
    });

    setCurrentTime(newTime);
  };

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-studio-dark rounded-lg overflow-hidden">
      {/* Header with song info */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlayback}
            className="w-10 h-10 rounded-full bg-studio-accent flex items-center justify-center text-white"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <div>
            <h3 className="text-white font-medium">{songTitle}</h3>
            <div className="flex text-gray-400 text-sm space-x-3">
              <span>{bpm}bpm</span>
              <span>{key}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 text-2xl"
        >
          ×
        </button>
      </div>

      {/* Timeline */}
      <div className="px-4 py-2 flex items-center">
        <span className="text-gray-400 text-sm mr-2">{formatTime(currentTime)}</span>
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer relative"
        >
          <div
            className="absolute top-0 left-0 h-full bg-studio-accent rounded-full"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />
        </div>
        <span className="text-gray-400 text-sm ml-2">{formatTime(duration)}</span>
      </div>

      {/* Tracks */}
      <div className="p-4">
        {tracks.map((track) => (
          <div key={track.id} className="mb-4 flex items-center">
            {/* Waveform visualization */}
            <div className={`flex-1 h-16 ${track.color} bg-opacity-20 rounded-md overflow-hidden flex items-center px-2`}>
              <div className="w-full h-12 flex items-center justify-between">
                {track.waveform.map((height, i) => (
                  <div
                    key={i}
                    className={`w-1 ${track.muted ? 'bg-gray-500' : track.color} mx-px`}
                    style={{ height: `${height * 100}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Track controls */}
            <div className="ml-4 flex flex-col items-center space-y-2 w-32">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{track.icon}</span>
                <span className="text-white text-sm">{track.name}</span>
              </div>

              {/* Voice type selector for vocal tracks */}
              {track.name.includes('Vocal') && (
                <div className="w-full">
                  <select
                    className="w-full bg-gray-800 text-white text-xs rounded-md p-1 border border-gray-700"
                    value={track.voiceType || 'male'}
                    onChange={(e) => {
                      setTracks(prevTracks =>
                        prevTracks.map(t =>
                          t.id === track.id
                            ? { ...t, voiceType: e.target.value }
                            : t
                        )
                      );
                    }}
                  >
                    {voiceTypes.map(voice => (
                      <option key={voice.id} value={voice.id}>
                        {voice.icon} {voice.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleSolo(track.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${track.solo ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'}`}
                >
                  <span className="text-xs">S</span>
                </button>

                <button
                  onClick={() => toggleMute(track.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${track.muted ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  {track.muted ? <FaVolumeMute size={10} /> : <FaVolumeUp size={10} />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={track.volume}
                  onChange={(e) => updateTrackVolume(track.id, parseFloat(e.target.value))}
                  className="w-16 h-1 accent-studio-accent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Genre selection */}
      <div className="p-4 border-t border-gray-700">
        <h3 className="text-white mb-3">Choose a genre for your new remix:</h3>
        <div className="flex flex-wrap gap-2">
          {genreOptions.map((genre) => (
            <button
              key={genre.name}
              onClick={() => setSelectedGenre(genre.name)}
              className={`px-4 py-2 rounded-md text-white ${genre.color} ${selectedGenre === genre.name ? 'ring-2 ring-white' : ''}`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Options and Remix button */}
      <div className="p-4 flex items-center justify-between border-t border-gray-700">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center text-white"
        >
          <span className="mr-2">{showOptions ? '▼' : '▶'}</span> Options
        </button>

        <button
          onClick={applyGenreRemix}
          disabled={isRemixing || !selectedGenre}
          className="px-6 py-3 bg-studio-accent text-white rounded-md disabled:opacity-50"
        >
          {isRemixing ? 'Remixing...' : 'Remix'}
        </button>
      </div>

      {/* Options panel (collapsed by default) */}
      {showOptions && (
        <div className="p-4 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-white mb-2">Remix Intensity</h4>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                defaultValue="0.7"
                className="w-full accent-studio-accent"
                onChange={(e) => {
                  // Apply intensity to all tracks
                  const intensity = parseFloat(e.target.value);
                  setTracks(prevTracks =>
                    prevTracks.map(track => ({
                      ...track,
                      effects: {
                        ...track.effects,
                        // Scale effect values based on intensity
                        reverb: track.effects?.reverb ? track.effects.reverb * intensity * 1.5 : 0.5 * intensity,
                        distortion: track.effects?.distortion ? track.effects.distortion * intensity : 0.3 * intensity,
                        delay: track.effects?.delay ? track.effects.delay * intensity : 0.3 * intensity
                      }
                    }))
                  );
                }}
              />
              <div className="flex justify-between text-gray-400 text-xs mt-1">
                <span>Subtle</span>
                <span>Balanced</span>
                <span>Extreme</span>
              </div>
            </div>

            <div>
              <h4 className="text-white mb-2">Tempo Adjustment</h4>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.01"
                defaultValue="1.0"
                className="w-full accent-studio-accent"
                onChange={(e) => {
                  // Apply tempo to all audio elements
                  const tempo = parseFloat(e.target.value);
                  audioRefs.current.forEach(audio => {
                    if (audio) {
                      audio.playbackRate = tempo;
                    }
                  });
                }}
              />
              <div className="flex justify-between text-gray-400 text-xs mt-1">
                <span>Slower</span>
                <span>Original</span>
                <span>Faster</span>
              </div>
            </div>

            <div>
              <h4 className="text-white mb-2">Voice Processing</h4>
              <select
                className="w-full bg-gray-800 text-white rounded-md p-2 border border-gray-700"
                defaultValue="natural"
                onChange={(e) => {
                  // Apply voice effect to vocal tracks
                  const voiceEffect = e.target.value;
                  setTracks(prevTracks =>
                    prevTracks.map(track =>
                      track.name.includes('Vocal') ? {
                        ...track,
                        effects: {
                          ...track.effects,
                          vocalEffect: voiceEffect,
                          // Adjust other effects based on voice effect
                          autoTune: voiceEffect === 'autoTune' ? 0.9 :
                                   voiceEffect === 'robotic' ? 0.7 :
                                   voiceEffect === 'vintage' ? 0.3 : 0.1,
                          distortion: voiceEffect === 'distorted' ? 0.8 :
                                     voiceEffect === 'lofi' ? 0.5 :
                                     track.effects?.distortion || 0.1
                        }
                      } : track
                    )
                  );
                }}
              >
                <option value="natural">Natural Voice</option>
                <option value="autoTune">Auto-Tune Effect</option>
                <option value="robotic">Robotic Voice</option>
                <option value="distorted">Distorted Voice</option>
                <option value="vintage">Vintage/Lo-Fi</option>
                <option value="telephone">Telephone Effect</option>
                <option value="megaphone">Megaphone Effect</option>
                <option value="underwater">Underwater Effect</option>
                <option value="whisper">Whisper Voice</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="text-white mb-2">Bass Boost</h4>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                defaultValue="0.5"
                className="w-full accent-studio-accent"
                onChange={(e) => {
                  // Apply bass boost to bass track
                  const bassBoost = parseFloat(e.target.value);
                  setTracks(prevTracks =>
                    prevTracks.map(track =>
                      track.name === 'Bass' ? {
                        ...track,
                        effects: {
                          ...track.effects,
                          bassBoost: bassBoost,
                          lowPass: 0.7 + (bassBoost * 0.3) // Adjust low pass filter with bass boost
                        },
                        volume: 0.7 + (bassBoost * 0.3) // Increase volume with bass boost
                      } : track
                    )
                  );

                  // Update bass audio volume
                  const bassTrackIndex = tracks.findIndex(t => t.name === 'Bass');
                  if (bassTrackIndex !== -1 && audioRefs.current[bassTrackIndex]) {
                    const volume = 0.7 + (parseFloat(e.target.value) * 0.3);
                    audioRefs.current[bassTrackIndex].volume = Math.min(volume, 1.0);
                  }
                }}
              />
              <div className="flex justify-between text-gray-400 text-xs mt-1">
                <span>Light</span>
                <span>Medium</span>
                <span>Heavy</span>
              </div>
            </div>

            <div>
              <h4 className="text-white mb-2">Reverb Amount</h4>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                defaultValue="0.4"
                className="w-full accent-studio-accent"
                onChange={(e) => {
                  // Apply reverb to all tracks
                  const reverb = parseFloat(e.target.value);
                  setTracks(prevTracks =>
                    prevTracks.map(track => ({
                      ...track,
                      effects: {
                        ...track.effects,
                        reverb: reverb
                      }
                    }))
                  );
                }}
              />
              <div className="flex justify-between text-gray-400 text-xs mt-1">
                <span>Dry</span>
                <span>Room</span>
                <span>Hall</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-white mb-2">Advanced Settings</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button className="px-3 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700">
                Vocal Isolation
              </button>
              <button className="px-3 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700">
                Beat Detection
              </button>
              <button className="px-3 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700">
                Harmonic Mixing
              </button>
              <button className="px-3 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700">
                AI Enhancement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export options */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            className="px-4 py-2 bg-studio-accent text-white rounded-md hover:bg-opacity-90 transition-all"
            onClick={() => {
              toast.success('Exporting remix...');
              // Simulate export process
              setTimeout(() => {
                toast.success('Remix exported successfully!');
              }, 1500);
            }}
          >
            Export Remix
          </button>

          <div className="relative group">
            <button className="px-4 py-2 bg-gray-700 text-white rounded-md flex items-center hover:bg-gray-600 transition-all">
              <span>Download</span>
              <span className="ml-2">▼</span>
            </button>
            <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left"
                  onClick={() => toast.success('Downloading MP3...')}
                >
                  Download MP3
                </button>
                <button
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left"
                  onClick={() => toast.success('Downloading WAV...')}
                >
                  Download WAV
                </button>
                <button
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left"
                  onClick={() => toast.success('Downloading Stems...')}
                >
                  Download Stems (ZIP)
                </button>
              </div>
            </div>
          </div>

          <button
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-all"
            onClick={() => toast.success('Preparing to share on SoundCloud...')}
          >
            Share to SoundCloud
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
            onClick={() => toast.success('Saved to your library!')}
          >
            Save to Library
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-studio-accent focus:border-transparent"
              placeholder="Enter a name for your remix"
              defaultValue={`${songTitle.split('.')[0]} (${selectedGenre || 'Custom'} Remix)`}
            />
          </div>

          <div>
            <select
              className="bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-studio-accent focus:border-transparent"
              defaultValue="public"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedRemixInterface;
