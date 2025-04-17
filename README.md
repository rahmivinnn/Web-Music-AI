# AI Music Web - Advanced Remix Studio

A powerful web application for generating audio from text and creating professional-grade music remixes using AI technology.

## Features

- Text-to-Audio conversion with multiple voice options (male, female, deep, high, robotic, group)
- Advanced multi-track audio remixing with detailed control
- 18+ genre styles including R&B, Trap, Rock, EDM, House variants, and more
- Comprehensive voice customization with various effects
- Real-time audio visualization and waveform display
- Genre-specific audio processing with detailed effect controls
- Individual track controls (solo, mute, volume)
- Advanced remix options (tempo, intensity, bass boost, reverb)
- Multiple export formats and sharing options

## Deployment

### Netlify Deployment

This project is configured for easy deployment on Netlify:

1. Connect your GitHub repository to Netlify
2. Netlify will automatically detect the configuration in `netlify.toml`
3. The build settings are already configured:
   - Base directory: `remix-ai-studio/`
   - Build command: `npm run build`
   - Publish directory: `dist`

### Vercel Deployment

This project is also configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Use the following settings:
   - Framework Preset: Vite
   - Build Command: `cd remix-ai-studio && npm install && npm run build`
   - Output Directory: `remix-ai-studio/dist`

## Development

To run the project locally:

```bash
# Navigate to the project directory
cd remix-ai-studio

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Project Structure

- `/src/components` - React components
  - `AdvancedRemixInterface.tsx` - Multi-track remix interface with detailed controls
  - `RemixAudioPage.tsx` - Main remix page with upload and basic controls
  - `TextToRemixPage.tsx` - Text-to-audio generation page
- `/src/utils` - Utility functions including audio processing
  - `audioProcessor.ts` - Core audio processing functions
  - `remixProcessor.ts` - Advanced remix processing for multi-track audio
- `/src/data` - Data files for voices, genres, etc.
  - `voice-samples.ts` - Voice configuration and sample data
- `/src/pages` - Page components

## Voice Integration

The application supports multiple voice types (male, female, deep, high, robotic, group) using the Web Speech API, with fallback to oscillator-based audio generation. The advanced remix interface provides detailed voice customization options including:

- Voice type selection
- Auto-tune effect
- Distortion and reverb
- Special effects (telephone, megaphone, underwater)
- Genre-specific vocal processing

## Advanced Remix Interface

The application features a professional-grade remix interface with:

### Multi-track Editing
- 7 distinct audio tracks (Lead Vocals, Backing Vocals, Drums, Bass, Melody, FX, Synth)
- Individual controls for each track (solo, mute, volume)
- Track-specific waveform visualization
- Voice type selection for vocal tracks

### Genre Processing
- 18+ genre styles with detailed effect configurations
- Genre-specific audio processing for each track type
- Automatic waveform visualization based on genre and track type
- Real-time audio transformation

### Advanced Controls
- Remix intensity adjustment
- Tempo control
- Voice processing options
- Bass boost
- Reverb amount
- Advanced settings for vocal isolation and beat detection

### Export Options
- Multiple export formats (MP3, WAV, Stems)
- Save to library functionality
- Sharing options
- Remix naming and privacy settings
