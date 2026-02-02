'use client';

import { FiCheck, FiStar } from 'react-icons/fi';

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 bg-gray-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
             Founder-friendly pricing. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Monthly */}
          <div className="p-8 rounded-3xl bg-gray-900/40 backdrop-blur-sm border border-white/10 hover:border-gray-700 transition flex flex-col relative">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Monthly</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$5</span>
                <span className="text-sm text-gray-500">/ mo</span>
              </div>
              <p className="text-sm text-gray-400 mt-4">Flexible. Cancel anytime.</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Unlimited Parsing', 'Category Breakdown', 'Refund Tracking'].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                    <FiCheck className="text-blue-500" /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white font-semibold transition">
                Start Monthly
            </button>
          </div>

          {/* Yearly */}
          <div className="p-8 rounded-3xl bg-gray-800/60 backdrop-blur-sm border-2 border-blue-500/50 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-blue-900/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-blue-600 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                Most Popular
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-400 mb-2">Yearly</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$40</span>
                <span className="text-sm text-gray-500">/ yr</span>
              </div>
              <p className="text-sm text-blue-200/80 mt-4">Save 33% vs monthly.</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Every Pro Feature', 'Year-End PDF Reports', 'Priority Support', 'Subscription Detection'].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-white">
                    <FiCheck className="text-blue-400" /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition">
                Get Yearly
            </button>
          </div>

          {/* Lifetime */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-gray-900/80 to-black border border-purple-500/30 hover:border-purple-500/50 transition flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <FiStar className="text-9xl text-purple-500" />
            </div>
            <div className="mb-6 relative">
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Lifetime Launch Deal</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$99</span>
                <span className="text-sm text-gray-500">/ once</span>
              </div>
              <p className="text-sm text-purple-200/60 mt-4">First 100 customers only.</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1 relative">
              {['Lifetime Access', 'All Future Updates', 'Founder\'s Community', 'Early Access Features'].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                    <FiCheck className="text-purple-500" /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition relative">
                Claim Lifetime
            </button>
          </div>
        </div>

        <div className="text-center mt-12 text-sm text-gray-500">
            Share SpendScanner with a friend and get 1 month of Pro free.
        </div>
      </div>
    </section>
  );
}
