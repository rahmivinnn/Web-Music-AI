import { PromptAnalysis } from './promptAnalyzer';

export interface AudioProcessingParams {
  tempo: number;
  effects: string[];
  emotionalIntensity: number;
  genreEffects: string[];
}

export interface AudioEffect {
  name: string;
  params: Record<string, number>;
}

// Map emotional tags to audio processing parameters
const emotionToAudioParams: Record<string, Partial<AudioProcessingParams>> = {
  'energetic': {
    tempo: 140,
    emotionalIntensity: 0.8,
    effects: ['compression', 'exciter']
  },
  'peaceful': {
    tempo: 80,
    emotionalIntensity: 0.3,
    effects: ['reverb', 'delay']
  },
  'intense': {
    tempo: 160,
    emotionalIntensity: 1.0,
    effects: ['distortion', 'compression']
  },
  'melancholic': {
    tempo: 70,
    emotionalIntensity: 0.4,
    effects: ['reverb', 'chorus']
  }
};

// Process audio based on prompt analysis
export function createAudioProcessingChain(analysis: PromptAnalysis): AudioEffect[] {
  const effects: AudioEffect[] = [];
  
  // Add genre-specific effects
  analysis.suggestedEffects.forEach(effect => {
    effects.push(createEffectFromDescription(effect));
  });
  
  // Add emotion-based effects
  analysis.emotionalTags.forEach(emotion => {
    const params = emotionToAudioParams[emotion.toLowerCase()];
    if (params?.effects) {
      params.effects.forEach(effect => {
        effects.push(createBasicEffect(effect));
      });
    }
  });
  
  // Add style-specific effects
  analysis.styleKeywords.forEach(style => {
    effects.push(createBasicEffect(style));
  });
  
  return effects;
}

// Create effect from text description
function createEffectFromDescription(description: string): AudioEffect {
  const effect: AudioEffect = {
    name: 'custom',
    params: {}
  };
  
  if (description.includes('reverb')) {
    effect.name = 'reverb';
    effect.params = {
      decay: 2.0,
      mix: 0.3,
      predelay: 0.1
    };
  } else if (description.includes('delay')) {
    effect.name = 'delay';
    effect.params = {
      time: 0.25,
      feedback: 0.3,
      mix: 0.2
    };
  } else if (description.includes('distortion')) {
    effect.name = 'distortion';
    effect.params = {
      drive: 0.5,
      tone: 0.7
    };
  }
  
  return effect;
}

// Create basic effect with default parameters
function createBasicEffect(name: string): AudioEffect {
  return {
    name,
    params: {
      amount: 0.5,
      mix: 0.5
    }
  };
}