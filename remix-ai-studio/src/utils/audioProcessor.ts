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
    // Create a URL for the file - this will be our fallback
    const fileUrl = URL.createObjectURL(file);

    // Apply real processing based on genre
    const audioContext = getAudioContext();

    // Log processing start
    console.log(`Processing audio file with ${genre} effects`);

    // Load the audio file into an AudioBuffer
    let arrayBuffer;
    let audioBuffer;

    try {
      // Direct approach - get array buffer from file
      arrayBuffer = await file.arrayBuffer();
      audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    } catch (decodeError) {
      console.error('Error decoding audio data directly from file:', decodeError);

      // Alternative approach - load via audio element
      try {
        const audio = new Audio();
        audio.src = fileUrl;

        // Wait for the audio to be loaded
        await new Promise<void>((resolve, reject) => {
          const loadHandler = () => {
            resolve();
            audio.removeEventListener('canplaythrough', loadHandler);
            audio.removeEventListener('error', errorHandler);
          };

          const errorHandler = () => {
            reject(new Error('Failed to load audio'));
            audio.removeEventListener('canplaythrough', loadHandler);
            audio.removeEventListener('error', errorHandler);
          };

          audio.addEventListener('canplaythrough', loadHandler);
          audio.addEventListener('error', errorHandler);

          // Set a timeout in case neither event fires
          setTimeout(() => resolve(), 3000);
        });

        // Create a MediaElementAudioSourceNode
        const sourceNode = audioContext.createMediaElementSource(audio);

        // Create a temporary offline context to capture the audio
        const tempOfflineContext = new OfflineAudioContext({
          numberOfChannels: 2,
          length: audioContext.sampleRate * 30, // 30 seconds max
          sampleRate: audioContext.sampleRate
        });

        // Connect the source to the offline context
        const tempSource = tempOfflineContext.createBufferSource();
        sourceNode.connect(tempOfflineContext.destination);

        // Start playback and rendering
        audio.play();
        const tempBuffer = await tempOfflineContext.startRendering();

        // Use the rendered buffer
        audioBuffer = tempBuffer;

        // Stop playback
        audio.pause();
      } catch (alternativeError) {
        console.error('Alternative audio loading approach failed:', alternativeError);
        // If all else fails, return the original file URL
        return fileUrl;
      }
    }

    // Create an offline audio context for processing
    const offlineContext = new OfflineAudioContext({
      numberOfChannels: audioBuffer.numberOfChannels,
      length: audioBuffer.length,
      sampleRate: audioBuffer.sampleRate
    });

    // Create a source node
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    // Create effect nodes based on genre
    let lastNode = source;

    // 1. Compressor for all genres
    const compressor = offlineContext.createDynamicsCompressor();
    compressor.threshold.value = getGenreCompressorThreshold(genre);
    compressor.ratio.value = getGenreCompressorRatio(genre);
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;
    lastNode.connect(compressor);
    lastNode = compressor;

    // 2. EQ (BiquadFilter)
    // Bass boost/cut
    const bassFilter = offlineContext.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.value = 200;
    bassFilter.gain.value = getGenreBassGain(genre);
    lastNode.connect(bassFilter);
    lastNode = bassFilter;

    // Mid boost/cut
    const midFilter = offlineContext.createBiquadFilter();
    midFilter.type = 'peaking';
    midFilter.frequency.value = 1000;
    midFilter.Q.value = 1;
    midFilter.gain.value = getGenreMidGain(genre);
    lastNode.connect(midFilter);
    lastNode = midFilter;

    // Treble boost/cut
    const trebleFilter = offlineContext.createBiquadFilter();
    trebleFilter.type = 'highshelf';
    trebleFilter.frequency.value = 3000;
    trebleFilter.gain.value = getGenreTrebleGain(genre);
    lastNode.connect(trebleFilter);
    lastNode = trebleFilter;

    // 3. Distortion for certain genres
    if (['Rock', 'Trap', 'Drill', 'Hard Techno', 'EDM'].includes(genre)) {
      const distortion = offlineContext.createWaveShaper();
      distortion.curve = makeDistortionCurve(getGenreDistortionAmount(genre));
      distortion.oversample = '4x';
      lastNode.connect(distortion);
      lastNode = distortion;
    }

    // 4. Reverb for certain genres
    if (['R&B', 'Lo-Fi', 'Deep House', 'Disco House'].includes(genre)) {
      // Create convolver for reverb
      const convolver = offlineContext.createConvolver();

      // Generate impulse response
      const impulseLength = offlineContext.sampleRate * getGenreReverbTime(genre);
      const impulseBuffer = offlineContext.createBuffer(
        2, // stereo
        impulseLength,
        offlineContext.sampleRate
      );

      // Fill the buffer with noise and create an envelope
      for (let channel = 0; channel < impulseBuffer.numberOfChannels; channel++) {
        const impulseData = impulseBuffer.getChannelData(channel);
        for (let i = 0; i < impulseLength; i++) {
          // Random noise with exponential decay
          impulseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, getGenreReverbDecay(genre));
        }
      }

      convolver.buffer = impulseBuffer;

      // Create a gain node to control reverb amount
      const reverbGain = offlineContext.createGain();
      reverbGain.gain.value = getGenreReverbMix(genre);

      // Create a dry/wet mix
      const dryGain = offlineContext.createGain();
      dryGain.gain.value = 1 - getGenreReverbMix(genre);

      // Split the signal
      lastNode.connect(dryGain);
      lastNode.connect(convolver);
      convolver.connect(reverbGain);

      // Create a merger node
      const merger = offlineContext.createGain();
      dryGain.connect(merger);
      reverbGain.connect(merger);

      lastNode = merger;
    }

    // 5. Stereo widener for certain genres
    if (['EDM', 'Deep House', 'Tech House', 'Disco House', 'Future Garage'].includes(genre)) {
      // Create a stereo widener effect
      const stereoWidener = createStereoWidener(offlineContext, getGenreStereoWidth(genre));
      lastNode.connect(stereoWidener.input);
      lastNode = stereoWidener.output;
    }

    // Final gain adjustment
    const outputGain = offlineContext.createGain();
    outputGain.gain.value = getGenreOutputGain(genre);
    lastNode.connect(outputGain);
    outputGain.connect(offlineContext.destination);

    // Start the source and render
    try {
      source.start();
      const renderedBuffer = await offlineContext.startRendering();

      // Convert the rendered buffer to a WAV file
      const wavBlob = audioBufferToWav(renderedBuffer);

      // Create a URL for the processed file
      const processedUrl = URL.createObjectURL(wavBlob);

      // Verify the processed audio is playable
      try {
        const testAudio = new Audio();
        testAudio.src = processedUrl;

        // Wait for the audio to be loaded or error
        await new Promise<void>((resolve, reject) => {
          const canPlayHandler = () => {
            resolve();
            testAudio.removeEventListener('canplay', canPlayHandler);
            testAudio.removeEventListener('error', errorHandler);
          };

          const errorHandler = () => {
            reject(new Error('Processed audio is not playable'));
            testAudio.removeEventListener('canplay', canPlayHandler);
            testAudio.removeEventListener('error', errorHandler);
          };

          testAudio.addEventListener('canplay', canPlayHandler);
          testAudio.addEventListener('error', errorHandler);

          // Set a timeout in case neither event fires
          setTimeout(() => resolve(), 2000);
        });

        console.log(`Audio processing complete for ${genre} style`);
        return processedUrl;
      } catch (playabilityError) {
        console.error('Processed audio is not playable:', playabilityError);
        // Return the original file URL as fallback
        return URL.createObjectURL(file);
      }
    } catch (renderError) {
      console.error('Error rendering processed audio:', renderError);
      // Return the original file URL as fallback
      return URL.createObjectURL(file);
    }
  } catch (error) {
    console.error('Error processing audio file:', error);
    // Return the original file URL as fallback
    return URL.createObjectURL(file);
  }
};

// Helper function to create a distortion curve
function makeDistortionCurve(amount: number) {
  const k = amount * 100;
  const samples = 44100;
  const curve = new Float32Array(samples);
  const deg = Math.PI / 180;

  for (let i = 0; i < samples; ++i) {
    const x = (i * 2) / samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }

  return curve;
}

// Helper function to create a stereo widener
function createStereoWidener(context: AudioContext | OfflineAudioContext, width: number) {
  // Create a mid-side processor
  const input = context.createGain();
  const output = context.createGain();

  // Split into left and right channels
  const splitter = context.createChannelSplitter(2);
  const merger = context.createChannelMerger(2);

  // Create gains for mid and side
  const midGain = context.createGain();
  const sideGain = context.createGain();

  // Set the width
  midGain.gain.value = 1;
  sideGain.gain.value = width;

  // Connect the graph
  input.connect(splitter);

  // Extract mid and side signals
  const leftDelay = context.createDelay();
  const rightDelay = context.createDelay();
  leftDelay.delayTime.value = 0.005; // 5ms delay for one channel

  // Connect left and right to create mid-side processing
  splitter.connect(midGain, 0); // Left = mid + side
  splitter.connect(sideGain, 1); // Right = mid - side

  // Add slight delay to one channel for width
  midGain.connect(leftDelay);
  sideGain.connect(rightDelay);

  // Merge back to stereo
  leftDelay.connect(merger, 0, 0);
  rightDelay.connect(merger, 0, 1);

  merger.connect(output);

  return { input, output };
}

// Convert AudioBuffer to WAV format
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const dataLength = buffer.length * numChannels * bytesPerSample;
  const bufferLength = 44 + dataLength;

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // File length
  view.setUint32(4, 36 + dataLength, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // Format chunk identifier
  writeString(view, 12, 'fmt ');
  // Format chunk length
  view.setUint32(16, 16, true);
  // Sample format (raw)
  view.setUint16(20, format, true);
  // Channel count
  view.setUint16(22, numChannels, true);
  // Sample rate
  view.setUint32(24, sampleRate, true);
  // Byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * blockAlign, true);
  // Block align (channel count * bytes per sample)
  view.setUint16(32, blockAlign, true);
  // Bits per sample
  view.setUint16(34, bitDepth, true);
  // Data chunk identifier
  writeString(view, 36, 'data');
  // Data chunk length
  view.setUint32(40, dataLength, true);

  // Write the PCM samples
  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      const value = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, value, true);
      offset += bytesPerSample;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

// Helper function to write strings to a DataView
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Genre-specific parameter functions
function getGenreCompressorThreshold(genre: string): number {
  switch (genre) {
    case 'Trap': case 'Drill': case 'Hip Hop': return -24;
    case 'EDM': case 'Hard Techno': return -18;
    case 'Rock': return -20;
    case 'R&B': case 'Lo-Fi': return -15;
    default: return -12;
  }
}

function getGenreCompressorRatio(genre: string): number {
  switch (genre) {
    case 'Trap': case 'Drill': case 'Hip Hop': return 5;
    case 'EDM': case 'Hard Techno': return 4;
    case 'Rock': return 4.5;
    case 'R&B': case 'Lo-Fi': return 3;
    default: return 2;
  }
}

function getGenreBassGain(genre: string): number {
  switch (genre) {
    case 'Trap': case 'Drill': case 'Hip Hop': return 12;
    case 'EDM': case 'Hard Techno': return 8;
    case 'Deep House': case 'Tech House': return 6;
    case 'Rock': return 4;
    case 'R&B': return 5;
    case 'Lo-Fi': return 3;
    default: return 0;
  }
}

function getGenreMidGain(genre: string): number {
  switch (genre) {
    case 'Rock': return 6;
    case 'EDM': case 'Hard Techno': return -3;
    case 'Trap': case 'Drill': return -4;
    case 'R&B': return 2;
    case 'Lo-Fi': return -2;
    default: return 0;
  }
}

function getGenreTrebleGain(genre: string): number {
  switch (genre) {
    case 'EDM': case 'Hard Techno': case 'Disco House': return 6;
    case 'Rock': return 4;
    case 'Trap': case 'Drill': return 3;
    case 'Lo-Fi': return -6;
    case 'R&B': return 2;
    default: return 0;
  }
}

function getGenreDistortionAmount(genre: string): number {
  switch (genre) {
    case 'Rock': return 0.6;
    case 'Hard Techno': return 0.4;
    case 'Trap': case 'Drill': return 0.3;
    case 'EDM': return 0.2;
    default: return 0.1;
  }
}

function getGenreReverbTime(genre: string): number {
  switch (genre) {
    case 'Lo-Fi': return 2.0;
    case 'R&B': return 1.5;
    case 'Deep House': return 1.8;
    case 'Disco House': return 1.2;
    default: return 1.0;
  }
}

function getGenreReverbDecay(genre: string): number {
  switch (genre) {
    case 'Lo-Fi': return 1.5;
    case 'R&B': return 2.0;
    case 'Deep House': return 1.8;
    case 'Disco House': return 2.2;
    default: return 2.0;
  }
}

function getGenreReverbMix(genre: string): number {
  switch (genre) {
    case 'Lo-Fi': return 0.4;
    case 'R&B': return 0.3;
    case 'Deep House': case 'Disco House': return 0.35;
    default: return 0.2;
  }
}

function getGenreStereoWidth(genre: string): number {
  switch (genre) {
    case 'EDM': return 1.5;
    case 'Deep House': case 'Tech House': case 'Disco House': return 1.3;
    case 'Future Garage': return 1.4;
    default: return 1.0;
  }
}

function getGenreOutputGain(genre: string): number {
  switch (genre) {
    case 'Trap': case 'Drill': case 'Hip Hop': return 1.2;
    case 'EDM': case 'Hard Techno': return 1.3;
    case 'Rock': return 1.1;
    default: return 1.0;
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
