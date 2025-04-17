
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import RemixAudioPage from "@/components/RemixAudioPage";
import TextToRemixPage from "@/components/TextToRemixPage";
import { Music, FileMusic } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Music Studio</h1>
        <p className="text-gray-400">Create stunning music remixes and generate audio from text with AI</p>
      </div>
      
      <Tabs defaultValue="remix" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="remix" className="flex items-center gap-2">
            <FileMusic className="h-4 w-4" />
            <span>Upload & Remix Audio</span>
          </TabsTrigger>
          <TabsTrigger value="text-to-remix" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            <span>Text-to-Remix Generator</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="remix">
          <RemixAudioPage />
        </TabsContent>
        <TabsContent value="text-to-remix">
          <TextToRemixPage />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Index;
