import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onGetStarted: () => void;
}

export default function Navbar({ onGetStarted }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-yellow-500/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <Cpu className="h-8 w-8 text-yellow-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              ChainSensor
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-yellow-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-yellow-400 transition-colors">How It Works</a>
            <a href="#why-us" className="text-gray-300 hover:text-yellow-400 transition-colors">Why Us</a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-yellow-400"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 space-y-4"
          >
            <a href="#features" className="block text-gray-300 hover:text-yellow-400 transition-colors">Features</a>
            <a href="#how-it-works" className="block text-gray-300 hover:text-yellow-400 transition-colors">How It Works</a>
            <a href="#why-us" className="block text-gray-300 hover:text-yellow-400 transition-colors">Why Us</a>
            <button
              onClick={onGetStarted}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-2 rounded-full font-semibold"
            >
              Get Started
            </button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}