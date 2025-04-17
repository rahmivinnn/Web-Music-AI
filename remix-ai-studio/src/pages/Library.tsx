
import Layout from "@/components/layout/Layout";

const Library = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Library</h1>
          <p className="text-gray-400">Organize and access all your saved remixes.</p>
        </div>
        
        <div className="bg-studio-card p-6 rounded-lg">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-medium">Saved Remixes</h2>
            <div className="flex items-center gap-2">
              <button className="bg-gray-800 px-3 py-1 rounded text-sm">
                Most Recent
              </button>
              <button className="bg-gray-800 p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <div key={item} className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-all">
                <div className="audio-player-wave mb-2">
                  {Array(8).fill(0).map((_, idx) => (
                    <div key={idx} className="wave-bar" 
                      style={{ height: `${Math.random() * 16 + 4}px` }}></div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">EDM Remix {item}</h4>
                    <span className="text-xs text-gray-400">3:24</span>
                  </div>
                  <button className="p-1.5 rounded-full bg-studio-accent/10 text-studio-accent hover:bg-studio-accent/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Library;
