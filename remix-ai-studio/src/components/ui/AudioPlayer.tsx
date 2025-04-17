
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, SkipBack } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';
import { resumeAudioContext, applyGenreEffectToAudioElement } from '@/utils/audioProcessor';
import { toast } from "sonner";

interface AudioPlayerProps {
  title: string;
  isGenerating?: boolean;
  audioUrl?: string;
  genre?: string;
}

const AudioPlayer = ({ title, isGenerating = false, audioUrl = '', genre = 'default' }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [effectsApplied, setEffectsApplied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Use a reliable sample audio source if none provided
  // Using direct audio files that are guaranteed to work
  const sampleAudio = 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3';
  const effectiveAudioUrl = audioUrl || sampleAudio;

  // Track if we're using a voice-generated audio

  useEffect(() => {
    // Simulating progress for demo purposes
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev < 100) return prev + 1;
          clearInterval(interval);
          return 100;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    // Create a new audio element when the component mounts or URL changes
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
      setIsPlaying(false);
      setEffectsApplied(false);
    }

    // Create and configure the audio element
    const audio = new Audio();
    audio.src = effectiveAudioUrl;
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audioRef.current = audio;

    // Set up event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleAudioError);

    // Preload the audio
    audio.load();

    console.log("Audio source set to:", effectiveAudioUrl);

    // Clean up
    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', () => setIsPlaying(false));
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleAudioError);
    };
  }, [effectiveAudioUrl]);

  // Apply genre effects when audio is ready and genre changes
  useEffect(() => {
    if (audioRef.current && isAudioReady && !effectsApplied && !isGenerating) {
      try {
        // Resume audio context and apply genre effects
        resumeAudioContext().then(() => {
          if (audioRef.current) {
            applyGenreEffectToAudioElement(audioRef.current, genre);
            setEffectsApplied(true);
            console.log(`Applied ${genre} effects to audio`);
          }
        });
      } catch (error) {
        console.error('Error applying audio effects:', error);
        // Still mark as applied to prevent repeated attempts
        setEffectsApplied(true);
      }
    }
  }, [genre, isAudioReady, effectsApplied, isGenerating]);

  const handleCanPlayThrough = () => {
    setIsAudioReady(true);
  };

  const handleAudioError = (e: Event) => {
    console.error('Audio error:', e);
    toast.error('Error loading audio. Please try again.');
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    // Make sure audio context is resumed (needed for autoplay policy)
    resumeAudioContext().then(() => {
      if (!audioRef.current) return;

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Force load if needed
        if (!isAudioReady) {
          audioRef.current.load();
        }

        // Play with proper error handling
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.error("Error playing audio:", error);

              // Handle autoplay policy
              if (error.name === 'NotAllowedError') {
                toast.error('Playback was blocked. Please interact with the page first.');
              } else {
                // Try again with a delay
                setTimeout(() => {
                  if (audioRef.current) {
                    audioRef.current.play()
                      .then(() => setIsPlaying(true))
                      .catch(e => {
                        console.error("Second attempt failed:", e);
                        toast.error('Could not play audio. Please try again.');
                      });
                  }
                }, 500);
              }
            });
        }
      }
    }).catch(error => {
      console.error('Error resuming audio context:', error);
      toast.error('Audio system error. Please refresh the page.');
    });
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsAudioReady(true);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleRestart = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    setCurrentTime(0);

    if (!isPlaying) {
      resumeAudioContext().then(() => {
        if (audioRef.current) {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => {
              console.error('Error restarting playback:', e);
              toast.error('Could not restart playback. Please try again.');
            });
        }
      });
    }
  };

  const handleDownload = () => {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = effectiveAudioUrl;
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started!');
  };

  return (
    <div className="audio-player-container">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <button
          className="p-2 rounded-full bg-studio-accent bg-opacity-10 hover:bg-opacity-20 text-studio-accent transition-all"
          onClick={handleDownload}
          disabled={isGenerating || !isAudioReady}
          title="Download audio"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>

      <AudioVisualizer
        isPlaying={isPlaying || isGenerating}
        audioElement={audioRef.current}
      />

      <div className="mt-4">
        <div className="relative w-full h-1 bg-gray-700 rounded-full mb-2">
          {!isGenerating && (
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSliderChange}
              className="absolute w-full opacity-0 cursor-pointer"
              style={{ height: '20px', top: '-8px' }}
              disabled={!isAudioReady}
            />
          )}
          <div
            className="absolute top-0 left-0 h-full bg-studio-accent rounded-full"
            style={{ width: `${isGenerating ? currentTime : (currentTime / (duration || 1)) * 100}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-xs text-gray-400">
          <span>{isGenerating ? '0:00' : formatTime(currentTime)}</span>
          <span>{isGenerating ? 'Generating...' : formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 mr-2"
          onClick={handleRestart}
          disabled={isGenerating || !isAudioReady}
          title="Restart"
        >
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          className="p-3 rounded-full bg-studio-accent text-white hover:bg-opacity-90"
          onClick={togglePlayPause}
          disabled={isGenerating || !isAudioReady}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
