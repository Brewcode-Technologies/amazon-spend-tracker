'use client';

export default function Hero() {
  return (
    <section className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-3 sm:px-4 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center space-y-4 sm:space-y-6 md:space-y-8">
        <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs sm:text-sm font-medium mb-2 sm:mb-4">
          Amazon Spend Tracker 2026
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white mb-4 sm:mb-6 px-2">
          See your real <span className="text-blue-500">Amazon spend</span><br className="hidden sm:block" /> in seconds.
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
          Paste your Amazon transactions → instantly get totals, categories, refunds, and insights. 
          <br className="hidden sm:block" />No login required. Private & secure.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 md:pt-8 px-4">
          <a 
            href="#scanner" 
            className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition shadow-lg shadow-blue-900/20"
          >
            Scan My Spend
          </a>
          <button 
             onClick={() => {
                const scanner = document.getElementById('scanner');
                if(scanner) scanner.scrollIntoView({ behavior: 'smooth' });
                // Note: The Sample Data button is inside the scanner.
             }}
             className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition border border-gray-700"
          >
            See Example Report
          </button>
        </div>
      </div>
    </section>
  );
}
