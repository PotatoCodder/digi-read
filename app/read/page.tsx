'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoBook, IoLanguage, IoArrowBack } from 'react-icons/io5'
import RealtimeReadingTracker from '@/components/layout/features/SpeechRecognition'
import FeaturesShowcase from '@/components/layout/featureShowcase'
import TestimonialsSection from '@/components/layout/tesemonials'

export default function ReadPage() {
  const [selectedClass, setSelectedClass] = useState<'English' | 'Filipino' | null>(null)

  if (selectedClass) {
    const passageId = selectedClass === 'English' ? 'telling-time' : 'karapatang-sibil';
    return (
      <div className="relative">
        <button
          onClick={() => setSelectedClass(null)}
          className="absolute top-6 left-6 z-10 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
        >
          <IoArrowBack className="w-5 h-5" /> Back to Classes
        </button>
        <RealtimeReadingTracker
          classroom={selectedClass + " Class"}
          passageId={passageId}
          studentName="Guest Student"
        />
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-slate-50 px-6 py-12 flex items-center justify-center">
        <div className="max-w-4xl w-full pt-10">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Select Your Classroom
            </h1>
            <p className="text-lg text-slate-600">
              Choose a language class to start your reading session
            </p>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {/* English Class Card */}
            <motion.div
              whileHover={{ scale: 1.02, translateY: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedClass('English')}
              className="cursor-pointer bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <IoBook className="w-32 h-32" />
              </div>

              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner overflow-hidden border border-blue-200 relative">
                {/* US Flag */}
                <svg viewBox="0 0 741 390" className="w-[60%] h-[60%] object-cover absolute top-2 left-2 rounded-sm border border-white/50 shadow-sm z-10">
                  <path d="M0 0h741v390H0z" fill="#fff" />
                  <path d="M0 0h741v30H0zm0 60h741v30H0zm0 60h741v30H0zm0 60h741v30H0zm0 60h741v30H0zm0 60h741v30H0zm0 60h741v30H0z" fill="#b22234" />
                  <path d="M0 0h296.4v210H0z" fill="#3c3b6e" />
                  <g fill="#fff">
                    <g id="j">
                      <g id="k">
                        <path id="l" d="M24.7 6.5l.6 2h2.1l-1.7 1.2.6 2-1.7-1.2-1.7 1.2.6-2-1.7-1.2h2.1z" />
                        <use href="#l" x="49.4" /><use href="#l" x="98.8" /><use href="#l" x="148.2" /><use href="#l" x="197.6" />
                      </g>
                      <use href="#k" x="24.7" y="21" />
                    </g>
                    <use href="#j" y="42" /><use href="#j" y="84" /><use href="#j" y="126" />
                    <use href="#k" y="168" />
                  </g>
                </svg>
                {/* UK Flag */}
                <svg viewBox="0 0 60 30" className="w-[60%] h-[60%] object-cover absolute bottom-2 right-2 rounded-sm border border-white/50 shadow-sm">
                  <clipPath id="s">
                    <path d="M0,0 v30 h60 v-30 z" />
                  </clipPath>
                  <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                  <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#s)" stroke="#C8102E" strokeWidth="4" />
                  <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                  <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3">English Class</h2>
              <p className="text-slate-600 mb-6 min-h-[48px]">
                Practice reading in English <span className="text-blue-600 font-semibold">(British English accent)</span>. Improve your pronunciation, fluency, and comprehension.
              </p>

              <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                <span>Enter Classroom</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </motion.div>

            {/* Filipino Class Card */}
            <motion.div
              whileHover={{ scale: 1.02, translateY: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedClass('Filipino')}
              className="cursor-pointer bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <IoLanguage className="w-32 h-32" />
              </div>

              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner overflow-hidden border border-amber-200">
                <svg viewBox="0 0 900 600" className="w-full h-full object-cover">
                  <path d="M0 0h900v300H0z" fill="#0038a8" />
                  <path d="M0 300h900v300H0z" fill="#ce1126" />
                  <path d="M0 0l450 300L0 600z" fill="#fff" />
                  <g fill="#fcd116">
                    <circle cx="150" cy="300" r="50" />
                    <path d="M150 210l10 30-10 10-10-10zM150 390l10-30-10-10-10 10zM240 300l-30 10-10-10 10-10zM60 300l30 10 10-10-10-10zM214 236l-15 26-14 1 1-14zM86 364l15-26 14-1-1 14zM214 364l-26-15-1-14 14 1zM86 236l26 15 1 14-14-1z" />
                  </g>
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3">Filipino Class</h2>
              <p className="text-slate-600 mb-6 min-h-[48px]">
                Magsanay sa pagbabasa sa wikang Filipino. Pagbutihin ang iyong pagbigkas at pag-unawa.
              </p>

              <div className="flex items-center text-amber-600 font-medium group-hover:gap-2 transition-all">
                <span>Pumasok sa Klase</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


    </>
  )
}