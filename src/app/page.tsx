import AIChat from "@/components/AIChat";
import Navigation from "@/components/Navigation";
import Features from "@/components/Features";
import StrategyBuilder from '@/components/StrategyBuilder';


export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-visible bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Optional: Add some subtle animated background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <Navigation />

      <main className="relative z-10 flex min-h-screen flex-col px-4 py-8 sm:px-6 lg:px-8">
        <Features />
        <div className="py-16 bg-gradient-to-b from-blue-900 to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Strategy Builder
              </h2>
              <p className="mt-4 text-xl text-gray-300">
                Drag and drop indicators to create your trading strategy
              </p>
            </div>
            <StrategyBuilder />
          </div>
        </div>
        {/* Hero Section */}
        <div className="mx-auto mb-12 w-full max-w-4xl text-center sm:mb-16 lg:mb-20">
          {/* Main Title */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            AI Trading Backtester
          </h1>
          
          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-blue-100 sm:text-xl md:text-2xl">
            Build, test, and optimize strategies with AI
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            {/* Primary Button - Get Started */}
            <button className="group relative w-full overflow-hidden rounded-lg bg-white px-8 py-4 text-base font-semibold text-blue-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 sm:w-auto sm:px-10 sm:py-5 sm:text-lg">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </button>
            
            {/* Secondary Button - View Demo */}
            <button className="w-full rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 sm:w-auto sm:px-10 sm:py-5 sm:text-lg">
              View Demo
            </button>
          </div>
        </div>

        {/* AI Chat Component */}
        <div className="mx-auto w-full max-w-5xl">
          <AIChat />
        </div>
      </main>
    </div>
  );
}
