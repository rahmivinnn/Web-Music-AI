
import Layout from "@/components/layout/Layout";

const Notifications = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Notifications</h1>
          <p className="text-gray-400">Stay updated on your remix progress and announcements.</p>
        </div>
        
        <div className="bg-studio-card p-6 rounded-lg">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-medium">Recent Notifications</h2>
            <button className="text-studio-accent text-sm hover:underline">
              Mark all as read
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { type: 'success', title: 'Remix Complete', desc: 'Your EDM remix has been successfully generated', time: '10 minutes ago' },
              { type: 'info', title: 'New Genre Available', desc: 'Try our new Synthwave genre with retro reverb effects', time: '2 hours ago' },
              { type: 'success', title: 'Remix Complete', desc: 'Your Text-to-Remix has been successfully generated', time: '1 day ago' },
              { type: 'update', title: 'System Update', desc: 'We\'ve added new remix algorithms for better quality audio', time: '2 days ago' },
              { type: 'info', title: 'Remix Tips', desc: 'Try combining multiple genres for unique sounds', time: '1 week ago' },
            ].map((notif, index) => (
              <div key={index} className={`flex gap-4 p-4 rounded-lg ${index === 0 ? 'bg-gray-800' : ''}`}>
                <div className={`w-2 h-2 rounded-full self-center ${
                  notif.type === 'success' ? 'bg-green-500' : 
                  notif.type === 'info' ? 'bg-studio-accent' : 'bg-amber-500'
                }`}></div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{notif.title}</h4>
                  <p className="text-sm text-gray-400">{notif.desc}</p>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {notif.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
