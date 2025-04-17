
import { Music2 } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 p-2 rounded">
        <Music2 className="h-5 w-5 text-white" />
      </div>
      <span className="font-bold text-xl text-white">RemixAI</span>
    </div>
  );
};

export default Logo;
