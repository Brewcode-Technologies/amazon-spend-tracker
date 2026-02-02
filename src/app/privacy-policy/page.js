'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiLock, FiShield, FiEyeOff } from 'react-icons/fi';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
        <Navbar />
        
        <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Privacy Policy</h1>
                <p className="text-gray-400">Last updated: February 2, 2026</p>
            </div>

            <div className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 space-y-8">
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-2xl font-semibold text-blue-400">
                        <FiLock />
                        <h2>We Don't See Your Data</h2>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                        SpendScanner operates entirely on your device (Client-Side). When you paste your transaction data, it is processed directly in your browser's memory. 
                        <strong> We allow no data regarding your transactions to be sent to our servers.</strong>
                    </p>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-2xl font-semibold text-green-400">
                        <FiShield />
                        <h2>Local Storage Only</h2>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                        To improve your experience, we verify functionality by saving a snapshot of your parsed data to your browser's <code>localStorage</code>. 
                        This data remains on your physical device. You can clear this data at any time by clicking the "Clear Data" button within the application or clearing your browser cache.
                    </p>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-2xl font-semibold text-purple-400">
                        <FiEyeOff />
                        <h2>No Third-Party Tracking</h2>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                        We do not use Google Analytics, Facebook Pixels, or any invasive third-party trackers. 
                        We believe in complete financial privacy. Your spending habits are your business, not ours.
                    </p>
                </section>
            </div>
        </div>

        <Footer />
    </main>
  );
}
