import { FiArrowRight, FiShield, FiSearch, FiFileText } from 'react-icons/fi';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Copy Data',
      desc: 'Go to your Amazon Order History or Transactions page. Select and copy the text directly.',
      icon: <FiFileText className="text-3xl text-blue-400" />,
      color: 'from-blue-500/20 to-cyan-500/20',
      border: 'group-hover:border-blue-500/50'
    },
    {
      title: 'Paste & Scan',
      desc: 'Paste the text into the secure scanner box below. Our local engine parses it instantly.',
      icon: <FiSearch className="text-3xl text-purple-400" />,
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'group-hover:border-purple-500/50'
    },
    {
      title: 'Get Insights',
      desc: 'See your total spend, refunds, and category breakdowns in beautiful interactive charts.',
      icon: <FiShield className="text-3xl text-green-400" />,
      color: 'from-green-500/20 to-emerald-500/20',
      border: 'group-hover:border-green-500/50'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 relative overflow-hidden bg-gray-950">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                How It Works
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                No login required. Your data never leaves your device.
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* Connector Line (Desktop) */}
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-10 transform -translate-y-1/2 z-0">
                  <FiArrowRight className="text-3xl text-gray-700 group-hover:text-gray-500 transition-colors duration-300" />
                </div>
              )}
              
              {/* Card */}
              <div className={`h-full p-8 rounded-3xl bg-gray-900/40 backdrop-blur-sm border border-white/5 ${step.border} transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:bg-gray-800/60`}>
                <div className="flex flex-col items-center text-center space-y-6">
                    {/* Icon Container */}
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-500`}>
                        {step.icon}
                    </div>

                    {/* Step Number */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
                        Step 0{i + 1}
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            {step.desc}
                        </p>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
