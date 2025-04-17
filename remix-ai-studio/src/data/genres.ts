
export interface Genre {
  label: string;
  effect: string;
}

export const genres: Genre[] = [
  {"label": "EDM", "effect": "Sidechain, Big Room reverb"},
  {"label": "R&B", "effect": "Smooth harmonics, Soul EQ"},
  {"label": "Deep House", "effect": "Lowpass filter, Sub Bass thump"},
  {"label": "Phonk", "effect": "Memphis vocal FX, retro tape delay"},
  {"label": "Trap", "effect": "808 boost, glitch hats"},
  {"label": "HipHop", "effect": "Vinyl crackle, Boom Bap drums"},
  {"label": "Lofi", "effect": "Vinyl hiss, warm tape tone"},
  {"label": "Synthwave", "effect": "Analog synth FX, retro reverb"},
  {"label": "Trance", "effect": "Arpeggiator, gated reverb"},
  {"label": "Pop", "effect": "AutoTune FX, major key melodies"},
  {"label": "Reggaeton", "effect": "Latin drum groove, bounce FX"},
  {"label": "Rock", "effect": "Distorted guitars, room mic"},
  {"label": "Soul", "effect": "Vintage EQ, soulful vox"},
  {"label": "Drill", "effect": "Dark bass, sliding 808s"},
  {"label": "Jazzhop", "effect": "Sax overlays, jazzy drums"},
  {"label": "Chillhop", "effect": "Relaxed tempo, soft synths"},
  {"label": "Ambient", "effect": "Drone pads, lush textures"},
  {"label": "DnB", "effect": "Fast breakbeats, sub-driven FX"},
  {"label": "Future Bass", "effect": "Chopped synths, sidechain"},
  {"label": "Techno", "effect": "Minimal loops, modular FX"},
  {"label": "Garage", "effect": "Shuffled hats, stutter vox"},
  {"label": "Indie", "effect": "Clean guitar, analog synth"},
  {"label": "Hardstyle", "effect": "Distorted kicks, screeches"},
  {"label": "Acoustic", "effect": "Live mic reverb, soft compression"},
  {"label": "Classical", "effect": "Reverbed piano & strings"},
  {"label": "Country", "effect": "Clean guitar twang, slapback delay"},
  {"label": "Funk", "effect": "Wah guitar, slap bass"},
  {"label": "Disco", "effect": "Four-on-the-floor, glitter FX"},
  {"label": "Dubstep", "effect": "Wobble bass, heavy drops"},
  {"label": "Electro", "effect": "Bitcrush, retro drum machines"},
  {"label": "K-pop", "effect": "Clean vocal fx, dance synths"},
  {"label": "J-pop", "effect": "Bright harmonies, cute FX"},
  {"label": "Cinematic", "effect": "Orchestral layering, trailer FX"},
  {"label": "Meditation", "effect": "Binaural beats, slow delay"},
  {"label": "Afrobeats", "effect": "Percussive rhythm, vocal chops"},
  {"label": "Moombahton", "effect": "Midtempo bounce, pitch shifts"},
  {"label": "Latin", "effect": "Rhythmic guitar, maracas"},
  {"label": "Punk", "effect": "Grungy tone, garage compression"},
  {"label": "Metal", "effect": "Heavy distortion, punchy drums"},
  {"label": "Orchestral", "effect": "Layered strings, epic brass"},
  {"label": "House", "effect": "4/4 rhythm, filtered synths"},
  {"label": "Tech House", "effect": "Deep bass, rhythmic percussion"},
  {"label": "Boom Bap", "effect": "Old school drums, vocal chops"},
  {"label": "Psytrance", "effect": "High tempo, psychedelic FX"},
  {"label": "Glitch", "effect": "Bitcrush, audio cuts"},
  {"label": "Vaporwave", "effect": "Slowed samples, retro filters"},
  {"label": "Reggae", "effect": "Skank guitar, dub FX"},
  {"label": "Dancehall", "effect": "Island drum grooves, vocal FX"},
  {"label": "Bossa Nova", "effect": "Soft jazz chords, latin rhythm"},
  {"label": "Game OST", "effect": "8-bit synth, ambient FX"},
  {"label": "Anime OST", "effect": "Emotional chords, layered voices"},
  {"label": "Drumstep", "effect": "Half-time drums, dubstep bass"},
  {"label": "Neo Soul", "effect": "Smooth chords, layered harmonies"},
  {"label": "Blues", "effect": "Slide guitar, analog tape FX"},
  {"label": "Gospel", "effect": "Choir layering, clean reverb"},
  {"label": "Experimental", "effect": "Random modulation, pitch FX"},
  {"label": "Electro Swing", "effect": "Brass loops, swing drums"},
  {"label": "Tribal", "effect": "Percussive chant FX"},
  {"label": "Industrial", "effect": "Metal hits, harsh filters"},
  {"label": "Chiptune", "effect": "8-bit waveforms, pixel drums"},
  {"label": "Ska", "effect": "Offbeat rhythm, brass section"},
  {"label": "Tango", "effect": "Bandoneon synth, dramatic FX"},
  {"label": "Bollywood", "effect": "Indian drums, vocal FX"},
  {"label": "Arabic Pop", "effect": "Oud licks, exotic scales"},
  {"label": "Persian Chill", "effect": "Santur FX, desert echo"},
  {"label": "Celtic", "effect": "Flutes, rolling percussion"},
  {"label": "Chinese Traditional", "effect": "Guqin FX, pipa reverb"},
  {"label": "Korean Ballad", "effect": "Emotional keys, soft vocals"},
  {"label": "Gamelan Fusion", "effect": "Balinese gongs, modern beat"},
  {"label": "Thai Funk", "effect": "Molam synths, funky rhythm"},
  {"label": "Lo-fi Jazz", "effect": "Dusty sax, vinyl textures"},
  {"label": "Slap House", "effect": "Heavy bass slaps, dark FX"},
  {"label": "Progressive", "effect": "Long build, airy reverb"},
  {"label": "Future Garage", "effect": "Pitch modulation, moody FX"},
  {"label": "UK Drill", "effect": "Staggered hats, low-end focus"},
  {"label": "Cloud Rap", "effect": "Echo vox, ambient layers"},
  {"label": "Bass House", "effect": "Growling basslines"},
  {"label": "Melodic Dubstep", "effect": "Emo synths, vocal FX"},
  {"label": "Tropical House", "effect": "Steel drums, airy FX"},
  {"label": "Dark Pop", "effect": "Moody synths, detune FX"},
  {"label": "Cyberpunk", "effect": "Glitch synths, hard hits"},
  {"label": "Fantasy OST", "effect": "Mystic pads, cinematic FX"},
  {"label": "Kids Pop", "effect": "Bright melodies, simple vocals"},
  {"label": "Experimental Trap", "effect": "Abstract hats, reverse FX"},
  {"label": "Emo Rock", "effect": "Crunch guitars, sad vocal FX"},
  {"label": "Dream Pop", "effect": "Reverb-heavy vox, ambient FX"},
  {"label": "Hardcore", "effect": "Fast BPM, distorted drums"},
  {"label": "Breakcore", "effect": "Chaotic edits, glitch drums"},
  {"label": "Shoegaze", "effect": "Wall of sound, muffled FX"},
  {"label": "Post-Rock", "effect": "Clean guitar build, long reverb"},
  {"label": "Soundtrack", "effect": "Emotive chord progression"},
  {"label": "Acapella Remix", "effect": "Dry vocals, beat-matched FX"},
  {"label": "Vocal Chop", "effect": "Chopped and tuned vox"},
  {"label": "Noise Pop", "effect": "Layered distortion"},
  {"label": "AI Core", "effect": "Robotic filter, generated voices"}
];
