"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTrophy,
  IoTime,
  IoStatsChart,
  IoRefresh,
  IoClose
} from "react-icons/io5";

interface ReadingResultsProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  classroom: string;
  wordsRead: number;
  totalWords: number;
  accuracy: number;
  duration: number; // in seconds
  passed: boolean;
  passThreshold?: number; // default 70%
}

export default function ReadingResults({
  isOpen,
  onClose,
  studentName,
  classroom,
  wordsRead,
  totalWords,
  accuracy,
  duration,
  passed,
  passThreshold = 70
}: ReadingResultsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && scoreRef.current) {
      // Animate the score number counting up
      gsap.fromTo(
        scoreRef.current,
        { textContent: 0 },
        {
          textContent: accuracy,
          duration: 1.5,
          ease: "power2.out",
          snap: { textContent: 1 },
          delay: 0.3
        }
      );
    }
  }, [isOpen, accuracy]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getReadingLevel = (score: number) => {
    if (score >= 95) return {
      level: 'Independent',
      fullText: 'Independent Level',
      color: 'text-emerald-600',
      badgeColor: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      icon: IoTrophy
    };
    if (score >= 90) return {
      level: 'Instructional',
      fullText: 'Instructional Level',
      color: 'text-sky-600',
      badgeColor: 'bg-sky-50 border-sky-200 text-sky-700',
      icon: IoCheckmarkCircle
    };
    return {
      level: 'Frustration',
      fullText: 'Frustration Level',
      color: 'text-amber-600',
      badgeColor: 'bg-amber-50 border-amber-200 text-amber-700',
      icon: IoRefresh
    };
  };

  const readingLevel = getReadingLevel(accuracy);
  const progressPercentage = Math.round((wordsRead / totalWords) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className={`relative px-8 pt-8 pb-6 ${passed
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
              : 'bg-gradient-to-br from-slate-500 to-slate-600'
              }`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <IoClose className="w-5 h-5 text-white" />
              </button>

              <div className="text-center text-white">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                >
                  {passed ? (
                    <IoCheckmarkCircle className="w-12 h-12 text-white" />
                  ) : (
                    <IoCloseCircle className="w-12 h-12 text-white" />
                  )}
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">
                  {passed ? 'Great Job!' : 'Keep Practicing!'}
                </h2>
                <p className="text-white/90 text-lg">
                  {studentName}
                </p>
                <p className="text-white/80 text-sm mt-1">
                  {classroom}
                </p>
              </div>
            </div>

            {/* Score Circle */}
            <div className="px-8 py-8">
              <div className="text-center mb-8">
                <div className="relative inline-flex items-center justify-center">
                  {/* Circular progress */}
                  <svg className="w-48 h-48 transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-slate-100"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      className={passed ? 'text-emerald-500' : 'text-slate-400'}
                      initial={{ strokeDasharray: "552.92", strokeDashoffset: "552.92" }}
                      animate={{
                        strokeDashoffset: 552.92 - (552.92 * accuracy) / 100
                      }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                    />
                  </svg>

                  {/* Score text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex items-baseline">
                      <span
                        ref={scoreRef}
                        className={`text-5xl font-bold ${passed ? 'text-emerald-600' : 'text-slate-700'
                          }`}
                      >
                        0
                      </span>
                      <span className={`text-2xl font-semibold ml-1 ${passed ? 'text-emerald-500' : 'text-slate-500'
                        }`}>
                        %
                      </span>
                    </div>
                    <div className={`text-xl font-bold mt-2 ${readingLevel.color}`}>
                      {readingLevel.level}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">Accuracy</div>
                  </div>
                </div>

                {/* Reading Level Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="mt-6"
                >
                  <div className={`inline-flex items-center gap-2 border px-6 py-3 rounded-full ${readingLevel.badgeColor}`}>
                    <readingLevel.icon className="w-5 h-5" />
                    <span className="font-bold">{readingLevel.fullText}</span>
                  </div>
                </motion.div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-200">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <IoStatsChart className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{wordsRead}</div>
                  <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Words Read</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <IoStatsChart className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{progressPercentage}%</div>
                  <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Progress</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-200">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <IoTime className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{formatDuration(duration)}</div>
                  <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Duration</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Reading Progress</span>
                  <span className="text-sm text-slate-500">{wordsRead} / {totalWords} words</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                    className={`h-full rounded-full ${passed ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                  />
                </div>
              </div>

              {/* Performance Message */}
              <div className={`rounded-lg p-4 mb-6 border ${readingLevel.badgeColor}`}>
                <p className="text-sm">
                  {accuracy >= 95 ? (
                    <><strong>Excellent!</strong> This is an <strong>Independent level</strong> passage. The student can read it successfully without assistance and understands the text well.</>
                  ) : accuracy >= 90 ? (
                    <><strong>Good Effort.</strong> This is an <strong>Instructional level</strong> passage. The student can read it with some assistance and is at the optimal level for learning new skills.</>
                  ) : (
                    <><strong>Challenging.</strong> This is at a <strong>Frustration level</strong>. The text may be too difficult for the student right now, so consider trying an easier passage.</>
                  )}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                >
                  Close
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClose();
                    // You can add a callback here to restart the reading
                  }}
                  className={`flex-1 px-6 py-3 text-white font-medium rounded-lg transition-colors ${passed
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-sky-500 hover:bg-sky-600'
                    }`}
                >
                  {passed ? 'Try Another' : 'Try Again'}
                </motion.button>
              </div>

              {/* Tips */}
              <div className="mt-6 text-center text-xs text-slate-500">
                <p>💡 Results have been saved to the student's record</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}