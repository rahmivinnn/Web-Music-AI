// Voice samples for different voice types
export interface VoiceSample {
  name: string;
  gender: 'male' | 'female' | 'neutral';
  voiceId: string; // Used for Web Speech API voice selection
  fallbackUrl: string; // Fallback audio URL if speech synthesis fails

  // Voice characteristics for remix effects
  baseFrequency: number; // Base frequency in Hz
  harmonicContent: number; // 0.0 to 1.0, higher means more harmonics
  attack: number; // Attack time in seconds
  release: number; // Release time in seconds
  effectPreferences: {
    reverb: number; // 0.0 to 1.0
    delay: number; // 0.0 to 1.0
    distortion: number; // 0.0 to 1.0
    compression: number; // 0.0 to 1.0
    chorus: number; // 0.0 to 1.0
  };
}

// Voice samples collection
export const voiceSamples: Record<string, VoiceSample> = {
  'Male Pop': {
    name: 'Male Pop',
    gender: 'male',
    voiceId: 'en-US-male',
    fallbackUrl: 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3',
    baseFrequency: 110, // Lower frequency for male voice
    harmonicContent: 0.7, // More harmonics for richness
    attack: 0.02, // Quick attack for pop style
    release: 0.3, // Medium release
    effectPreferences: {
      reverb: 0.3, // Moderate reverb
      delay: 0.2, // Light delay
      distortion: 0.4, // Moderate distortion for pop edge
      compression: 0.7, // Strong compression for pop
      chorus: 0.3 // Light chorus
    }
  },
  'Female RnB': {
    name: 'Female RnB',
    gender: 'female',
    voiceId: 'en-US-female',
    fallbackUrl: 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3',
    baseFrequency: 220, // Higher frequency for female voice
    harmonicContent: 0.5, // Balanced harmonics
    attack: 0.05, // Smooth attack for R&B
    release: 0.5, // Longer release for smoothness
    effectPreferences: {
      reverb: 0.6, // More reverb for R&B atmosphere
      delay: 0.4, // Medium delay for R&B feel
      distortion: 0.2, // Light distortion
      compression: 0.8, // Heavy compression for R&B
      chorus: 0.5 // Medium chorus for richness
    }
  },
  'Robotic': {
    name: 'Robotic',
    gender: 'neutral',
    voiceId: 'en-US-neural',
    fallbackUrl: 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3',
    baseFrequency: 180, // Mid-range frequency
    harmonicContent: 0.9, // High harmonics for robotic sound
    attack: 0.01, // Very quick attack
    release: 0.1, // Quick release
    effectPreferences: {
      reverb: 0.2, // Light reverb
      delay: 0.3, // Medium delay
      distortion: 0.8, // Heavy distortion for robotic effect
      compression: 0.5, // Medium compression
      chorus: 0.1 // Minimal chorus
    }
  },
  'Soft Lofi': {
    name: 'Soft Lofi',
    gender: 'female',
    voiceId: 'en-US-female',
    fallbackUrl: 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3',
    baseFrequency: 200, // Medium-high frequency
    harmonicContent: 0.3, // Lower harmonics for softness
    attack: 0.08, // Slower attack for softness
    release: 0.7, // Long release for lofi feel
    effectPreferences: {
      reverb: 0.7, // Heavy reverb for lofi atmosphere
      delay: 0.5, // Medium-high delay
      distortion: 0.3, // Light distortion for warmth
      compression: 0.4, // Medium-low compression
      chorus: 0.2 // Light chorus
    }
  },
  'Anime Style': {
    name: 'Anime Style',
    gender: 'female',
    voiceId: 'ja-JP-female',
    fallbackUrl: 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3',
    baseFrequency: 260, // Higher frequency for anime style
    harmonicContent: 0.4, // Medium-low harmonics
    attack: 0.03, // Quick attack
    release: 0.4, // Medium release
    effectPreferences: {
      reverb: 0.5, // Medium reverb
      delay: 0.3, // Medium delay
      distortion: 0.1, // Very light distortion
      compression: 0.6, // Medium-high compression
      chorus: 0.7 // Heavy chorus for anime feel
    }
  },
  'Auto Harmony': {
    name: 'Auto Harmony',
    gender: 'neutral',
    voiceId: 'en-US-neural',
    fallbackUrl: 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3',
    baseFrequency: 165, // Medium-low frequency
    harmonicContent: 0.6, // Medium-high harmonics
    attack: 0.04, // Medium-quick attack
    release: 0.6, // Medium-long release
    effectPreferences: {
      reverb: 0.4, // Medium reverb
      delay: 0.6, // High delay for harmony effect
      distortion: 0.2, // Light distortion
      compression: 0.5, // Medium compression
      chorus: 0.9 // Very heavy chorus for harmony
    }
  },
  'default': {
    name: 'Default Voice',
    gender: 'neutral',
    voiceId: 'en-US-neural',
    fallbackUrl: 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3',
    baseFrequency: 165, // Medium frequency
    harmonicContent: 0.5, // Balanced harmonics
    attack: 0.05, // Medium attack
    release: 0.4, // Medium release
    effectPreferences: {
      reverb: 0.4, // Medium reverb
      delay: 0.3, // Medium delay
      distortion: 0.3, // Medium distortion
      compression: 0.5, // Medium compression
      chorus: 0.4 // Medium chorus
    }
  }
};

// Get available voices from the browser
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return [];
  }

  return window.speechSynthesis.getVoices();
};

// Find the best matching voice for a given voice type
export const findMatchingVoice = (voiceType: string): SpeechSynthesisVoice | null => {
  const availableVoices = getAvailableVoices();
  if (!availableVoices.length) return null;

  const voiceSample = voiceSamples[voiceType] || voiceSamples.default;
  const gender = voiceSample.gender;

  // Try to find a matching voice by gender and language
  let matchingVoice = availableVoices.find(voice => {
    const isEnglish = voice.lang.startsWith('en');
    const matchesGender =
      (gender === 'male' && voice.name.toLowerCase().includes('male')) ||
      (gender === 'female' && voice.name.toLowerCase().includes('female'));

    return isEnglish && matchesGender;
  });

  // Fallback to any English voice if no gender match
  if (!matchingVoice) {
    matchingVoice = availableVoices.find(voice => voice.lang.startsWith('en'));
  }

  // Last resort: just use the first available voice
  return matchingVoice || availableVoices[0];
};
