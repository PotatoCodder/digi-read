"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function FeaturesMarquee() {
  const marqueeRow1Ref = useRef(null);
  const marqueeRow2Ref = useRef(null);

  const featuresRow1 = [
    "Speech Recognition",
    "Real-Time Feedback",
    "AI-Powered Analysis",
    "Voice Detection",
    "Fluency Tracking",
    "Progress Reports",
    "Interactive Learning",
    "Smart Assessments"
  ];

  const featuresRow2 = [
    "Pronunciation Guide",
    "Reading Comprehension",
    "Student Dashboard",
    "Performance Metrics",
    "Adaptive Learning",
    "Instant Corrections",
    "Voice Training",
    "Teacher Tools"
  ];

  useEffect(() => {
    // First row animation (left to right)
    const row1Container = marqueeRow1Ref.current;
    const row1Width = row1Container.scrollWidth / 2;

    const tl1 = gsap.timeline({ repeat: -1 });
    tl1.fromTo(row1Container, 
      { x: 0 },
      {
        x: -row1Width,
        duration: 30,
        ease: "none"
      }
    );

    // Second row animation (right to left - opposite direction)
    const row2Container = marqueeRow2Ref.current;
    const row2Width = row2Container.scrollWidth / 2;

    const tl2 = gsap.timeline({ repeat: -1 });
    tl2.fromTo(row2Container,
      { x: -row2Width },
      {
        x: 0,
        duration: 30,
        ease: "none"
      }
    );

    // Hover pause functionality for row 1
    const row1Parent = row1Container.parentElement;
    row1Parent.addEventListener('mouseenter', () => tl1.pause());
    row1Parent.addEventListener('mouseleave', () => tl1.resume());

    // Hover pause functionality for row 2
    const row2Parent = row2Container.parentElement;
    row2Parent.addEventListener('mouseenter', () => tl2.pause());
    row2Parent.addEventListener('mouseleave', () => tl2.resume());

    return () => {
      tl1.kill();
      tl2.kill();
    };
  }, []);

  return (
    <section className="w-full bg-white py-16 overflow-hidden">
      <div className="space-y-6">
        {/* Row 1 - Left to Right */}
        <div className="relative overflow-hidden">
          <div ref={marqueeRow1Ref} className="flex gap-8">
            {/* Duplicate items for seamless loop */}
            {[...featuresRow1, ...featuresRow1].map((feature, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-8 py-4 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-slate-900 whitespace-nowrap">
                    {feature}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="relative overflow-hidden">
          <div ref={marqueeRow2Ref} className="flex gap-8">
            {/* Duplicate items for seamless loop */}
            {[...featuresRow2, ...featuresRow2].map((feature, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-8 py-4 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-slate-900 whitespace-nowrap">
                    {feature}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}