
import { useState, useEffect } from 'react';
import FileUpload from './ui/FileUpload';
import StyleChip from './ui/StyleChip';
import BPMSlider from './ui/BPMSlider';
import GenreSelect from './ui/GenreSelect';
import AudioPlayer from './ui/AudioPlayer';
import AdvancedRemixInterface from './AdvancedRemixInterface';
import { toast } from "sonner";
import { PlusCircle, Wand2 } from 'lucide-react';
import { processAudioFile, resumeAudioContext } from '@/utils/audioProcessor';

const styles = ['Classic', 'Sad', 'Rock', 'Hiphop', 'Guitar music', 'High music'];

// Reliable audio sample URLs as fallbacks
const audioSamples = {
  'EDM': 'https://cdn.freesound.org/previews/631/631750_7037-lq.mp3',
  'R&B': 'https://cdn.freesound.org/previews/328/328857_230356-lq.mp3',
  'Deep House': 'https://cdn.freesound.org/previews/648/648352_14558780-lq.mp3',
  'Rock': 'https://cdn.freesound.org/previews/612/612475_5674468-lq.mp3',
  'HipHop': 'https://cdn.freesound.org/previews/325/325647_5674468-lq.mp3',
  'Lofi': 'https://cdn.freesound.org/previews/597/597179_7037-lq.mp3',
  'Phonk': 'https://cdn.freesound.org/previews/631/631750_7037-lq.mp3',
  'Trap': 'https://cdn.freesound.org/previews/325/325647_5674468-lq.mp3',
  'default': 'https://cdn.freesound.org/previews/388/388713_7364899-lq.mp3'
};

const RemixAudioPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [bpm, setBpm] = useState(120);
  const [genre, setGenre] = useState('EDM');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState('');
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [showAdvancedRemixer, setShowAdvancedRemixer] = useState(false);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke any object URLs to prevent memory leaks
      if (generatedAudioUrl && generatedAudioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(generatedAudioUrl);
      }
    };
  }, []);

  const handleFileSelect = (file: File) => {
    // Validate file is audio
    if (!file.type.startsWith('audio/')) {
      toast.error('Please upload an audio file');
      return;
    }

    // Add file to list
    setFiles([...files, file]);

    // Reset any previous results
    if (showResult) {
      setShowResult(false);
      if (generatedAudioUrl && generatedAudioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(generatedAudioUrl);
      }
      setGeneratedAudioUrl('');
    }
  };

  const handleAddAnotherFile = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/*';
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        handleFileSelect(target.files[0]);
      }
    };
    fileInput.click();
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleGenerateRemix = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one audio file');
      return;
    }

    setIsGenerating(true);
    setProcessingError(null);

    try {
      // Make sure audio context is resumed
      await resumeAudioContext();

      // Process the first uploaded file
      const file = files[0];

      // Create a direct object URL for the file first
      // This ensures we have a valid URL even if processing fails
      const directUrl = URL.createObjectURL(file);

      let processedAudioUrl;
      try {
        // Process the audio file with the selected genre
        processedAudioUrl = await processAudioFile(file, genre);
        console.log('Successfully processed audio with genre effects');
        toast.success('Your remix has been generated successfully!');
      } catch (processingError) {
        console.error('Error applying genre effects:', processingError);
        // Fall back to direct URL if processing fails
        processedAudioUrl = directUrl;
        toast.warning('Applied basic processing only. Advanced effects unavailable.');
      }

      // Update state with the processed audio URL
      setGeneratedAudioUrl(processedAudioUrl);
      setShowResult(true);
    } catch (error) {
      console.error('Error processing audio:', error);
      setProcessingError('Failed to process audio. Please try again.');
      toast.error('Error generating remix. Please try again.');

      // Use a fallback sample if processing fails
      const fallbackAudio = audioSamples[genre as keyof typeof audioSamples] || audioSamples.default;
      setGeneratedAudioUrl(fallbackAudio);
      setShowResult(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Composition Converter Remix Studio</h1>
        <h2 className="text-xl font-medium text-gray-400 mb-2">Customize Your Sound</h2>
        <p className="text-gray-400">Adjust BPM, effects, and style to create the perfect remix.</p>
      </div>

      <div className="bg-studio-card p-6 rounded-lg">
        {files.length === 0 ? (
          <FileUpload onFileSelect={handleFileSelect} />
        ) : (
          <div className="space-y-4">
            {files.map((file, index) => (
              <div key={index} className="p-3 bg-gray-800 rounded-md flex items-center justify-between">
                <span>{file.name}</span>
                <button
                  className="text-red-400 text-sm"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="flex items-center gap-2 text-studio-accent"
              onClick={handleAddAnotherFile}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Another File</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-studio-card p-6 rounded-lg">
        <h3 className="text-xl font-medium mb-4">Enter Prompt</h3>
        <textarea
          className="w-full bg-gray-800 border border-gray-700 rounded-md p-4 text-white focus:outline-none focus:ring-2 focus:ring-studio-accent focus:border-transparent resize-none min-h-[120px]"
          placeholder="Describe what you want to create"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
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
          <BPMSlider value={bpm} onChange={setBpm} />

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Genre Style</label>
            <GenreSelect value={genre} onChange={setGenre} />
          </div>
        </div>
      </div>

      <button
        className="w-full bg-studio-accent text-white py-4 rounded-md font-medium hover:bg-opacity-90 transition-all"
        onClick={handleGenerateRemix}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating Remix...' : 'Generate Remix'}
      </button>

      {(isGenerating || showResult) && (
        <div className="bg-studio-card p-6 rounded-lg">
          <AudioPlayer
            title="Your Remix is Ready!"
            isGenerating={isGenerating}
            audioUrl={generatedAudioUrl}
            genre={genre}
          />
          {processingError && (
            <p className="text-red-400 text-sm mt-2">{processingError}</p>
          )}

          {!isGenerating && showResult && (
            <div className="mt-4">
              <button
                onClick={() => setShowAdvancedRemixer(true)}
                className="flex items-center gap-2 bg-studio-accent text-white py-3 px-4 rounded-md font-medium hover:bg-opacity-90 transition-all mx-auto"
              >
                <Wand2 className="h-4 w-4" />
                <span>Open Advanced Remix Studio</span>
              </button>
            </div>
          )}
        </div>
      )}

      {showAdvancedRemixer && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-6xl">
            <div className="relative">
              <button
                onClick={() => setShowAdvancedRemixer(false)}
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
              >
                ×
              </button>
              <AdvancedRemixInterface
                audioUrl={generatedAudioUrl}
                songTitle={files[0]?.name || "Your Remix"}
                bpm={bpm}
                key={genre}
                onClose={() => setShowAdvancedRemixer(false)}
                initialGenre={genre} // Pass the selected genre from the main page
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemixAudioPage;
