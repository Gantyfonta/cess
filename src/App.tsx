import { ChessBoard } from './components/ChessBoard';
import { Trophy, Github, Info, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Trophy className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Grandmaster <span className="text-indigo-400">Chess</span></h1>
        </div>
        
        <nav className="flex items-center gap-6">
          <button className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            <Info className="w-4 h-4" />
            About
          </button>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/10"
          >
            <Github className="w-4 h-4" />
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto"
        >
          <ChessBoard />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
          <p>© 2026 Grandmaster Chess. Built for Github Pages.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
