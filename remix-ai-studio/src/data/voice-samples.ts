// Voice samples for different voice types
export interface VoiceSample {
  name: string;
  gender: 'male' | 'female' | 'neutral';
  voiceId: string; // Used for Web Speech API voice selection
  fallbackUrl: string; // Fallback audio URL if speech synthesis fails
}

// Voice samples collection
export const voiceSamples: Record<string, VoiceSample> = {
  'Male Pop': {
    name: 'Male Pop',
    gender: 'male',
    voiceId: 'en-US-male',
    fallbackUrl: 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3'
  },
  'Female RnB': {
    name: 'Female RnB',
    gender: 'female',
    voiceId: 'en-US-female',
    fallbackUrl: 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3'
  },
  'Robotic': {
    name: 'Robotic',
    gender: 'neutral',
    voiceId: 'en-US-neural',
    fallbackUrl: 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3'
  },
  'Soft Lofi': {
    name: 'Soft Lofi',
    gender: 'female',
    voiceId: 'en-US-female',
    fallbackUrl: 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3'
  },
  'Anime Style': {
    name: 'Anime Style',
    gender: 'female',
    voiceId: 'ja-JP-female',
    fallbackUrl: 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3'
  },
  'Auto Harmony': {
    name: 'Auto Harmony',
    gender: 'neutral',
    voiceId: 'en-US-neural',
    fallbackUrl: 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3'
  },
  'default': {
    name: 'Default Voice',
    gender: 'neutral',
    voiceId: 'en-US-neural',
    fallbackUrl: 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3'
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
