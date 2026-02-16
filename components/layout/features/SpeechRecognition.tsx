"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { IoMic, IoSquare, IoRefresh } from "react-icons/io5";
import ReadingResults from "./readingResult";

const passages = [
  {
    id: "karapatang-sibil",
    title: "Karapatang Sibil",
    language: "fil-PH",
    content: `Karapatang Sibil

Kinikilala ng bayan ang mga karapatang sibil ng mga mamamayan. Ito ay sumasakop sa kalayaan nating makamit ang kaginhawaan at makipag-ugnayan sa isa't isa. Kabilang sa karapatang sibil ay karapatan sa pananalita at pamamahayag, kalayaan sa relihiyon, paninirahan at paglalakbay, magkaroon ng ari-arian, maiwasan ang pagka-alipin, at iba pa.

May karapatan ang bawat isa, maging anuman ang katayuan nito sa lipunan, laban sa di-makatuwirang pagdakip at lihim na pagpapabilanggo. Ang writ of habeas corpus ang kautusang mula sa hukuman na nagsisiguro sa karapatang ito. Dagdag pa rito ang kautusang Miranda (Miranda Rule) na buod ng mga karapatan ng nasasakdal. Itinadhana ang mga ito at ipinagtibay. Kabalikat ng karapatang ito ay ang prinsipyo ng isang nakasuhang mananatiling inosente hanggang hindi napapatunayang nagkasala (innocent until proven guilty) at nang walang pasubali (beyond reasonable doubt). Maipatutupad ito kung isasailalim sa isang mabilis, hayagan, at patas na paglilitis. Ang pagdadaos ng mabilis na paglilitis at pagkakaloob ng hustisya ay ayon na rin sa kasabihang "justice delayed is justice denied."`
  },
  {
    id: "telling-time",
    title: "PASSAGE A: Telling Time",
    language: "en-US",
    content: `PASSAGE A: Telling Time
Humans have used different objects to tell time. In the beginning, they used an hourglass. This is a cylindrical glass with a narrow center which allows sand to flow from its upper to its lower portion. Once all the sand has trickled to the lower portion, one knows that an hour has passed. Using the same idea, water clocks were constructed to measure time by having water flow through a narrow passage from one container to another. On the other hand, sundials allowed people to estimate an hour by looking at the position of the shadow cast by the sun on a plate. At night, people measured time by checking the alignment of the stars in the sky. None of these were accurate, though. The clock was the first accurate instrument for telling time.`
  }
];

interface SpeechRecognitionProps {
  onStop?: (score: number, accuracy: number, startTime: Date, endTime: Date, passageTitle: string) => void;
  studentName?: string;
  classroom?: string;
}

export default function RealtimeReadingTracker({
  onStop,
  studentName = "Student",
  classroom = "Classroom"
}: SpeechRecognitionProps) {
  const [currentPassage, setCurrentPassage] = useState(passages[0]);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  // Pick random passage on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * passages.length);
    setCurrentPassage(passages[randomIndex]);
  }, []);

  const words = useMemo(
    () => currentPassage.content.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean),
    [currentPassage]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [sessionData, setSessionData] = useState({
    finalAccuracy: 0,
    finalWordsRead: 0,
    duration: 0
  });

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
      .split(/\s+/)
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
      const progressValue = (currentIndex / words.length) * 100;
      gsap.to(progressBarRef.current, {
        width: `${progressValue}%`,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [currentIndex, words.length]);

  const start = () => {
    resetTranscript();
    setCurrentIndex(0);
    setAccuracy(0);
    setStartTime(new Date());
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
      language: currentPassage.language,
    });
  };

  const stop = () => {
    SpeechRecognition.stopListening();

    const endTime = new Date();
    const sessionStartTime = startTime || endTime;
    const duration = Math.floor((endTime.getTime() - sessionStartTime.getTime()) / 1000);

    // Save session data for results modal
    setSessionData({
      finalAccuracy: accuracy,
      finalWordsRead: currentIndex,
      duration
    });

    const progressValue = Math.round((currentIndex / words.length) * 100);

    // Call parent callback if provided
    if (onStop && startTime) {
      onStop(accuracy, progressValue, sessionStartTime, endTime, currentPassage.title);
    }

    // Show results modal
    setShowResults(true);
  };

  const handleRefreshPassage = () => {
    if (listening) return;
    const otherPassages = passages.filter(p => p.id !== currentPassage.id);
    const randomIndex = Math.floor(Math.random() * otherPassages.length);
    setCurrentPassage(otherPassages[randomIndex]);
    resetTranscript();
    setCurrentIndex(0);
    setAccuracy(0);
  };

  const progress = Math.round((currentIndex / words.length) * 100);

  return (
    <>
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
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-sm font-medium border border-sky-100">
              <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
              {currentPassage.title}
            </div>
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
            <div className="bg-slate-50 rounded-lg p-8 border border-slate-200 relative group">
              <button
                onClick={handleRefreshPassage}
                disabled={listening}
                className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-sm border border-slate-200 text-slate-400 hover:text-sky-500 hover:border-sky-200 transition-all ${listening ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}
                title="Try another passage"
              >
                <IoRefresh className="w-4 h-4" />
              </button>
              <div className="text-lg md:text-xl leading-loose text-slate-800 whitespace-pre-wrap">
                {currentPassage.content.split(/\s+/).map((word, i) => {
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
                  <IoMic className="w-5 h-5" />
                  Start Reading
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={stop}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
                >
                  <IoSquare className="w-5 h-5" />
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
                  Listening ({currentPassage.language})...
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Reading Results Modal */}
      <ReadingResults
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        studentName={studentName}
        classroom={classroom}
        wordsRead={sessionData.finalWordsRead}
        totalWords={words.length}
        accuracy={sessionData.finalAccuracy}
        duration={sessionData.duration}
        passed={sessionData.finalAccuracy >= 70}
        passThreshold={70}
      />
    </>
  );
}
