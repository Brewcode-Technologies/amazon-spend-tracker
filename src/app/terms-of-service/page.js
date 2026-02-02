'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
        <Navbar />
        
        <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Terms of Service</h1>
                <p className="text-gray-400">Last updated: February 2, 2026</p>
            </div>

            <div className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 space-y-8 text-gray-300 leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-white mb-3">1. Services Provided</h2>
                    <p>
                        SpendScanner ("we", "us", "our") provides a browser-based tool for parsing and visualizing Amazon transaction history. 
                        The tool is provided "as is" for informational purposes only.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">2. Accuracy of Data</h2>
                    <p>
                        While we strive to ensure our parsing logic is accurate, we cannot guarantee 100% precision due to the variable nature of transaction formats. 
                        Users should verify important financial totals against their official bank statements or Amazon invoices.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">3. Limitation of Liability</h2>
                    <p>
                        In no event shall SpendScanner be liable for any direct, indirect, incidental, or consequential damages arising out of the use or inability to use our service. 
                        This includes, but is not limited to, miscalculations in tax reporting or budgeting errors.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">4. Intellectual Property</h2>
                    <p>
                        The code, design, and graphics of SpendScanner are the property of PrudentID. 
                        Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. We are not affiliated with Amazon.
                    </p>
                </section>
            </div>
        </div>

        <Footer />
    </main>
  );
}
