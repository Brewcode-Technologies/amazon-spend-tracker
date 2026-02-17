'use client';

import { useState, useEffect } from 'react';
import { FiPieChart, FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['how-it-works', 'features', 'pricing', 'scanner'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 font-bold text-base sm:text-lg md:text-xl text-white hover:opacity-80 transition">
          <FiPieChart className="text-xl sm:text-2xl text-blue-500" />
          <span>SpendScanner</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-gray-300">
          <Link 
            href="/#how-it-works" 
            className={`hover:text-white transition pb-1 border-b-2 ${
              activeSection === 'how-it-works' 
                ? 'border-blue-500 text-white' 
                : 'border-transparent'
            }`}
          >
            How It Works
          </Link>
          <Link 
            href="/#features" 
            className={`hover:text-white transition pb-1 border-b-2 ${
              activeSection === 'features' 
                ? 'border-blue-500 text-white' 
                : 'border-transparent'
            }`}
          >
            Features
          </Link>
          <Link 
            href="/#pricing" 
            className={`hover:text-white transition pb-1 border-b-2 ${
              activeSection === 'pricing' 
                ? 'border-blue-500 text-white' 
                : 'border-transparent'
            }`}
          >
            Pricing
          </Link>
          <Link 
            href="/#scanner" 
            className="px-4 lg:px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition shadow-lg hover:shadow-blue-500/50 font-semibold text-sm"
          >
            Start Scanning
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
            className="md:hidden text-gray-300 hover:text-white p-1"
            onClick={() => setIsOpen(!isOpen)}
        >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
          <div className="md:hidden absolute top-14 sm:top-16 left-0 right-0 bg-gray-950/95 border-b border-white/10 backdrop-blur-xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 text-center">
            <Link 
              href="/#how-it-works" 
              onClick={() => setIsOpen(false)} 
              className={`py-2 text-sm transition ${
                activeSection === 'how-it-works' 
                  ? 'text-white border-b-2 border-blue-500' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              How It Works
            </Link>
            <Link 
              href="/#features" 
              onClick={() => setIsOpen(false)} 
              className={`py-2 text-sm transition ${
                activeSection === 'features' 
                  ? 'text-white border-b-2 border-blue-500' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Features
            </Link>
            <Link 
              href="/#pricing" 
              onClick={() => setIsOpen(false)} 
              className={`py-2 text-sm transition ${
                activeSection === 'pricing' 
                  ? 'text-white border-b-2 border-blue-500' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Pricing
            </Link>
            <Link 
              href="/#scanner" 
              onClick={() => setIsOpen(false)} 
              className="inline-block px-5 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-500 rounded-lg sm:rounded-xl text-white text-sm font-semibold transition shadow-lg"
            >
                Start Scanning
            </Link>
          </div>
      )}
    </nav>
  );
}
