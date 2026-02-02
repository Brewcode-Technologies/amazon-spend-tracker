'use client';

import { useState } from 'react';
import { FiPieChart, FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white hover:opacity-80 transition">
          <FiPieChart className="text-2xl text-blue-500" />
          <span>SpendScanner</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link href="/#how-it-works" className="hover:text-white transition">How It Works</Link>
          <Link href="/#features" className="hover:text-white transition">Features</Link>
          <Link href="/#pricing" className="hover:text-white transition">Pricing</Link>
          <Link href="/#scanner" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition">
            Start Scanning
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
        >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-950/95 border-b border-white/10 backdrop-blur-xl p-6 flex flex-col gap-4 text-center">
            <Link href="/#how-it-works" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white py-2">How It Works</Link>
            <Link href="/#features" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white py-2">Features</Link>
            <Link href="/#pricing" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white py-2">Pricing</Link>
            <Link href="/#scanner" onClick={() => setIsOpen(false)} className="inline-block px-4 py-3 bg-blue-600 rounded-xl text-white font-semibold">
                Start Scanning
            </Link>
          </div>
      )}
    </nav>
  );
}
