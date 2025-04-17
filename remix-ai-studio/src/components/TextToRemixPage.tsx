
import { useState, useEffect } from 'react';
import StyleChip from './ui/StyleChip';
import GenreSelect from './ui/GenreSelect';
import VoiceSelect from './ui/VoiceSelect';
import AudioPlayer from './ui/AudioPlayer';
import { toast } from "sonner";
import { resumeAudioContext } from '@/utils/audioProcessor';
import { playGeneratedAudio } from '@/utils/textToAudioGenerator';
// Import voice samples types but load the actual data dynamically to avoid circular dependencies
import type { VoiceSample } from '../data/voice-samples';

const styles = ['Classic', 'Sad', 'Rock', 'Hiphop', 'Guitar music', 'High music'];

import { analyzePrompt, PromptAnalysis } from '../utils/promptAnalyzer';
import { createAudioProcessingChain, AudioEffect } from '../utils/audioEffectProcessor';
import { genreCategories } from '../data/genre-categories';

const TextToRemixPage = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [voice, setVoice] = useState('Male Pop');
  const [genre, setGenre] = useState('EDM');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState('');
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [promptAnalysis, setPromptAnalysis] = useState<PromptAnalysis | null>(null);
  const [audioEffects, setAudioEffects] = useState<AudioEffect[]>([]);
  const [intensity, setIntensity] = useState(0.5);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke any object URLs to prevent memory leaks
      if (generatedAudioUrl && generatedAudioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(generatedAudioUrl);
      }
    };
  }, []);

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handlePromptAnalysis = () => {
    if (!prompt.trim()) return;

    const analysis = analyzePrompt(prompt);
    setPromptAnalysis(analysis);
    setGenre(analysis.detectedGenre);
    setIntensity(analysis.intensity);

    const effects = createAudioProcessingChain(analysis);
    setAudioEffects(effects);
  };

  useEffect(() => {
    handlePromptAnalysis();
  }, [prompt]);

  const handleGenerateAudio = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description of what you want to create');
      return;
    }

    setIsGenerating(true);
    setProcessingError(null);

    try {
      // Make sure audio context is resumed
      await resumeAudioContext();

      // Generate audio from prompt with selected voice and genre
      const audioUrl = await playGeneratedAudio(prompt, voice, genre);

      // Update state with the generated audio URL
      setGeneratedAudioUrl(audioUrl);
      setShowResult(true);
      toast.success(`Your ${voice} voice with ${genre} style has been generated successfully!`);
    } catch (error) {
      console.error('Error generating audio:', error);
      setProcessingError('Failed to generate audio. Please try again.');
      toast.error('Error generating audio. Please try again.');

      // Import voice samples for fallback
      const { voiceSamples } = await import('../data/voice-samples');
      const fallbackAudio = voiceSamples[voice]?.fallbackUrl || voiceSamples.default.fallbackUrl;
      setGeneratedAudioUrl(fallbackAudio);
      setShowResult(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Describe Your Remix & Let Composition converter Create!</h1>
        <p className="text-gray-400">Enter a prompt, set the BPM, and select a genre to generate your remix.</p>
      </div>

      <div className="bg-studio-card p-6 rounded-lg">
        <h3 className="text-xl font-medium mb-4">Enter Prompt</h3>
        <textarea
          className="w-full bg-gray-800 border border-gray-700 rounded-md p-4 text-white focus:outline-none focus:ring-2 focus:ring-studio-accent focus:border-transparent resize-none min-h-[200px]"
          placeholder="Describe what you want to create"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        {promptAnalysis && (
          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-400">Detected Mood:</span>
              {promptAnalysis.emotionalTags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-700 rounded-md text-sm">{tag}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-400">Musical Elements:</span>
              {promptAnalysis.detectedElements.map(element => (
                <span key={element} className="px-2 py-1 bg-gray-700 rounded-md text-sm">{element}</span>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Intensity:</span>
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-studio-accent"
                  style={{ width: `${promptAnalysis.intensity * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-4">
          {styles.map(style => (
            <StyleChip
              key={style}
              label={style}
              selected={selectedStyles.includes(style)}
              onClick={() => toggleStyle(style)}
            />
          ))}
        </div>
      </div>

      <div className="bg-studio-card p-6 rounded-lg">
        <h3 className="text-xl font-medium mb-4">Remix Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Voice Setup</label>
            <VoiceSelect value={voice} onChange={setVoice} />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Genre Style</label>
            <GenreSelect value={genre} onChange={setGenre} />
          </div>
        </div>
      </div>

      <button
        className="w-full bg-studio-accent text-white py-4 rounded-md font-medium hover:bg-opacity-90 transition-all"
        onClick={handleGenerateAudio}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating Audio...' : 'Generate Audio'}
      </button>

      {(isGenerating || showResult) && (
        <div className="bg-studio-card p-6 rounded-lg">
          <AudioPlayer
            title="Your Audio is Ready!"
            isGenerating={isGenerating}
            audioUrl={generatedAudioUrl}
            genre={genre}
          />
          {processingError && (
            <p className="text-red-400 text-sm mt-2">{processingError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TextToRemixPage;
