"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { IoStar, IoChatbubble, IoPeople, IoTrendingUp, IoTrophy } from "react-icons/io5";

export default function TestimonialsSection() {
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "3rd Grade Teacher",
      school: "Riverside Elementary",
      content: "Digi-Read has transformed how I track student progress. The real-time feedback helps me identify struggling readers instantly and provide targeted support.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Reading Specialist",
      school: "Lincoln Middle School",
      content: "The AI-powered analysis is incredibly accurate. It's like having a teaching assistant that never sleeps. My students' fluency scores have improved by 40% this semester!",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Principal",
      school: "Oakwood Academy",
      content: "Implementation was seamless and the data insights are invaluable. Teachers love it, students are engaged, and parents appreciate the transparent progress reports.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Teachers", icon: IoPeople },
    { value: "250K+", label: "Students Helped", icon: IoTrendingUp },
    { value: "98%", label: "Satisfaction Rate", icon: IoTrophy },
    { value: "45%", label: "Average Improvement", icon: IoStar }
  ];

  useEffect(() => {
    // Animate stats counter
    statsRef.current.forEach((stat, index) => {
      if (stat) {
        gsap.fromTo(
          stat,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: "back.out(1.7)"
          }
        );
      }
    });
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-6 flex items-center">
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
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <IoChatbubble className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Loved by Educators
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
              Trusted by Schools
            </span>
          </h2>
          
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Join thousands of teachers who are transforming reading education with Digi-Read
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                ref={(el) => { statsRef.current[index] = el; }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-slate-300">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all"
            >
              {/* Quote Icon */}
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                <IoChatbubble className="w-6 h-6 text-sky-500" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <IoStar
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-slate-700 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-slate-600">{testimonial.role}</p>
                  <p className="text-xs text-slate-500">{testimonial.school}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-slate-300 mb-6">Ready to see the difference?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Start Free Trial
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}