'use client';

import { FiCheck, FiStar } from 'react-icons/fi';

export default function Pricing() {
  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-24 px-3 sm:px-4 bg-gray-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white px-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
             Founder-friendly pricing. No hidden fees.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Monthly */}
          <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gray-900/40 backdrop-blur-sm border border-white/10 hover:border-gray-700 transition flex flex-col relative">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">Monthly</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-white">$5</span>
                <span className="text-xs sm:text-sm text-gray-500">/ mo</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-3 sm:mt-4">Flexible. Cancel anytime.</p>
            </div>
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
              {['Unlimited Parsing', 'Category Breakdown', 'Refund Tracking'].map(f => (
                <li key={f} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
                    <FiCheck className="text-blue-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/5 text-white text-sm font-semibold transition">
                Start Monthly
            </button>
          </div>

          {/* Yearly */}
          <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gray-800/60 backdrop-blur-sm border-2 border-blue-500/50 flex flex-col relative sm:transform sm:-translate-y-4 shadow-2xl shadow-blue-900/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 sm:px-4 py-0.5 sm:py-1 bg-blue-600 rounded-full text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
                Most Popular
            </div>
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-2">Yearly</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-white">$40</span>
                <span className="text-xs sm:text-sm text-gray-500">/ yr</span>
              </div>
              <p className="text-xs sm:text-sm text-blue-200/80 mt-3 sm:mt-4">Save 33% vs monthly.</p>
            </div>
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
              {['Every Pro Feature', 'Year-End PDF Reports', 'Priority Support', 'Subscription Detection'].map(f => (
                <li key={f} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white">
                    <FiCheck className="text-blue-400 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition">
                Get Yearly
            </button>
          </div>

          {/* Lifetime */}
          <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-gray-900/80 to-black border border-purple-500/30 hover:border-purple-500/50 transition flex flex-col relative overflow-hidden group sm:col-span-2 md:col-span-1">
            <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-10 group-hover:opacity-20 transition">
                <FiStar className="text-7xl sm:text-9xl text-purple-500" />
            </div>
            <div className="mb-4 sm:mb-6 relative">
              <h3 className="text-lg sm:text-xl font-semibold text-purple-400 mb-2">Lifetime Launch Deal</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-white">$99</span>
                <span className="text-xs sm:text-sm text-gray-500">/ once</span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200/60 mt-3 sm:mt-4">First 100 customers only.</p>
            </div>
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1 relative">
              {['Lifetime Access', 'All Future Updates', 'Founder\'s Community', 'Early Access Features'].map(f => (
                <li key={f} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
                    <FiCheck className="text-purple-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold transition relative">
                Claim Lifetime
            </button>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12 text-xs sm:text-sm text-gray-500 px-4">
            Share SpendScanner with a friend and get 1 month of Pro free.
        </div>
      </div>
    </section>
  );
}
