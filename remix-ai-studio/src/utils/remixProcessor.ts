import { getAudioContext } from './audioProcessor';
import { voiceSamples as voiceSamplesData } from '../data/voice-samples';

// Apply genre effects to multiple tracks
export const applyGenreEffectsToTracks = async (
  trackUrls: string[],
  genre: string
): Promise<string[]> => {
  try {
    console.log(`Processing ${trackUrls.length} tracks with ${genre} style`);
    const audioContext = getAudioContext();

    // Process each track in parallel
    const processedUrls = await Promise.all(
      trackUrls.map(async (url, index) => {
        try {
          // Load audio data
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          // Apply genre-specific effects based on track type
          const trackType = getTrackTypeByIndex(index);
          const processedBuffer = applyGenreEffectsToTrack(audioContext, audioBuffer, genre, trackType);

          // Convert to WAV and create blob URL
          const wavBlob = await audioBufferToWav(processedBuffer);
          return URL.createObjectURL(wavBlob);
        } catch (error) {
          console.error(`Error processing track ${index}:`, error);
          return url; // Return original URL on error
        }
      })
    );

    return processedUrls;
  } catch (error) {
    console.error('Error in applyGenreEffectsToTracks:', error);
    return trackUrls; // Return original URLs on error
  }
};

// Get track type based on index
const getTrackTypeByIndex = (index: number): string => {
  const trackTypes = ['vocals', 'drums', 'bass', 'melody', 'fx', 'synth'];
  return trackTypes[index % trackTypes.length];
};

// Apply genre-specific effects to a single track
const applyGenreEffectsToTrack = (
  audioContext: AudioContext,
  audioBuffer: AudioBuffer,
  genre: string,
  trackType: string
): AudioBuffer => {
  // Create a new buffer for the processed audio
  const processedBuffer = audioContext.createBuffer(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  // Get effect settings based on genre and track type
  const effectSettings = getGenreEffectSettings(genre, trackType);

  // Process each channel
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const inputData = audioBuffer.getChannelData(channel);
    const outputData = processedBuffer.getChannelData(channel);

    // Apply effects based on genre and track type
    applyEffects(inputData, outputData, effectSettings, audioBuffer.sampleRate);
  }

  return processedBuffer;
};

// Get effect settings based on genre and track type
const getGenreEffectSettings = (genre: string, trackType: string) => {
  // Base settings
  const settings = {
    lowPass: 1.0,      // 0-1, lower = stronger filter
    highPass: 0.0,     // 0-1, higher = stronger filter
    distortion: 0.0,   // 0-1, amount of distortion
    reverb: 0.0,       // 0-1, amount of reverb
    delay: 0.0,        // 0-1, amount of delay
    delayTime: 0.25,   // delay time in seconds
    compression: 0.0,  // 0-1, amount of compression
    bitCrush: 0.0,     // 0-1, amount of bit crushing
    chorus: 0.0,       // 0-1, amount of chorus
    tremolo: 0.0,      // 0-1, amount of tremolo
    tremoloRate: 4.0,  // tremolo rate in Hz
    gain: 1.0,         // output gain
  };

  // Apply genre-specific settings
  switch (genre.toLowerCase()) {
    case 'trap':
      settings.lowPass = trackType === 'bass' ? 0.1 : 0.7;
      settings.distortion = trackType === 'drums' ? 0.4 : 0.2;
      settings.reverb = trackType === 'vocals' ? 0.6 : 0.3;
      settings.delay = trackType === 'fx' ? 0.5 : 0.2;
      settings.delayTime = 0.125; // 1/8 note delay
      settings.compression = 0.7;
      settings.tremolo = trackType === 'synth' ? 0.6 : 0.0;
      settings.tremoloRate = 8.0;
      break;

    case 'r&b':
      settings.lowPass = trackType === 'bass' ? 0.2 : 0.8;
      settings.distortion = trackType === 'drums' ? 0.1 : 0.05;
      settings.reverb = trackType === 'vocals' ? 0.7 : 0.4;
      settings.delay = trackType === 'fx' ? 0.4 : 0.2;
      settings.delayTime = 0.333; // 1/3 note delay
      settings.compression = 0.6;
      settings.chorus = trackType === 'synth' || trackType === 'vocals' ? 0.4 : 0.0;
      break;

    case 'rock':
      settings.distortion = trackType === 'bass' || trackType === 'synth' ? 0.6 : 0.3;
      settings.reverb = trackType === 'drums' ? 0.5 : 0.3;
      settings.compression = 0.8;
      settings.gain = 1.2;
      break;

    case 'drill':
      settings.lowPass = trackType === 'bass' ? 0.05 : 0.6;
      settings.distortion = 0.5;
      settings.reverb = trackType === 'vocals' ? 0.7 : 0.2;
      settings.delay = trackType === 'fx' ? 0.6 : 0.3;
      settings.delayTime = 0.1667; // 1/6 note delay
      settings.compression = 0.9;
      settings.tremolo = trackType === 'synth' ? 0.8 : 0.0;
      settings.tremoloRate = 16.0;
      break;

    case 'hard techno':
    case 'techno':
      settings.highPass = trackType === 'bass' ? 0.2 : 0.4;
      settings.distortion = 0.7;
      settings.reverb = 0.3;
      settings.delay = 0.4;
      settings.delayTime = 0.125;
      settings.compression = 0.8;
      settings.bitCrush = 0.3;
      settings.tremolo = 0.5;
      settings.tremoloRate = 16.0;
      break;

    case 'future garage':
      settings.lowPass = 0.6;
      settings.reverb = 0.7;
      settings.delay = 0.5;
      settings.delayTime = 0.25;
      settings.chorus = trackType === 'synth' || trackType === 'fx' ? 0.6 : 0.2;
      settings.compression = 0.5;
      break;

    case 'disco house':
    case 'deep house':
    case 'minimal house':
    case 'tech house':
      settings.lowPass = trackType === 'bass' ? 0.3 : 0.7;
      settings.highPass = trackType === 'fx' ? 0.5 : 0.2;
      settings.reverb = 0.4;
      settings.delay = 0.3;
      settings.delayTime = 0.25;
      settings.compression = 0.6;
      settings.chorus = trackType === 'synth' ? 0.3 : 0.0;
      settings.tremolo = trackType === 'synth' ? 0.4 : 0.0;
      settings.tremoloRate = 4.0;
      break;

    case 'drum and bass':
      settings.lowPass = trackType === 'bass' ? 0.2 : 0.8;
      settings.highPass = trackType === 'drums' ? 0.3 : 0.0;
      settings.distortion = trackType === 'bass' ? 0.5 : 0.2;
      settings.reverb = 0.3;
      settings.delay = 0.2;
      settings.delayTime = 0.0833; // 1/12 note delay
      settings.compression = 0.8;
      settings.gain = 1.1;
      break;

    case 'lo-fi':
      settings.lowPass = 0.4;
      settings.distortion = 0.2;
      settings.reverb = 0.6;
      settings.bitCrush = 0.7;
      settings.chorus = 0.3;
      settings.compression = 0.4;
      settings.gain = 0.9;
      break;

    case 'edm':
      settings.highPass = trackType === 'bass' ? 0.0 : 0.3;
      settings.distortion = trackType === 'synth' ? 0.5 : 0.2;
      settings.reverb = 0.4;
      settings.delay = 0.3;
      settings.delayTime = 0.125;
      settings.compression = 0.8;
      settings.tremolo = trackType === 'synth' ? 0.7 : 0.0;
      settings.tremoloRate = 8.0;
      settings.gain = 1.2;
      break;

    case 'hip hop':
      settings.lowPass = trackType === 'bass' ? 0.15 : 0.7;
      settings.distortion = trackType === 'drums' ? 0.3 : 0.1;
      settings.reverb = trackType === 'vocals' ? 0.5 : 0.2;
      settings.delay = trackType === 'fx' ? 0.4 : 0.2;
      settings.delayTime = 0.25;
      settings.compression = 0.7;
      settings.gain = 1.1;
      break;

    default:
      // Default processing - light enhancement
      settings.reverb = 0.3;
      settings.compression = 0.4;
  }

  return settings;
};

// Apply effects to audio data
const applyEffects = (
  inputData: Float32Array,
  outputData: Float32Array,
  settings: any,
  sampleRate: number
) => {
  // Filter state variables
  let lowPassOutput = 0;
  let highPassOutput = 0;
  let highPassInput = 0;

  // Delay buffer
  const delayBufferSize = Math.floor(settings.delayTime * sampleRate);
  const delayBuffer = new Float32Array(delayBufferSize);
  let delayIndex = 0;

  // Process each sample
  for (let i = 0; i < inputData.length; i++) {
    let sample = inputData[i];

    // Apply high-pass filter
    if (settings.highPass > 0) {
      const highPassCoeff = 0.05 * settings.highPass;
      highPassOutput = highPassCoeff * (highPassOutput + sample - highPassInput);
      highPassInput = sample;
      sample = highPassOutput;
    }

    // Apply low-pass filter
    if (settings.lowPass < 1) {
      const lowPassCoeff = settings.lowPass;
      lowPassOutput = lowPassOutput * (1 - lowPassCoeff) + sample * lowPassCoeff;
      sample = lowPassOutput;
    }

    // Apply distortion
    if (settings.distortion > 0) {
      const distortionAmount = 1 + settings.distortion * 9; // 1-10
      sample = Math.tanh(sample * distortionAmount) / Math.tanh(distortionAmount);
    }

    // Apply bit crushing
    if (settings.bitCrush > 0) {
      const bits = 16 - Math.floor(settings.bitCrush * 12); // 16 down to 4 bits
      const steps = Math.pow(2, bits);
      sample = Math.round(sample * steps) / steps;
    }

    // Apply tremolo
    if (settings.tremolo > 0) {
      const tremoloDepth = settings.tremolo * 0.5; // 0-0.5
      const t = i / sampleRate;
      const tremoloFactor = 1 - tremoloDepth + tremoloDepth * Math.sin(2 * Math.PI * settings.tremoloRate * t);
      sample *= tremoloFactor;
    }

    // Apply delay
    if (settings.delay > 0) {
      const delaySample = delayBuffer[delayIndex];
      delayBuffer[delayIndex] = sample + delaySample * 0.5; // Feedback
      sample = sample * (1 - settings.delay * 0.5) + delaySample * settings.delay;
      delayIndex = (delayIndex + 1) % delayBufferSize;
    }

    // Apply chorus (simplified)
    if (settings.chorus > 0) {
      const chorusDepth = settings.chorus * 0.01;
      const chorusRate = 1; // 1 Hz
      const t = i / sampleRate;
      const chorusOffset = Math.sin(2 * Math.PI * chorusRate * t) * chorusDepth;

      // Get a delayed sample for chorus
      const chorusIndex = i - Math.floor(chorusOffset * sampleRate);
      if (chorusIndex >= 0 && chorusIndex < inputData.length) {
        sample = sample * 0.7 + inputData[chorusIndex] * 0.3 * settings.chorus;
      }
    }

    // Apply compression (simplified)
    if (settings.compression > 0) {
      const threshold = 0.5 - settings.compression * 0.3; // 0.5 down to 0.2
      const ratio = 1 + settings.compression * 9; // 1:1 up to 10:1

      if (Math.abs(sample) > threshold) {
        const excess = Math.abs(sample) - threshold;
        const compressed = threshold + excess / ratio;
        sample = sample > 0 ? compressed : -compressed;
      }
    }

    // Apply reverb (simplified)
    if (settings.reverb > 0) {
      const reverbTime = 0.3; // 300ms reverb tail
      const t = i / sampleRate;
      const reverbAmount = settings.reverb * 0.3;
      const reverb = Math.exp(-t / reverbTime) * reverbAmount * (Math.random() * 0.1);
      sample += reverb;
    }

    // Apply gain
    sample *= settings.gain;

    // Prevent clipping
    sample = Math.max(-1, Math.min(1, sample));

    // Write to output
    outputData[i] = sample;
  }
};

// Convert AudioBuffer to WAV format
const audioBufferToWav = async (audioBuffer: AudioBuffer): Promise<Blob> => {
  const numChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numChannels * 2; // 2 bytes per sample (16-bit)
  const buffer = new ArrayBuffer(44 + length); // 44 bytes for WAV header
  const view = new DataView(buffer);

  // Write WAV header
  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');

  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // audio format (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(28, audioBuffer.sampleRate * numChannels * 2, true); // byte rate
  view.setUint16(32, numChannels * 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample

  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);

  // Write audio data
  const offset = 44;
  const channelData = [];
  for (let i = 0; i < numChannels; i++) {
    channelData.push(audioBuffer.getChannelData(i));
  }

  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset + (i * numChannels + channel) * 2, int16, true);
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
};

// Helper function to write strings to DataView
const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};
