"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Brain, 
  Zap, 
  Target, 
  LineChart, 
  Shield, 
  Sparkles 
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesShowcase() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms detect reading patterns and provide personalized feedback in real-time.",
      color: "sky",
      gradient: "from-sky-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Get immediate insights on pronunciation, fluency, and comprehension as students read.",
      color: "yellow",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: Target,
      title: "Precision Tracking",
      description: "Track every word, syllable, and pause with syllable-level accuracy for detailed analysis.",
      color: "emerald",
      gradient: "from-emerald-500 to-green-600"
    },
    {
      icon: LineChart,
      title: "Progress Insights",
      description: "Visualize student growth over time with comprehensive reports and actionable data.",
      color: "purple",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Student data is encrypted and protected with enterprise-grade security standards.",
      color: "indigo",
      gradient: "from-indigo-500 to-blue-600"
    },
    {
      icon: Sparkles,
      title: "Engaging Experience",
      description: "Gamified elements and interactive features keep students motivated and excited to read.",
      color: "rose",
      gradient: "from-rose-500 to-red-600"
    }
  ];

  useEffect(() => {
    // Animate cards on scroll
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { 
          opacity: 0, 
          y: 100,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, []);

  const colorClasses = {
    sky: "bg-sky-500",
    yellow: "bg-yellow-500",
    emerald: "bg-emerald-500",
    purple: "bg-purple-500",
    indigo: "bg-indigo-500",
    rose: "bg-rose-500"
  };

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen bg-white py-20 px-6 flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Powerful Features for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-purple-600">
              Better Learning
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to transform reading education and help every student reach their full potential
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                whileHover={{ y: -10 }}
                className="group bg-slate-50 rounded-2xl p-8 border-2 border-slate-200 hover:border-sky-500 transition-all duration-300 cursor-pointer"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="mt-4 flex items-center text-sky-500 font-semibold"
                >
                  Learn more
                  <svg 
                    className="w-4 h-4 ml-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-gradient-to-r from-sky-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Explore All Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}