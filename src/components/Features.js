'use client';

import { FiShield, FiLock, FiPieChart, FiDownload, FiZap, FiLayers } from 'react-icons/fi';

export default function Features() {
  const features = [
    {
      title: 'Privacy First',
      desc: 'Your financial data is sensitive. That’s why SpendScanner runs entirely in your browser. No data is sent to any server, ever.',
      icon: <FiLock className="text-3xl" />,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20'
    },
    {
      title: 'No Login Required',
      desc: 'Forget about handing over your Amazon credentials or API keys. We use the raw text you already have access to.',
      icon: <FiShield className="text-3xl" />,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      title: 'Instant Clarity',
      desc: 'See what you actually spent vs what you thought you spent. Separate refunds and cancellations instantly.',
      icon: <FiPieChart className="text-3xl" />,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      title: 'Year-End & Tax Ready',
      desc: 'Perfect for budgeting and tax prep. Export deductible items vs nondeductible items for your accountant.',
      icon: <FiDownload className="text-3xl" />,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20'
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-16 md:py-24 px-3 sm:px-4 bg-gray-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white px-4">
                Why Use SpendScanner?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
                Most trackers require your password or complex setups. We kept it simple, safe, and powerful.
            </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, i) => (
                <div key={i} className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gray-900/50 backdrop-blur-sm border ${feature.border} hover:bg-gray-800/80 transition duration-300 group`}>
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-2xl sm:text-3xl">{feature.icon}</div>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-xs sm:text-sm">
                        {feature.desc}
                    </p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
