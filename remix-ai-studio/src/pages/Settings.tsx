
import { useState } from "react";
import Layout from "@/components/layout/Layout";

const Settings = () => {
  const [audioQuality, setAudioQuality] = useState("high");
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Settings</h1>
          <p className="text-gray-400">Customize your remix experience.</p>
        </div>
        
        <div className="bg-studio-card p-6 rounded-lg">
          <h2 className="text-xl font-medium mb-6">Audio Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Output Quality</label>
              <div className="grid grid-cols-3 gap-2">
                {["low", "medium", "high"].map(quality => (
                  <button
                    key={quality}
                    className={`py-2 px-4 rounded border ${
                      audioQuality === quality
                        ? 'bg-studio-accent text-white border-studio-accent'
                        : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                    }`}
                    onClick={() => setAudioQuality(quality)}
                  >
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Auto-Save Generated Remixes</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-studio-accent"></div>
                <span className="ml-3 text-sm font-medium text-gray-300">Enabled</span>
              </label>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Default BPM</label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="50"
                  max="200"
                  defaultValue="120"
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-4 w-12 text-center bg-gray-800 py-1 px-2 rounded text-sm">120</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-studio-card p-6 rounded-lg">
          <h2 className="text-xl font-medium mb-6">App Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Dark Mode</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-studio-accent"></div>
                <span className="ml-3 text-sm font-medium text-gray-300">Enabled</span>
              </label>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Notification Preferences</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-700 text-studio-accent focus:ring-studio-accent" />
                  <span className="ml-2 text-sm">Remix completed</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-700 text-studio-accent focus:ring-studio-accent" />
                  <span className="ml-2 text-sm">New features</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded bg-gray-800 border-gray-700 text-studio-accent focus:ring-studio-accent" />
                  <span className="ml-2 text-sm">Tips & tutorials</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
