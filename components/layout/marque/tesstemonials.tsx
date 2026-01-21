"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function SchoolMarquee() {
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  const partners = [
    "PwC",
    "Sudotech+",
    "Digi-Read",
    "Web Speech",
    "ICT Department"
  ];

  useEffect(() => {
    const marqueeContainer = marqueeRef.current;

    if (!marqueeContainer) return;

    // Marquee animation (left to right)
    const marqueeWidth = marqueeContainer.scrollWidth / 4; // Divided by 4 since we duplicate 4 times

    const tl = gsap.timeline({ repeat: -1 });
    tl.fromTo(marqueeContainer,
      { x: 0 },
      {
        x: -marqueeWidth,
        duration: 20,
        ease: "none"
      }
    );

    // Hover pause functionality
    const marqueeParent = marqueeContainer.parentElement;
    if (marqueeParent) {
      marqueeParent.addEventListener('mouseenter', () => tl.pause());
      marqueeParent.addEventListener('mouseleave', () => tl.resume());
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="w-full bg-white py-12 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <p className="text-center text-sm font-medium text-slate-500 uppercase tracking-wider">
          Powered By
        </p>
      </div>

      {/* Single Row Marquee */}
      <div className="relative overflow-hidden">
        <div ref={marqueeRef} className="flex gap-16 items-center">
          {/* Duplicate items 4 times for better seamless loop with 5 items */}
          {[...partners, ...partners, ...partners, ...partners].map((partner, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-8 py-3 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <span className="text-2xl font-bold text-slate-400 hover:text-slate-700 whitespace-nowrap transition-colors">
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}