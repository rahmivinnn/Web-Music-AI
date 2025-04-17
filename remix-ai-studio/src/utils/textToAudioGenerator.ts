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

// Generate speech audio from text using Web Speech API
export const generateSpeechFromText = (text: string, voiceType: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Check if speech synthesis is available
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Find matching voice
    const voice = findMatchingVoice(voiceType);
    if (voice) {
      utterance.voice = voice;

      // Set voice characteristics based on voice type
      const voiceSample = voiceSamples[voiceType] || voiceSamples.default;

      if (voiceSample.gender === 'male') {
        utterance.pitch = 0.9; // Slightly lower pitch for male voices
        utterance.rate = 0.9; // Slightly slower rate
      } else if (voiceSample.gender === 'female') {
        utterance.pitch = 1.1; // Slightly higher pitch for female voices
        utterance.rate = 1.0;
      } else {
        // Neutral/robotic voice
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
      }
    }

    // Create a MediaRecorder to capture the audio
    const audioChunks: Blob[] = [];
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(destination.stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      resolve(audioBlob);
    };

    // Start recording
    mediaRecorder.start();

    // Handle speech synthesis events
    utterance.onend = () => {
      mediaRecorder.stop();
      window.speechSynthesis.cancel(); // Clean up
    };

    utterance.onerror = (event) => {
      mediaRecorder.stop();
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };

    // Speak the text
    window.speechSynthesis.speak(utterance);
  });
};

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

// Play generated audio with voice type
export const playGeneratedAudio = async (prompt: string, voiceType: string = 'default'): Promise<string> => {
  try {
    // First try to generate speech using Web Speech API
    try {
      if (window.speechSynthesis) {
        // Initialize speech synthesis
        window.speechSynthesis.cancel(); // Clear any previous speech

        // Load voices if needed
        if (window.speechSynthesis.getVoices().length === 0) {
          await new Promise<void>(resolve => {
            window.speechSynthesis.onvoiceschanged = () => resolve();
            // Set a timeout in case onvoiceschanged doesn't fire
            setTimeout(resolve, 1000);
          });
        }

        // Generate speech from text
        const audioBlob = await generateSpeechFromText(prompt, voiceType);
        const audioUrl = URL.createObjectURL(audioBlob);

        // Play the audio
        const audio = new Audio(audioUrl);
        audio.play();

        console.log('Playing generated speech from prompt:', prompt);
        return audioUrl;
      }
    } catch (speechError) {
      console.warn('Speech synthesis failed, falling back to oscillator:', speechError);
    }

    // Fallback to oscillator-based audio if speech synthesis fails
    const audioContext = getAudioContext();
    const audioBuffer = await generateAudioFromText(prompt);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5; // Set initial volume

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    source.start();
    console.log('Playing fallback audio from prompt:', prompt);

    // Create a blob URL for the audio player
    const fallbackSample = voiceSamples[voiceType] || voiceSamples.default;
    return fallbackSample.fallbackUrl;
  } catch (error) {
    console.error('Error playing generated audio:', error);
    throw error;
  }
};