"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Mic, Square } from "lucide-react";

const passage = `There are rocks in our Solar System that never flocked together to form planets. Larger ones called asteroids gather in the Asteroid Belt`;

export default function RealtimeReadingTracker() {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  const words = useMemo(
    () => passage.toLowerCase().replace(/[^\w\s]/g, "").split(" "),
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  // GSAP entrance animation
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  // Real-time tracking
  useEffect(() => {
    const spokenWords = transcript
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(" ")
      .filter(Boolean);

    setCurrentIndex(spokenWords.length);

    // Calculate accuracy
    if (spokenWords.length > 0) {
      const correctWords = spokenWords.filter(
        (word, i) => word === words[i]
      ).length;
      setAccuracy(Math.round((correctWords / spokenWords.length) * 100));
    }
  }, [transcript, words]);

  // Animate progress bar
  useEffect(() => {
    if (progressBarRef.current) {
      const progress = (currentIndex / words.length) * 100;
      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [currentIndex, words.length]);

  const start = () => {
    resetTranscript();
    setCurrentIndex(0);
    setAccuracy(0);
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
      language: "en-US",
    });
  };

  const stop = () => {
    SpeechRecognition.stopListening();
  };

  const progress = Math.round((currentIndex / words.length) * 100);

  return (
    <section className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div ref={containerRef} className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Practice Reading
          </h1>
          <p className="text-base text-slate-600">
            Read the passage aloud and track your progress in real-time
          </p>
        </div>

        {/* Main Container */}
        <div className="space-y-8">
          {/* Stats - Simplified */}
          <div className="flex items-center justify-center gap-8 text-center">
            <div>
              <p className="text-sm text-slate-500 mb-1">Words</p>
              <p className="text-2xl font-bold text-slate-900">
                {currentIndex}<span className="text-slate-400">/{words.length}</span>
              </p>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div>
              <p className="text-sm text-slate-500 mb-1">Progress</p>
              <p className="text-2xl font-bold text-sky-500">{progress}%</p>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div>
              <p className="text-sm text-slate-500 mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-emerald-500">{accuracy}%</p>
            </div>
          </div>

          {/* Progress Bar - Minimal */}
          <div className="w-full">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-sky-500 rounded-full transition-all"
                style={{ width: "0%" }}
              />
            </div>
          </div>

          {/* Reading Passage - Clean */}
          <div className="bg-slate-50 rounded-lg p-8 border border-slate-200">
            <div className="text-lg md:text-xl leading-loose text-slate-800">
              {words.map((word, i) => {
                let className = "inline-block px-1 mx-0.5 my-1 transition-colors duration-200 ";

                if (i < currentIndex) {
                  className += "text-slate-400"; // read - faded out
                } else if (i === currentIndex) {
                  className += "text-sky-500 font-semibold"; // current - highlighted
                } else {
                  className += "text-slate-800"; // unread - normal
                }

                return (
                  <span key={i} className={className}>
                    {word}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Controls - Simple & Clear */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            {!listening ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={start}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition-colors"
              >
                <Mic className="w-5 h-5" />
                Start Reading
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={stop}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
              >
                <Square className="w-5 h-5" />
                Stop
              </motion.button>
            )}
          </div>

          {/* Live Indicator - Subtle */}
          <AnimatePresence>
            {listening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 text-sm text-slate-500"
              >
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2 h-2 bg-sky-500 rounded-full"
                />
                Listening...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}