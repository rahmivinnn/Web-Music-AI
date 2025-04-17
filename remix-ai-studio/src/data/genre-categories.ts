// Genre categories with emotional mappings and regional classifications

export interface GenreCategory {
  name: string;
  description: string;
  emotional_tags: string[];
  sub_genres: SubGenre[];
}

export interface SubGenre {
  name: string;
  effect: string;
  mood_tags: string[];
  region?: string;
  instruments?: string[];
}

export const genreCategories: GenreCategory[] = [
  {
    name: "Electronic",
    description: "Digital and synthesized music styles",
    emotional_tags: ["energetic", "futuristic", "euphoric", "intense"],
    sub_genres: [
      {
        name: "EDM",
        effect: "Sidechain compression, Big Room reverb, layered synths",
        mood_tags: ["energetic", "uplifting", "party"],
        instruments: ["synthesizer", "drum machine", "sampler"]
      },
      {
        name: "Deep House",
        effect: "Lowpass filter, Sub Bass thump, atmospheric pads",
        mood_tags: ["deep", "groovy", "hypnotic"],
        instruments: ["bass", "synthesizer", "drums"]
      }
    ]
  },
  {
    name: "Classical",
    description: "Traditional orchestral and chamber music",
    emotional_tags: ["elegant", "sophisticated", "emotional", "dramatic"],
    sub_genres: [
      {
        name: "Orchestral",
        effect: "Concert hall reverb, dynamic expression, rich harmonics",
        mood_tags: ["majestic", "emotional", "powerful"],
        instruments: ["strings", "brass", "woodwinds", "percussion"]
      },
      {
        name: "Chamber Music",
        effect: "Intimate room acoustics, detailed articulation",
        mood_tags: ["intimate", "refined", "delicate"],
        instruments: ["violin", "cello", "piano"]
      }
    ]
  },
  {
    name: "World",
    description: "Traditional and modern music from various cultures",
    emotional_tags: ["cultural", "authentic", "exotic", "spiritual"],
    sub_genres: [
      {
        name: "Indian Classical",
        effect: "Tanpura drone, tabla rhythms, microtonal ornaments",
        mood_tags: ["meditative", "spiritual", "complex"],
        region: "South Asia",
        instruments: ["sitar", "tabla", "tanpura"]
      },
      {
        name: "African Percussion",
        effect: "Complex polyrhythms, natural reverb, call and response",
        mood_tags: ["energetic", "communal", "rhythmic"],
        region: "West Africa",
        instruments: ["djembe", "talking drum", "shekere"]
      }
    ]
  }
];

// Helper function to find matching genres based on emotional content
export function findMatchingGenres(emotions: string[]): SubGenre[] {
  const matches: SubGenre[] = [];
  
  genreCategories.forEach(category => {
    category.sub_genres.forEach(subGenre => {
      const hasMatch = emotions.some(emotion =>
        subGenre.mood_tags.includes(emotion.toLowerCase()) ||
        category.emotional_tags.includes(emotion.toLowerCase())
      );
      
      if (hasMatch) {
        matches.push(subGenre);
      }
    });
  });
  
  return matches;
}