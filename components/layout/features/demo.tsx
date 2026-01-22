"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { IoArrowForward, IoCheckmarkCircle } from "react-icons/io5";
import Link from "next/link";

export default function DemoFeature() {
  const mockProgressRef = useRef(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const demoWords = [
    "Practice",
    "reading",
    "with",
    "real-time",
    "AI",
    "feedback",
    "and",
    "tracking"
  ];

  const features = [
    "Real-time voice recognition",
    "Instant progress tracking",
    "AI-powered feedback",
    "Detailed performance analytics"
  ];

  // Simulate reading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => {
        if (prev >= demoWords.length - 1) {
          return 0; // Loop back
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Animate progress bar
  useEffect(() => {
    if (mockProgressRef.current) {
      const progress = ((currentWordIndex + 1) / demoWords.length) * 100;
      gsap.to(mockProgressRef.current, {
        width: `${progress}%`,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [currentWordIndex]);

  return (
    <section className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Mini Demo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Demo Container */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              {/* Mini Stats */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-1">Progress</p>
                  <p className="text-lg font-bold text-sky-500">
                    {Math.round(((currentWordIndex + 1) / demoWords.length) * 100)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-1">Words</p>
                  <p className="text-lg font-bold text-slate-900">
                    {currentWordIndex + 1}/{demoWords.length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-1">Accuracy</p>
                  <p className="text-lg font-bold text-emerald-500">95%</p>
                </div>
              </div>

              {/* Mini Progress Bar */}
              <div className="mb-6">
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    ref={mockProgressRef}
                    className="h-full bg-sky-500 rounded-full transition-all"
                    style={{ width: "0%" }}
                  />
                </div>
              </div>

              {/* Demo Reading Text */}
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 min-h-[120px]">
                <div className="text-base leading-relaxed">
                  {demoWords.map((word, i) => {
                    let className = "inline-block px-1 mx-0.5 transition-all duration-300 ";

                    if (i < currentWordIndex) {
                      className += "text-slate-400"; // read
                    } else if (i === currentWordIndex) {
                      className += "text-sky-500 font-semibold"; // current
                    } else {
                      className += "text-slate-800"; // unread
                    }

                    return (
                      <motion.span
                        key={i}
                        className={className}
                        animate={
                          i === currentWordIndex
                            ? { scale: [1, 1.05, 1] }
                            : { scale: 1 }
                        }
                        transition={{ duration: 0.3 }}
                      >
                        {word}
                      </motion.span>
                    );
                  })}
                </div>
              </div>

              {/* Mock Button */}
              <div className="mt-6 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
                  <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                  <span className="text-sm text-slate-600">Reading in progress...</span>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute -top-4 -right-4 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg"
            >
              <p className="text-sm font-semibold">Live Demo</p>
            </motion.div>
          </motion.div>

          {/* Right Side - Description */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-sky-50 px-4 py-2 rounded-full border border-sky-200">
              <div className="w-2 h-2 bg-sky-500 rounded-full" />
              <span className="text-sm font-medium text-sky-700">AI-Powered Reading Tool</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Transform Reading
              <span className="block text-sky-500">Assessment Forever</span>
            </h2>

            {/* Description */}
            <p className="text-lg text-slate-600 leading-relaxed">
              Digi-Read uses advanced AI and voice recognition to provide real-time reading 
              assessment and feedback. Watch as students read, track their progress instantly, 
              and get actionable insights to improve fluency.
            </p>

            {/* Features List */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <IoCheckmarkCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors"
              >
                <Link href="/read">Try It Free</Link>
                <IoArrowForward className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg border-2 border-slate-200 hover:border-sky-500 hover:text-sky-500 transition-all"
              >
                View Demo
              </motion.button>
            </div>

            {/* Social Proof */}
            <div className="pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-3">Trusted by educators at:</p>
              <div className="flex flex-wrap gap-6 items-center opacity-60">
                <div className="text-slate-400 font-semibold">Harvard</div>
                <div className="text-slate-400 font-semibold">MIT</div>
                <div className="text-slate-400 font-semibold">Stanford</div>
                <div className="text-slate-400 font-semibold">Yale</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}