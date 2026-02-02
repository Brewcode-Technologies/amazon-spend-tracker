'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiMail, FiMessageSquare } from 'react-icons/fi';

export default function Contact() {
  return (
    <main className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
        <Navbar />
        
        <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto space-y-12 min-h-[600px]">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Contact Support</h1>
                <p className="text-gray-400">Have questions or found a bug? We'd love to hear from you.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-900/20 p-8 rounded-3xl border border-blue-500/20 hover:border-blue-500/50 transition">
                    <FiMail className="text-4xl text-blue-400 mb-6" />
                    <h2 className="text-xl font-bold text-white mb-2">Email Us</h2>
                    <p className="text-gray-400 mb-6">For general inquiries, partnership, or media.</p>
                    <a href="mailto:support@spendscanner.app" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition">
                        support@spendscanner.app
                    </a>
                </div>

                <div className="bg-purple-900/20 p-8 rounded-3xl border border-purple-500/20 hover:border-purple-500/50 transition">
                    <FiMessageSquare className="text-4xl text-purple-400 mb-6" />
                    <h2 className="text-xl font-bold text-white mb-2">Report a Bug</h2>
                    <p className="text-gray-400 mb-6">Found a parsing error? Send us a screenshot (remove private info).</p>
                    <a href="mailto:bugs@spendscanner.app" className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition">
                        bugs@spendscanner.app
                    </a>
                </div>
            </div>
        </div>

        <Footer />
    </main>
  );
}
