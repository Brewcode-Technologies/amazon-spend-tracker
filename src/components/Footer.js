import { FiGithub, FiTwitter, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="py-8 sm:py-10 md:py-12 bg-gray-950 border-t border-gray-900">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 flex flex-col items-center space-y-6 sm:space-y-8">
        
        {/* Brand & Socials */}
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                SpendScanner
            </h3>
            <div className="flex space-x-5 sm:space-x-6">
                <a href="#" className="text-gray-500 hover:text-white transition"><FiGithub size={18} className="sm:w-5 sm:h-5" /></a>
                <a href="#" className="text-gray-500 hover:text-blue-400 transition"><FiTwitter size={18} className="sm:w-5 sm:h-5" /></a>
                <a href="#" className="text-gray-500 hover:text-green-400 transition"><FiMail size={18} className="sm:w-5 sm:h-5" /></a>
            </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 gap-y-2 text-xs sm:text-sm text-gray-400 font-medium">
            <a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-white transition">Terms of Service</a>
            <a href="/contact" className="hover:text-white transition">Contact Support</a>
        </div>

        {/* Legal Disclaimer */}
        <div className="text-center space-y-2">
            <p className="text-gray-600 text-[10px] sm:text-xs max-w-lg mx-auto leading-relaxed px-4">
                SpendScanner is an independent tool and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Amazon.com, Inc. or any of its subsidiaries.
            </p>
            <p className="text-gray-700 text-[10px] sm:text-xs">
                © 2026 PrudentID. All data stays on your device.
            </p>
        </div>
      </div>
    </footer>
  );
}
