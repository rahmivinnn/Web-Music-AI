
import Layout from "@/components/layout/Layout";

const History = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Remix History</h1>
          <p className="text-gray-400">View all your past remixes and generated audio.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-studio-card rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h3 className="font-medium">Remix #{item}</h3>
                <p className="text-sm text-gray-400">Generated on {new Date().toLocaleDateString()}</p>
              </div>
              <div className="p-4">
                <div className="audio-visualizer h-12">
                  {Array(8).fill(0).map((_, index) => (
                    <div 
                      key={index} 
                      className="visualizer-bar h-8" 
                      style={{ 
                        height: `${Math.random() * 20 + 5}px`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-400">2:34</span>
                  <button className="p-2 rounded-full bg-studio-accent text-white hover:bg-opacity-90">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default History;
