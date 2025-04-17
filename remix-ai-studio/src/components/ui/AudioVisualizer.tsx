
import { useEffect, useState, useRef } from 'react';
import { createAnalyzer, getFrequencyData, getAudioContext, resumeAudioContext } from '@/utils/audioProcessor';

interface AudioVisualizerProps {
  isPlaying: boolean;
  audioElement?: HTMLAudioElement | null;
}

const AudioVisualizer = ({ isPlaying, audioElement }: AudioVisualizerProps) => {
  const [bars] = useState(Array(24).fill(0));
  const animationRef = useRef<number | null>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Set up analyzer when audio element changes
  useEffect(() => {
    if (audioElement && !isConnected) {
      try {
        resumeAudioContext().then(() => {
          const audioContext = getAudioContext();

          // Create analyzer node
          const analyzer = createAnalyzer();
          analyzerRef.current = analyzer;

          // Only create a new source node if we don't have one
          if (!sourceNodeRef.current) {
            try {
              // Create source from audio element
              const sourceNode = audioContext.createMediaElementSource(audioElement);
              sourceNodeRef.current = sourceNode;

              // Connect source to analyzer
              sourceNode.connect(analyzer);

              // Connect analyzer to destination
              analyzer.connect(audioContext.destination);

              setIsConnected(true);
              console.log('Audio visualizer connected to audio element');
            } catch (error) {
              console.error('Error connecting audio visualizer:', error);
            }
          }
        });
      } catch (error) {
        console.error('Error setting up audio visualizer:', error);
      }
    }

    return () => {
      // Clean up is handled in the component unmount effect
    };
  }, [audioElement, isConnected]);

  // Animation effect
  useEffect(() => {
    if (isPlaying && analyzerRef.current) {
      // Use real frequency data when available
      const animate = () => {
        if (analyzerRef.current) {
          // Get frequency data
          const dataArray = getFrequencyData(analyzerRef.current);

          // Update bar heights based on frequency data
          barRefs.current.forEach((bar, index) => {
            if (bar) {
              // Map frequency data to bar index
              const dataIndex = Math.floor(index * (dataArray.length / bars.length));

              // Scale the value (0-255) to a reasonable height
              const value = dataArray[dataIndex] || 0;
              const height = (value / 255) * 60 + 5;

              bar.style.height = `${height}px`;

              // Add color intensity based on height
              const intensity = Math.min(100, Math.floor((height / 70) * 100));
              bar.style.backgroundColor = `hsl(170, ${intensity}%, 50%)`;
            }
          });
        } else {
          // Fallback to random animation if no analyzer
          barRefs.current.forEach((bar, index) => {
            if (bar) {
              // Create more variation between bars for a realistic effect
              const baseHeight = Math.random() * 60 + 5;

              // Add phase shift for more natural movement
              const phaseShift = index * 0.2;
              const time = Date.now() * 0.005;
              const sineWave = Math.sin(time + phaseShift) * 10;

              const height = baseHeight + sineWave;
              bar.style.height = `${height}px`;

              // Add color intensity based on height
              const intensity = Math.min(100, Math.floor((height / 70) * 100));
              bar.style.backgroundColor = `hsl(170, ${intensity}%, 50%)`;
            }
          });
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Reset bars when not playing
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        barRefs.current.forEach((bar) => {
          if (bar) {
            bar.style.height = '8px';
            bar.style.backgroundColor = '#4b5563';
          }
        });
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, bars.length]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Disconnect source node if it exists
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.disconnect();
        } catch (error) {
          console.error('Error disconnecting source node:', error);
        }
      }

      // Disconnect analyzer if it exists
      if (analyzerRef.current) {
        try {
          analyzerRef.current.disconnect();
        } catch (error) {
          console.error('Error disconnecting analyzer:', error);
        }
      }
    };
  }, []);

  return (
    <div className="audio-visualizer flex items-end justify-center gap-1 h-20 bg-gray-900 rounded-md p-2">
      {bars.map((_, index) => (
        <div
          key={index}
          ref={(el) => (barRefs.current[index] = el)}
          className={`visualizer-bar bg-gray-600 rounded-t-md w-2 ${isPlaying && !analyzerRef.current ? 'animate-pulse' : ''}`}
          style={{
            height: '8px',
            animationDelay: `${index * 0.1}s`,
            transition: 'height 0.1s ease-in-out, background-color 0.1s ease-in-out',
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
