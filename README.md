# AI Music Web - Remix Studio

A web application for generating audio from text and creating music remixes using AI.

## Features

- Text-to-Audio conversion with male and female voice options
- Audio remixing with genre selection
- Voice type selection (Male, Female, Special)
- Audio visualization
- Genre-based audio effects

## Deployment on Vercel

This project is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Use the following settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

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
- `/src/utils` - Utility functions including audio processing
- `/src/data` - Data files for voices, genres, etc.
- `/src/pages` - Page components

## Voice Integration

The application supports both male and female voices using the Web Speech API, with fallback to oscillator-based audio generation if speech synthesis is not available.
