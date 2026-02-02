'use client';

import { FiUsers, FiBriefcase, FiHome, FiTrendingUp } from 'react-icons/fi';

export default function SocialProof() {
  const personas = [
    {
      label: 'Families',
      icon: <FiHome className="text-3xl text-blue-400" />,
      desc: 'Managing household budgets and catching recurring subs.',
      bg: 'bg-blue-500/10',
      border: 'hover:border-blue-500/30'
    },
    {
      label: 'Small Business',
      icon: <FiBriefcase className="text-3xl text-purple-400" />,
      desc: 'Separating personal vs. business spend for tax season.',
      bg: 'bg-purple-500/10',
      border: 'hover:border-purple-500/30'
    },
    {
      label: 'Budgeters',
      icon: <FiTrendingUp className="text-3xl text-green-400" />,
      desc: 'Optimizing cash flow and cutting unnecessary costs.',
      bg: 'bg-green-500/10',
      border: 'hover:border-green-500/30'
    }
  ];

  return (
    <section className="py-24 px-4 bg-gray-950 border-t border-gray-900 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-indigo-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Trusted by the community
            </h2>
            <p className="text-gray-400 text-lg">
                Join thousands of users taking control of their financial data.
            </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
            {personas.map((p, i) => (
                <div key={i} className={`p-8 rounded-3xl bg-gray-900/50 backdrop-blur-sm border border-white/5 ${p.border} transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800/60 group`}>
                    <div className={`w-16 h-16 rounded-2xl ${p.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {p.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{p.label}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm">
                        {p.desc}
                    </p>
                </div>
            ))}
        </div>

        {/* User Count / Stat (Optional Flourish) */}
        <div className="mt-16 flex justify-center items-center gap-2 text-sm text-gray-500">
            <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-950 flex items-center justify-center overflow-hidden">
                        <FiUsers className="text-gray-400 text-xs" />
                    </div>
                ))}
            </div>
            <span>and growing every day.</span>
        </div>
      </div>
    </section>
  );
}
