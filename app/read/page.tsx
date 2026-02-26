'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoBook, IoLanguage, IoArrowBack } from 'react-icons/io5'
import RealtimeReadingTracker from '@/components/layout/features/SpeechRecognition'
import FeaturesShowcase from '@/components/layout/featureShowcase'
import TestimonialsSection from '@/components/layout/tesemonials'

export default function ReadPage() {
  const [selectedClass, setSelectedClass] = useState<'English' | 'Tagalog' | null>(null)

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

              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <span className="text-3xl">🇬🇧</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3">English Class</h2>
              <p className="text-slate-600 mb-6 min-h-[48px]">
                Practice reading in English. Improve your pronunciation, fluency, and comprehension.
              </p>

              <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                <span>Enter Classroom</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </motion.div>

            {/* Tagalog Class Card */}
            <motion.div
              whileHover={{ scale: 1.02, translateY: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedClass('Tagalog')}
              className="cursor-pointer bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <IoLanguage className="w-32 h-32" />
              </div>

              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <span className="text-3xl">🇵🇭</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3">Tagalog Class</h2>
              <p className="text-slate-600 mb-6 min-h-[48px]">
                Magsanay sa pagbabasa sa wikang Tagalog. Pagbutihin ang iyong pagbigkas at pag-unawa.
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