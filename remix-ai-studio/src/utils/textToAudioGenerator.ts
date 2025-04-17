// Text to Audio Generator Utility
import { getAudioContext } from './audioProcessor';
import { analyzePrompt } from './promptAnalyzer';
import { voiceSamples, findMatchingVoice } from '../data/voice-samples';

// Oscillator types for different sound characteristics
const oscillatorTypes: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];

// Interface for audio generation parameters
interface AudioParams {
  frequency: number;
  detune: number;
  type: OscillatorType;
  gain: number;
  duration: number;
}

// Generate base frequency from genre and mood
const getBaseFrequency = (genre: string, mood: string): number => {
  const baseFrequencies: Record<string, number> = {
    'EDM': 440, // A4 note
    'Deep House': 110, // A2 note
    'R&B': 220, // A3 note
    'Trap': 55, // A1 note
    'Lofi': 330, // E4 note
    'HipHop': 165, // E3 note
    'default': 440
  };

  // Adjust frequency based on mood
  const moodMultiplier: Record<string, number> = {
    'Happy': 1.2,
    'Sad': 0.8,
    'Energetic': 1.5,
    'Calm': 0.6,
    'Aggressive': 2.0,
    'Romantic': 1.0
  };

  const baseFreq = baseFrequencies[genre] || baseFrequencies.default;
  const multiplier = moodMultiplier[mood] || 1.0;

  return baseFreq * multiplier;
};

// Generate audio parameters from prompt analysis
const generateAudioParams = (analysis: any): AudioParams => {
  const {
    detectedGenre,
    detectedMood,
    detectedTempo,
    intensity
  } = analysis;

  return {
    frequency: getBaseFrequency(detectedGenre, detectedMood),
    detune: Math.random() * 100 - 50, // Random detune between -50 and 50 cents
    type: oscillatorTypes[Math.floor(Math.random() * oscillatorTypes.length)],
    gain: 0.5 + (intensity * 0.5), // Gain between 0.5 and 1.0 based on intensity
    duration: 60 / detectedTempo * 4 // Duration based on tempo (in seconds)
  };
};

// Generate musical tones based on text and voice type
export const generateMusicalTones = (text: string, voiceType: string, genre: string = 'default'): Promise<AudioBuffer> => {
  return new Promise(async (resolve, reject) => {
    try {
      const audioContext = getAudioContext();
      const analysis = analyzePrompt(text);
      const voiceSample = voiceSamples[voiceType] || voiceSamples.default;

      // Create a longer buffer for musical content
      const duration = 4.0; // 4 seconds of audio
      const sampleRate = audioContext.sampleRate;
      const bufferSize = Math.floor(sampleRate * duration);
      const audioBuffer = audioContext.createBuffer(2, bufferSize, sampleRate);

      // Generate base frequencies based on the text content and voice type
      const baseFrequency = getBaseFrequency(analysis.detectedGenre, analysis.detectedMood);

      // Apply gender-specific frequency adjustments
      let frequencyMultiplier = 1.0;
      let harmonicContent = 0.5;

      if (voiceSample.gender === 'male') {
        frequencyMultiplier = 0.7; // Lower pitch for male voices
        harmonicContent = 0.7; // More harmonic content for richness
      } else if (voiceSample.gender === 'female') {
        frequencyMultiplier = 1.3; // Higher pitch for female voices
        harmonicContent = 0.4; // Less harmonic content for clarity
      }

      // Generate musical patterns based on the text
      const patterns = generateMusicPatterns(text, analysis.intensity);

      // Fill audio buffer with generated tones
      for (let channel = 0; channel < 2; channel++) {
        const channelData = audioBuffer.getChannelData(channel);

        // Apply the patterns to create musical phrases
        for (let i = 0; i < bufferSize; i++) {
          const t = i / sampleRate;
          let sample = 0;

          // Create a musical phrase from the patterns
          for (let j = 0; j < patterns.length; j++) {
            const pattern = patterns[j];
            const patternFreq = baseFrequency * frequencyMultiplier * pattern.frequencyRatio;
            const patternPhase = 2.0 * Math.PI * patternFreq * t;

            // Mix different waveforms for richer sound
            const sineTone = Math.sin(patternPhase);
            const squareTone = Math.sign(Math.sin(patternPhase * 1.01)); // Slightly detuned for chorus effect
            const sawTone = ((t * patternFreq * 1.02) % 1) * 2 - 1; // More detuning

            // Mix the waveforms based on gender characteristics
            let waveMix = sineTone * (1 - harmonicContent) +
                         squareTone * (harmonicContent * 0.5) +
                         sawTone * (harmonicContent * 0.5);

            // Apply envelope from the pattern
            const envelope = getEnvelopeValue(t, pattern, duration);

            // Add to the sample
            sample += waveMix * envelope * pattern.amplitude;
          }

          // Apply overall envelope and normalization
          const fadeIn = Math.min(1.0, t / 0.1);
          const fadeOut = Math.min(1.0, (duration - t) / 0.2);
          const masterEnvelope = fadeIn * fadeOut;

          channelData[i] = sample * masterEnvelope * 0.5; // Normalize to prevent clipping
        }
      }

      resolve(audioBuffer);
    } catch (error) {
      console.error('Error generating musical tones:', error);
      reject(error);
    }
  });
};

// Generate music patterns from text
function generateMusicPatterns(text: string, intensity: number) {
  const patterns = [];

  // Create patterns based on text characteristics
  const words = text.split(/\s+/);
  const wordCount = words.length;

  // Base pattern - main melody
  patterns.push({
    frequencyRatio: 1.0,
    amplitude: 0.7,
    attackTime: 0.05,
    decayTime: 0.1,
    sustainLevel: 0.6,
    releaseTime: 0.2,
    startTime: 0,
    duration: 4.0,
    repeatInterval: 0.5
  });

  // Add harmonics based on word count
  if (wordCount > 3) {
    patterns.push({
      frequencyRatio: 1.5, // Perfect fifth
      amplitude: 0.4,
      attackTime: 0.1,
      decayTime: 0.2,
      sustainLevel: 0.3,
      releaseTime: 0.3,
      startTime: 0.25, // Offset start
      duration: 3.5,
      repeatInterval: 1.0
    });
  }

  // Add bass line for longer texts
  if (wordCount > 5) {
    patterns.push({
      frequencyRatio: 0.5, // One octave down
      amplitude: 0.5,
      attackTime: 0.15,
      decayTime: 0.3,
      sustainLevel: 0.4,
      releaseTime: 0.4,
      startTime: 0.5, // Offset start
      duration: 3.0,
      repeatInterval: 1.5
    });
  }

  // Add intensity-based pattern
  patterns.push({
    frequencyRatio: 2.0, // One octave up
    amplitude: intensity * 0.5,
    attackTime: 0.02,
    decayTime: 0.1,
    sustainLevel: 0.2,
    releaseTime: 0.1,
    startTime: 0.125, // Offset start
    duration: 3.75,
    repeatInterval: 0.25
  });

  return patterns;
}

// Calculate envelope value at a given time
function getEnvelopeValue(time: number, pattern: any, totalDuration: number) {
  // Check if this is an active repetition of the pattern
  const patternDuration = pattern.duration;
  const repeatInterval = pattern.repeatInterval;
  const patternStartTime = pattern.startTime;

  // Determine which repetition this is
  const repetitions = Math.floor((totalDuration - patternStartTime) / repeatInterval);

  for (let rep = 0; rep < repetitions; rep++) {
    const repStartTime = patternStartTime + (rep * repeatInterval);
    const repEndTime = repStartTime + patternDuration;

    if (time >= repStartTime && time < repEndTime) {
      // This is an active repetition, calculate envelope
      const patternTime = time - repStartTime;

      // ADSR envelope
      const { attackTime, decayTime, sustainLevel, releaseTime } = pattern;
      const sustainTime = patternDuration - attackTime - decayTime - releaseTime;

      if (patternTime < attackTime) {
        // Attack phase
        return (patternTime / attackTime);
      } else if (patternTime < attackTime + decayTime) {
        // Decay phase
        const decayProgress = (patternTime - attackTime) / decayTime;
        return 1.0 - ((1.0 - sustainLevel) * decayProgress);
      } else if (patternTime < attackTime + decayTime + sustainTime) {
        // Sustain phase
        return sustainLevel;
      } else {
        // Release phase
        const releaseProgress = (patternTime - (attackTime + decayTime + sustainTime)) / releaseTime;
        return sustainLevel * (1.0 - releaseProgress);
      }
    }
  }

  return 0; // Not in any active repetition
}

// Fallback to generate audio from text prompt using oscillators
export const generateAudioFromText = async (prompt: string): Promise<AudioBuffer> => {
  const audioContext = getAudioContext();
  const analysis = analyzePrompt(prompt);
  const params = generateAudioParams(analysis);

  // Create audio buffer
  const sampleRate = audioContext.sampleRate;
  const numberOfChannels = 2;
  const length = sampleRate * params.duration;
  const audioBuffer = audioContext.createBuffer(numberOfChannels, length, sampleRate);

  // Generate audio data
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    const omega = 2.0 * Math.PI * params.frequency;

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let sample = 0;

      // Generate waveform based on oscillator type
      switch (params.type) {
        case 'sine':
          sample = Math.sin(omega * t);
          break;
        case 'square':
          sample = Math.sign(Math.sin(omega * t));
          break;
        case 'sawtooth':
          sample = ((t * params.frequency % 1) * 2 - 1);
          break;
        case 'triangle':
          sample = Math.abs(((t * params.frequency % 1) * 2 - 1));
          break;
      }

      // Apply envelope
      const attack = 0.1;
      const release = 0.1;
      let envelope = 1;

      if (t < attack) {
        envelope = t / attack; // Attack phase
      } else if (t > params.duration - release) {
        envelope = (params.duration - t) / release; // Release phase
      }

      channelData[i] = sample * params.gain * envelope;
    }
  }

  return audioBuffer;
};

// Apply genre-specific effects to audio buffer
const applyGenreEffects = (audioContext: AudioContext, audioBuffer: AudioBuffer, genre: string): AudioBuffer => {
  // Create a new buffer for the processed audio
  const processedBuffer = audioContext.createBuffer(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  // Apply different effects based on genre
  switch (genre.toLowerCase()) {
    case 'rnb':
    case 'r&b':
      // Apply R&B effects: warm bass, smooth mids, slight compression
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const inputData = audioBuffer.getChannelData(channel);
        const outputData = processedBuffer.getChannelData(channel);

        // Apply low-pass filter effect (simulate warm bass)
        let lastOutput = 0;
        const filterCoeff = 0.2; // Lower = stronger filter

        for (let i = 0; i < inputData.length; i++) {
          // Simple low-pass filter
          lastOutput = lastOutput * (1 - filterCoeff) + inputData[i] * filterCoeff;

          // Add some harmonic distortion for warmth
          const distortion = Math.tanh(lastOutput * 1.5) * 0.3;

          // Mix original with processed
          outputData[i] = lastOutput * 0.7 + distortion * 0.3;

          // Apply soft compression
          if (outputData[i] > 0.8) outputData[i] = 0.8 + (outputData[i] - 0.8) * 0.5;
          if (outputData[i] < -0.8) outputData[i] = -0.8 + (outputData[i] + 0.8) * 0.5;
        }
      }
      break;

    case 'edm':
    case 'electronic':
      // Apply EDM effects: punchy, bright, sidechained
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const inputData = audioBuffer.getChannelData(channel);
        const outputData = processedBuffer.getChannelData(channel);

        for (let i = 0; i < inputData.length; i++) {
          // Add brightness (high frequency emphasis)
          const brightness = inputData[i] * 1.2;

          // Add some distortion for punch
          const distortion = Math.tanh(inputData[i] * 2.0) * 0.3;

          // Mix and apply sidechain-like pumping effect (4 beats per second)
          const t = i / audioBuffer.sampleRate;
          const pumpAmount = 0.5 + 0.5 * Math.sin(2 * Math.PI * 4 * t - Math.PI/2);

          outputData[i] = (brightness * 0.6 + distortion * 0.4) * pumpAmount;
        }
      }
      break;

    case 'hiphop':
    case 'trap':
      // Apply Hip-hop/Trap effects: heavy bass, gritty texture
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const inputData = audioBuffer.getChannelData(channel);
        const outputData = processedBuffer.getChannelData(channel);

        for (let i = 0; i < inputData.length; i++) {
          // Enhance bass (simulate 808)
          const t = i / audioBuffer.sampleRate;
          const bassEnhance = Math.sin(2 * Math.PI * 60 * t) * 0.3; // 60Hz sine wave

          // Add gritty texture
          const grit = (Math.random() * 2 - 1) * 0.05;

          // Mix with original
          outputData[i] = inputData[i] * 0.7 + bassEnhance * 0.25 + grit * 0.05;
        }
      }
      break;

    case 'lofi':
      // Apply Lo-fi effects: vinyl crackle, bit reduction, warm filtering
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const inputData = audioBuffer.getChannelData(channel);
        const outputData = processedBuffer.getChannelData(channel);

        let lastOutput = 0;
        const filterCoeff = 0.15; // Warm filter

        for (let i = 0; i < inputData.length; i++) {
          // Warm filter
          lastOutput = lastOutput * (1 - filterCoeff) + inputData[i] * filterCoeff;

          // Bit reduction (quantization)
          const bitDepth = 6; // Lower = more lo-fi
          const quantizedOutput = Math.round(lastOutput * Math.pow(2, bitDepth)) / Math.pow(2, bitDepth);

          // Add vinyl crackle
          const crackle = (Math.random() * 2 - 1) * 0.03;

          outputData[i] = quantizedOutput * 0.85 + crackle * 0.15;
        }
      }
      break;

    default:
      // Default processing: slight enhancement
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const inputData = audioBuffer.getChannelData(channel);
        const outputData = processedBuffer.getChannelData(channel);

        for (let i = 0; i < inputData.length; i++) {
          // Just add a bit of harmonic enhancement
          const enhancement = Math.tanh(inputData[i] * 1.2) * 0.1;
          outputData[i] = inputData[i] * 0.9 + enhancement * 0.1;
        }
      }
  }

  return processedBuffer;
};

// Play generated audio with voice type and genre effects
export const playGeneratedAudio = async (prompt: string, voiceType: string = 'default', genre: string = 'default'): Promise<string> => {
  try {
    const audioContext = getAudioContext();

    // Generate musical tones based on the text and voice type
    const audioBuffer = await generateMusicalTones(prompt, voiceType, genre);

    // Apply genre-specific effects
    const processedBuffer = applyGenreEffects(audioContext, audioBuffer, genre);

    // Create a source node for playback
    const source = audioContext.createBufferSource();
    source.buffer = processedBuffer;

    // Create a gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.7; // Set volume

    // Connect the nodes
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start playback
    source.start();
    console.log('Playing generated audio with voice type:', voiceType, 'and genre:', genre);

    // Convert the buffer to a blob for the audio player
    const offlineContext = new OfflineAudioContext({
      numberOfChannels: processedBuffer.numberOfChannels,
      length: processedBuffer.length,
      sampleRate: processedBuffer.sampleRate
    });

    const offlineSource = offlineContext.createBufferSource();
    offlineSource.buffer = processedBuffer;
    offlineSource.connect(offlineContext.destination);
    offlineSource.start();

    const renderedBuffer = await offlineContext.startRendering();

    // Convert the rendered buffer to a WAV file
    const wavBlob = await audioBufferToWav(renderedBuffer);
    const audioUrl = URL.createObjectURL(wavBlob);

    return audioUrl;
  } catch (error) {
    console.error('Error playing generated audio:', error);

    // Return a fallback URL if generation fails
    const fallbackSample = voiceSamples[voiceType] || voiceSamples.default;
    return fallbackSample.fallbackUrl;
  }
};

// Convert AudioBuffer to WAV format
async function audioBufferToWav(audioBuffer: AudioBuffer): Promise<Blob> {
  const numOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numOfChannels * 2; // 2 bytes per sample (16-bit)
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
  view.setUint16(22, numOfChannels, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(28, audioBuffer.sampleRate * numOfChannels * 2, true); // byte rate
  view.setUint16(32, numOfChannels * 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample

  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);

  // Write audio data
  const offset = 44;
  const channelData = [];
  for (let i = 0; i < numOfChannels; i++) {
    channelData.push(audioBuffer.getChannelData(i));
  }

  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset + (i * numOfChannels + channel) * 2, int16, true);
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

// Helper function to write strings to DataView
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}