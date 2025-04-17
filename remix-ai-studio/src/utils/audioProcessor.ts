// Audio Processing Utility for Remix AI Studio
// Handles Web Audio API functionality for audio effects and processing

// Define the genre effect types
export type GenreEffect = {
  name: string;
  applyEffect: (audioContext: AudioContext, sourceNode: AudioNode) => AudioNode;
};

// Audio Context singleton to prevent multiple instances
let audioContextInstance: AudioContext | null = null;

// Get or create the audio context
export const getAudioContext = (): AudioContext => {
  if (!audioContextInstance) {
    try {
      // Modern browsers
      audioContextInstance = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error('Web Audio API is not supported in this browser', e);
      throw new Error('Web Audio API not supported');
    }
  }
  return audioContextInstance;
};

// Resume audio context (needed for autoplay policy)
export const resumeAudioContext = async (): Promise<void> => {
  const audioContext = getAudioContext();
  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
    } catch (e) {
      console.error('Failed to resume audio context:', e);
    }
  }
};

// Create an audio buffer from a file
export const createAudioBufferFromFile = async (file: File): Promise<AudioBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const audioContext = getAudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        resolve(audioBuffer);
      } catch (error) {
        console.error('Error decoding audio data:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Create a buffer source node from an audio buffer
export const createBufferSourceNode = (audioBuffer: AudioBuffer): AudioBufferSourceNode => {
  const audioContext = getAudioContext();
  const sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = audioBuffer;
  return sourceNode;
};

// Create an audio element source node from a URL
export const createMediaElementSource = (audioElement: HTMLAudioElement): MediaElementAudioSourceNode => {
  const audioContext = getAudioContext();
  return audioContext.createMediaElementSource(audioElement);
};

// Genre-specific audio effects
export const genreEffects: Record<string, GenreEffect> = {
  'EDM': {
    name: 'EDM',
    applyEffect: (audioContext, sourceNode) => {
      // Create compressor for sidechain effect
      const compressor = audioContext.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.knee.value = 30;
      compressor.ratio.value = 12;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;
      
      // Create reverb for big room sound
      const convolver = audioContext.createConvolver();
      
      // Connect nodes
      sourceNode.connect(compressor);
      
      return compressor;
    }
  },
  'Deep House': {
    name: 'Deep House',
    applyEffect: (audioContext, sourceNode) => {
      // Create low-pass filter
      const lowpass = audioContext.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 1000;
      lowpass.Q.value = 1;
      
      // Create bass boost
      const bassBoost = audioContext.createBiquadFilter();
      bassBoost.type = 'lowshelf';
      bassBoost.frequency.value = 100;
      bassBoost.gain.value = 8;
      
      // Connect nodes
      sourceNode.connect(lowpass);
      lowpass.connect(bassBoost);
      
      return bassBoost;
    }
  },
  'R&B': {
    name: 'R&B',
    applyEffect: (audioContext, sourceNode) => {
      // Create EQ for smooth harmonics
      const midBoost = audioContext.createBiquadFilter();
      midBoost.type = 'peaking';
      midBoost.frequency.value = 800;
      midBoost.Q.value = 1;
      midBoost.gain.value = 3;
      
      // Create a warm reverb
      const reverb = audioContext.createConvolver();
      
      // Connect nodes
      sourceNode.connect(midBoost);
      
      return midBoost;
    }
  },
  'Trap': {
    name: 'Trap',
    applyEffect: (audioContext, sourceNode) => {
      // Create 808 bass boost
      const bassBoost = audioContext.createBiquadFilter();
      bassBoost.type = 'lowshelf';
      bassBoost.frequency.value = 60;
      bassBoost.gain.value = 10;
      
      // Create high-hat boost
      const highBoost = audioContext.createBiquadFilter();
      highBoost.type = 'highshelf';
      highBoost.frequency.value = 8000;
      highBoost.gain.value = 5;
      
      // Connect nodes
      sourceNode.connect(bassBoost);
      bassBoost.connect(highBoost);
      
      return highBoost;
    }
  },
  'Lofi': {
    name: 'Lofi',
    applyEffect: (audioContext, sourceNode) => {
      // Create vinyl noise effect
      const lowpass = audioContext.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 3500;
      
      // Create warm tape tone
      const highcut = audioContext.createBiquadFilter();
      highcut.type = 'lowshelf';
      highcut.frequency.value = 2000;
      highcut.gain.value = -6;
      
      // Create mid boost for warmth
      const midBoost = audioContext.createBiquadFilter();
      midBoost.type = 'peaking';
      midBoost.frequency.value = 800;
      midBoost.Q.value = 0.8;
      midBoost.gain.value = 4;
      
      // Connect nodes
      sourceNode.connect(lowpass);
      lowpass.connect(highcut);
      highcut.connect(midBoost);
      
      return midBoost;
    }
  },
  'Phonk': {
    name: 'Phonk',
    applyEffect: (audioContext, sourceNode) => {
      // Create retro tape delay effect
      const delay = audioContext.createDelay();
      delay.delayTime.value = 0.1;
      
      // Create distortion for Memphis vocal FX
      const distortion = audioContext.createWaveShaper();
      const makeDistortionCurve = (amount: number) => {
        const k = amount;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        
        for (let i = 0; i < n_samples; ++i) {
          const x = (i * 2) / n_samples - 1;
          curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        
        return curve;
      };
      
      distortion.curve = makeDistortionCurve(50);
      distortion.oversample = '4x';
      
      // Connect nodes
      sourceNode.connect(distortion);
      distortion.connect(delay);
      
      return delay;
    }
  },
  'HipHop': {
    name: 'HipHop',
    applyEffect: (audioContext, sourceNode) => {
      // Create vinyl crackle effect
      const highpass = audioContext.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 60;
      
      // Create boom bap drums effect
      const lowBoost = audioContext.createBiquadFilter();
      lowBoost.type = 'lowshelf';
      lowBoost.frequency.value = 100;
      lowBoost.gain.value = 6;
      
      // Connect nodes
      sourceNode.connect(highpass);
      highpass.connect(lowBoost);
      
      return lowBoost;
    }
  },
  'default': {
    name: 'Default',
    applyEffect: (audioContext, sourceNode) => {
      // Just pass through with a slight EQ enhancement
      const eq = audioContext.createBiquadFilter();
      eq.type = 'peaking';
      eq.frequency.value = 1000;
      eq.Q.value = 1;
      eq.gain.value = 2;
      
      sourceNode.connect(eq);
      
      return eq;
    }
  }
};

// Apply genre effect to an audio element
export const applyGenreEffectToAudioElement = (
  audioElement: HTMLAudioElement,
  genre: string
): void => {
  try {
    // Resume audio context first
    resumeAudioContext().then(() => {
      const audioContext = getAudioContext();
      
      // Create source from audio element
      const sourceNode = audioContext.createMediaElementSource(audioElement);
      
      // Get the appropriate effect processor
      const effectProcessor = genreEffects[genre] || genreEffects.default;
      
      // Apply the effect
      const processedOutput = effectProcessor.applyEffect(audioContext, sourceNode);
      
      // Connect to destination
      processedOutput.connect(audioContext.destination);
      
      console.log(`Applied ${effectProcessor.name} effect to audio`);
    });
  } catch (error) {
    console.error('Error applying genre effect:', error);
  }
};

// Process an uploaded file with genre effects and return a playable URL
export const processAudioFile = async (
  file: File,
  genre: string
): Promise<string> => {
  try {
    // Create a URL for the file
    const fileUrl = URL.createObjectURL(file);
    
    // We'll return the URL directly for now
    // In a real implementation, we would process the file with Web Audio API
    // and return a processed audio URL
    return fileUrl;
  } catch (error) {
    console.error('Error processing audio file:', error);
    throw error;
  }
};

// Create an analyzer node for visualizations
export const createAnalyzer = (): AnalyserNode => {
  const audioContext = getAudioContext();
  const analyzerNode = audioContext.createAnalyser();
  analyzerNode.fftSize = 256;
  analyzerNode.smoothingTimeConstant = 0.8;
  return analyzerNode;
};

// Get frequency data from analyzer
export const getFrequencyData = (analyzerNode: AnalyserNode): Uint8Array => {
  const dataArray = new Uint8Array(analyzerNode.frequencyBinCount);
  analyzerNode.getByteFrequencyData(dataArray);
  return dataArray;
};
