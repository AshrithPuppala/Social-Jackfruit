import React, { useState } from 'react';
import { Activity, Search, AlertCircle, ArrowRight } from 'lucide-react';
import { analyzeSocialPulse } from './services/geminiService';
import { PulseData } from './types';
import PulseDashboard from './components/PulseDashboard';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PulseData | null>(null);
  const [searchPhase, setSearchPhase] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);
    setSearchPhase('Initializing sensors...');

    try {
      // Simulation of phases for better UX since API might take a few seconds
      const phaseInterval = setInterval(() => {
        setSearchPhase(prev => {
          if (prev === 'Initializing sensors...') return 'Scanning social media...';
          if (prev === 'Scanning social media...') return 'Analyzing sentiment...';
          if (prev === 'Analyzing sentiment...') return 'Synthesizing perspectives...';
          return prev;
        });
      }, 1500);

      const result = await analyzeSocialPulse(topic);
      
      clearInterval(phaseInterval);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze the social pulse. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <Activity className="text-cyan-400 w-8 h-8" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            Social Pulse
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl flex flex-col items-center transition-all duration-500">
        
        {/* Search Section - Centered if no data, moves up if data exists */}
        <div className={`w-full max-w-2xl transition-all duration-500 ease-in-out ${data ? 'mb-8' : 'my-20'}`}>
          {!data && !loading && (
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                What's the world thinking?
              </h2>
              <p className="text-slate-400 text-lg">
                Enter a topic to analyze the social divide, trending perspectives, and population sentiment.
              </p>
            </div>
          )}

          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-xl p-2 shadow-2xl">
              <Search className="ml-4 text-slate-400 w-6 h-6" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g., Remote Work, AI Regulation, Electric Vehicles..."
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 text-lg px-4 py-2"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-6 py-3 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <Activity className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Analyze <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {loading && (
            <div className="mt-8 text-center animate-pulse">
              <div className="text-cyan-400 font-mono text-lg">{searchPhase}</div>
              <div className="w-64 h-1 bg-slate-800 rounded-full mx-auto mt-4 overflow-hidden">
                <div className="h-full bg-cyan-500 w-1/3 animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Dashboard Results */}
        {data && !loading && <PulseDashboard data={data} />}
      </main>
    </div>
  );
};

export default App;
