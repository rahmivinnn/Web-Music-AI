
import { Search, Bell, User } from "lucide-react";

const Header = () => {
  return (
    <header className="h-16 flex items-center justify-end px-6 border-b border-gray-800">
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-800 text-gray-400">
          <Search className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-800 text-gray-400 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
      </div>
    </header>
  );
};

export default Header;
