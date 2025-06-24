import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight, Database, Zap, Code, Cpu, Shield, Cloud } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <AnimatedBackground />
      <Navbar onGetStarted={handleGetStarted} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent"
              >
                Build Intelligent Sensors from Your Data
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed"
              >
                Transform human behavior and real-world data into custom virtual or physical sensors. 
                No hardware expertise needed — just data, and our AI does the rest.
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all"
                >
                  <Play className="h-5 w-5" />
                  <span>Turn Your Data into a Sensor</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-2 border border-yellow-400/30 text-yellow-400 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-400/10 transition-all"
                >
                  <ArrowRight className="h-5 w-5" />
                  <span>Explore How It Works</span>
                </motion.button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-yellow-400 font-semibold text-lg"
              >
                Raw Data to Smart Sensors — in Minutes
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <img
                src="/Big data course in kochi.jpg"
                alt="AI Data Processing"
                className="rounded-2xl shadow-2xl shadow-yellow-400/20 border border-yellow-400/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Your Data + Our AI = Sensors That Think
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Whether it's environmental patterns, human motion, voice, or biometric input, 
              our platform helps you build adaptive, intelligent sensors using the data you already have.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Database,
                title: "Use real-world or biometric data",
                description: "Import any data format and let our AI understand patterns"
              },
              {
                icon: Zap,
                title: "No-code logic and automation builder",
                description: "Visual interface for creating complex sensor behaviors"
              },
              {
                icon: Code,
                title: "Export as microcontroller code, APIs, or webhook trigger",
                description: "Deploy anywhere from Arduino to cloud services"
              },
              {
                icon: Cpu,
                title: "Custom sensors for agriculture, health, IoT, gaming, and more",
                description: "Unlimited applications across industries"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all"
              >
                <feature.icon className="h-12 w-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Create a Sensor in 3 Simple Steps
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Data",
                description: "Import sensor logs, biometric files, or stream real-time inputs.",
                image: "/Global Data Network.jpg"
              },
              {
                step: "02",
                title: "Define Logic or Let AI Do It",
                description: "Use our no-code builder or auto-generate your custom sensor logic.",
                image: "/The Role of Artificial Intelligence in Cyber Security.jpg"
              },
              {
                step: "03",
                title: "Deploy Anywhere",
                description: "Export as virtual APIs, webhook endpoints, or microcontroller firmware. Compatible with: Arduino, Raspberry Pi, ESP32, APIs, Webhooks, etc.",
                image: "/Artificial Intelligence_ The Future Is Now!.jpg"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative group"
              >
                <div className="bg-gray-900/50 backdrop-blur-md p-8 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all group-hover:transform group-hover:scale-105">
                  <div className="text-6xl font-bold text-yellow-400/20 mb-4">{step.step}</div>
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-48 object-cover rounded-lg mb-6 border border-yellow-400/20"
                  />
                  <h3 className="text-2xl font-semibold mb-4 text-white">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              We're Redefining What a Sensor Can Be
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                title: "Data-First Design",
                description: "Use your context to build smarter systems"
              },
              {
                icon: Code,
                title: "No-Code or Pro Code",
                description: "Works for makers, devs, or enterprises"
              },
              {
                icon: Zap,
                title: "Instant API Generation",
                description: "Create event-based logic from sensor inputs"
              },
              {
                icon: Cpu,
                title: "Custom Hardware Output",
                description: "Download firmware for real-world integration"
              },
              {
                icon: Shield,
                title: "Edge AI Ready",
                description: "Designed for edge computing, offline, and low-power use cases"
              },
              {
                icon: Cloud,
                title: "Cloud Integration",
                description: "Seamless integration with cloud services and APIs"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all text-center"
              >
                <feature.icon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-400/10 to-amber-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Ready to Transform Your Data?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of developers, makers, and enterprises building the future of intelligent sensors.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-12 py-4 rounded-full font-semibold text-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all"
            >
              Start Building Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}