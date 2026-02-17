import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import SpendScanner from '@/components/SpendScanner';
import Features from '@/components/Features';
import SocialProof from '@/components/SocialProof';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import PasswordProtection from '@/components/PasswordProtection';

export default function Home() {
  return (
    <PasswordProtection>
      <main className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
        <Navbar />
        <Hero />
        <SpendScanner />
        <HowItWorks />
        <Features />
        <SocialProof />
        <Pricing />
        <Footer />
      </main>
    </PasswordProtection>
  );
}
