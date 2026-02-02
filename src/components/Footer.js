import { FiGithub, FiTwitter, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="py-12 bg-gray-950 border-t border-gray-900">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center space-y-8">
        
        {/* Brand & Socials */}
        <div className="flex flex-col items-center space-y-4">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                SpendScanner
            </h3>
            <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-white transition"><FiGithub size={20} /></a>
                <a href="#" className="text-gray-500 hover:text-blue-400 transition"><FiTwitter size={20} /></a>
                <a href="#" className="text-gray-500 hover:text-green-400 transition"><FiMail size={20} /></a>
            </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-400 font-medium">
            <a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-white transition">Terms of Service</a>
            <a href="/contact" className="hover:text-white transition">Contact Support</a>
        </div>

        {/* Legal Disclaimer */}
        <div className="text-center space-y-2">
            <p className="text-gray-600 text-xs max-w-lg mx-auto leading-relaxed">
                SpendScanner is an independent tool and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Amazon.com, Inc. or any of its subsidiaries.
            </p>
            <p className="text-gray-700 text-xs">
                © 2026 PrudentID. All data stays on your device.
            </p>
        </div>
      </div>
    </footer>
  );
}
