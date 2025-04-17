// Prompt Analyzer Utility
// Analyzes text prompts to detect genre, mood, and musical elements

// Genre keywords for detection
const genreKeywords: Record<string, string[]> = {
  'EDM': ['edm', 'electronic', 'dance', 'club', 'rave', 'festival', 'electro', 'house', 'techno', 'trance', 'dubstep', 'beat'],
  'R&B': ['rnb', 'r&b', 'rhythm and blues', 'soul', 'smooth', 'urban', 'contemporary'],
  'Deep House': ['deep house', 'deep', 'chill house', 'melodic house', 'atmospheric', 'groovy'],
  'Rock': ['rock', 'guitar', 'band', 'electric guitar', 'drums', 'alternative', 'indie'],
  'HipHop': ['hip hop', 'hiphop', 'rap', 'trap', 'beats', 'flow', 'rhyme', 'mc'],
  'Lofi': ['lofi', 'lo-fi', 'lo fi', 'chill', 'relaxing', 'study', 'beats to study to', 'ambient'],
  'Phonk': ['phonk', 'memphis', 'cowbell', 'drift', 'dark trap', 'distorted'],
  'Trap': ['trap', '808', 'hi-hats', 'dark', 'bass heavy', 'atlanta'],
  'Pop': ['pop', 'catchy', 'radio', 'chorus', 'hook', 'mainstream', 'hit'],
  'Classic': ['classic', 'orchestra', 'symphony', 'piano', 'violin', 'cello', 'instrumental'],
  'Sad': ['sad', 'emotional', 'melancholic', 'heartbreak', 'slow', 'ballad', 'depressing', 'sorrow'],
  'Guitar music': ['acoustic guitar', 'guitar solo', 'fingerstyle', 'strumming', 'folk', 'unplugged'],
  'High music': ['high energy', 'upbeat', 'fast', 'energetic', 'party', 'exciting', 'uplifting']
};

// Mood keywords for detection
const moodKeywords: Record<string, string[]> = {
  'Happy': ['happy', 'joy', 'cheerful', 'upbeat', 'bright', 'positive', 'fun'],
  'Sad': ['sad', 'melancholic', 'depressing', 'gloomy', 'dark', 'sorrow', 'heartbreak'],
  'Energetic': ['energetic', 'powerful', 'strong', 'intense', 'dynamic', 'exciting'],
  'Calm': ['calm', 'peaceful', 'relaxing', 'chill', 'ambient', 'soothing', 'tranquil'],
  'Aggressive': ['aggressive', 'angry', 'intense', 'heavy', 'hard', 'distorted'],
  'Romantic': ['romantic', 'love', 'emotional', 'passionate', 'intimate', 'sensual']
};

// Musical element keywords
const elementKeywords: Record<string, string[]> = {
  'Bass': ['bass', 'sub', 'low end', 'deep', '808', 'bassline'],
  'Drums': ['drums', 'beat', 'rhythm', 'percussion', 'kick', 'snare', 'hi-hat'],
  'Melody': ['melody', 'tune', 'hook', 'catchy', 'melodic', 'theme'],
  'Vocals': ['vocals', 'voice', 'singing', 'lyrics', 'rap', 'singer', 'vocal'],
  'Synth': ['synth', 'synthesizer', 'electronic', 'pad', 'arpeggio', 'lead'],
  'Guitar': ['guitar', 'acoustic', 'electric', 'riff', 'solo', 'strumming'],
  'Piano': ['piano', 'keys', 'keyboard', 'grand piano', 'rhodes', 'chords']
};

// Tempo keywords
const tempoKeywords: Record<string, string[]> = {
  'Slow': ['slow', 'downtempo', 'relaxed', 'gentle', 'laid back'],
  'Medium': ['medium', 'moderate', 'walking pace', 'steady'],
  'Fast': ['fast', 'uptempo', 'quick', 'rapid', 'energetic', 'speedy']
};

// Analyze prompt to detect genre
export const detectGenre = (prompt: string): string => {
  const lowercasePrompt = prompt.toLowerCase();
  let bestMatch = '';
  let highestScore = 0;
  
  // Check each genre for keyword matches
  Object.entries(genreKeywords).forEach(([genre, keywords]) => {
    let score = 0;
    
    keywords.forEach(keyword => {
      // Count occurrences of each keyword
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowercasePrompt.match(regex);
      if (matches) {
        score += matches.length;
      }
    });
    
    // Check for exact genre mention (higher weight)
    const genreRegex = new RegExp(`\\b${genre.toLowerCase()}\\b`, 'gi');
    const exactMatches = lowercasePrompt.match(genreRegex);
    if (exactMatches) {
      score += exactMatches.length * 3; // Triple weight for exact genre mentions
    }
    
    // Update best match if this genre has a higher score
    if (score > highestScore) {
      highestScore = score;
      bestMatch = genre;
    }
  });
  
  // Return detected genre or default if no match
  return highestScore > 0 ? bestMatch : 'EDM';
};

// Analyze prompt to detect mood
export const detectMood = (prompt: string): string => {
  const lowercasePrompt = prompt.toLowerCase();
  let bestMatch = '';
  let highestScore = 0;
  
  Object.entries(moodKeywords).forEach(([mood, keywords]) => {
    let score = 0;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowercasePrompt.match(regex);
      if (matches) {
        score += matches.length;
      }
    });
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = mood;
    }
  });
  
  return highestScore > 0 ? bestMatch : 'Energetic';
};

// Analyze prompt to detect tempo
export const detectTempo = (prompt: string): number => {
  const lowercasePrompt = prompt.toLowerCase();
  let tempoCategory = 'Medium';
  let highestScore = 0;
  
  Object.entries(tempoKeywords).forEach(([tempo, keywords]) => {
    let score = 0;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowercasePrompt.match(regex);
      if (matches) {
        score += matches.length;
      }
    });
    
    if (score > highestScore) {
      highestScore = score;
      tempoCategory = tempo;
    }
  });
  
  // Convert tempo category to BPM
  switch (tempoCategory) {
    case 'Slow':
      return Math.floor(Math.random() * 30) + 70; // 70-100 BPM
    case 'Fast':
      return Math.floor(Math.random() * 40) + 140; // 140-180 BPM
    case 'Medium':
    default:
      return Math.floor(Math.random() * 40) + 100; // 100-140 BPM
  }
};

// Analyze prompt to detect key musical elements
export const detectElements = (prompt: string): string[] => {
  const lowercasePrompt = prompt.toLowerCase();
  const detectedElements: string[] = [];
  
  Object.entries(elementKeywords).forEach(([element, keywords]) => {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (lowercasePrompt.match(regex)) {
        detectedElements.push(element);
        break; // Only add each element once
      }
    }
  });
  
  return detectedElements;
};

// Comprehensive prompt analysis
export interface PromptAnalysis {
  detectedGenre: string;
  detectedMood: string;
  detectedTempo: number;
  detectedElements: string[];
  styleKeywords: string[];
  emotionalTags: string[];
  suggestedEffects: string[];
  intensity: number;
}

import { genreCategories, findMatchingGenres } from '../data/genre-categories';

export const analyzePrompt = (prompt: string): PromptAnalysis => {
  // Extract key information from the prompt
  const detectedGenre = detectGenre(prompt);
  const detectedMood = detectMood(prompt);
  const detectedTempo = detectTempo(prompt);
  const detectedElements = detectElements(prompt);
  
  // Extract emotional tags
  const emotionalTags: string[] = [];
  Object.entries(moodKeywords).forEach(([mood, keywords]) => {
    keywords.forEach(keyword => {
      if (prompt.toLowerCase().includes(keyword)) {
        emotionalTags.push(mood);
      }
    });
  });
  
  // Calculate intensity based on language and punctuation
  const intensity = calculateIntensity(prompt);
  
  // Find matching genres based on emotional content
  const matchingGenres = findMatchingGenres(emotionalTags);
  const suggestedEffects = matchingGenres.map(genre => genre.effect);
  
  // Extract style keywords
  const styleKeywords: string[] = [];
  const styleIndicators = [
    'reverb', 'delay', 'echo', 'distortion', 'filter', 'bass boost',
    'lo-fi', 'vintage', 'modern', 'clean', 'dirty', 'compressed',
    'spacey', 'atmospheric', 'dry', 'wet', 'processed', 'raw',
    'autotune', 'vocoder', 'pitch shift', 'harmonized'
  ];
  
  styleIndicators.forEach(style => {
    if (prompt.toLowerCase().includes(style.toLowerCase())) {
      styleKeywords.push(style);
    }
  });
  
  return {
    detectedGenre,
    detectedMood,
    detectedTempo,
    detectedElements,
    styleKeywords,
    emotionalTags: [...new Set(emotionalTags)], // Remove duplicates
    suggestedEffects,
    intensity
  };
};

// Calculate intensity based on text analysis
function calculateIntensity(prompt: string): number {
  const exclamationCount = (prompt.match(/!/g) || []).length;
  const intensityWords = ['very', 'extremely', 'intense', 'powerful', 'strong'].filter(word =>
    prompt.toLowerCase().includes(word)
  ).length;
  
  // Normalize to 0-1 range
  return Math.min(1, (exclamationCount * 0.2 + intensityWords * 0.3));
}
