"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { IoMic, IoSquare, IoRefresh, IoWarning, IoVolumeMedium, IoInformationCircle } from "react-icons/io5";
import ReadingResults from "./readingResult";

const passages = [
  {
    id: "karapatang-sibil",
    title: "Karapatang Sibil",
    language: "fil-PH",
    content: `Kinikilala ng bayan ang mga karapatang sibil ng mga mamamayan. Ito ay sumasakop sa kalayaan nating makamit ang kaginhawaan at makipag-ugnayan sa isa't isa. Kabilang sa karapatang sibil ay karapatan sa pananalita at pamamahayag, kalayaan sa relihiyon, paninirahan at paglalakbay, magkaroon ng ari-arian, maiwasan ang pagka-alipin, at iba pa.

May karapatan ang bawat isa, maging anuman ang katayuan nito sa lipunan, laban sa di-makatuwirang pagdakip at lihim na pagpapabilanggo. Ang writ of habeas corpus ang kautusang mula sa hukuman na nagsisiguro sa karapatang ito. Dagdag pa rito ang kautusang Miranda (Miranda Rule) na buod ng mga karapatan ng nasasakdal. Itinadhana ang mga ito at ipinagtibay. Kabalikat ng karapatang ito ay ang prinsipyo ng isang nakasuhang mananatiling inosente hanggang hindi napapatunayang nagkasala (innocent until proven guilty) at nang walang pasubali (beyond reasonable doubt). Maipatutupad ito kung isasailalim sa isang mabilis, hayagan, at patas na paglilitis. Ang pagdadaos ng mabilis na paglilitis at pagkakaloob ng hustisya ay ayon na rin sa kasabihang "justice delayed is justice denied."`
  },
  {
    id: "telling-time",
    title: "PASSAGE A: Telling Time",
    language: "en-US",
    content: `Humans have used different objects to tell time. In the beginning, they used an hourglass. This is a cylindrical glass with a narrow center which allows sand to flow from its upper to its lower portion. Once all the sand has trickled to the lower portion, one knows that an hour has passed. Using the same idea, water clocks were constructed to measure time by having water flow through a narrow passage from one container to another. On the other hand, sundials allowed people to estimate an hour by looking at the position of the shadow cast by the sun on a plate. At night, people measured time by checking the alignment of the stars in the sky. None of these were accurate, though. The clock was the first accurate instrument for telling time.`
  }
];

interface SpeechRecognitionProps {
  onStop?: (score: number, accuracy: number, startTime: Date, endTime: Date, passageTitle: string) => void;
  studentName?: string;
  classroom?: string;
  passageId?: string;
}

// Helper function for fuzzy string matching - makes recognition MUCH more forgiving/accurate
const levenshtein = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i += 1) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[j][0] = j;
  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return matrix[b.length][a.length];
};

const isMatch = (spoken: string, expected: string) => {
  const normSpoken = spoken.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normExpected = expected.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (normSpoken === normExpected) return true;
  // If words are very short, require exact match
  if (normExpected.length <= 3 && normSpoken !== normExpected) return false;
  // Allow 1 mistake for every 3 characters + 1 base mistake
  // This helps massively with accent differences and misheard tagalog words
  const maxDistance = Math.floor(normExpected.length / 3) + 1;
  return levenshtein(normSpoken, normExpected) <= maxDistance;
};

export default function RealtimeReadingTracker({
  onStop,
  studentName = "Student",
  classroom = "Classroom",
  passageId
}: SpeechRecognitionProps) {
  const [currentPassage, setCurrentPassage] = useState(() => {
    if (passageId) {
      return passages.find(p => p.id === passageId) || passages[0];
    }
    return passages[0];
  });
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  const words = useMemo(
    () => currentPassage.content.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean),
    [currentPassage]
  );

  const originalWords = useMemo(
    () => currentPassage.content.split(/\s+/).filter(Boolean),
    [currentPassage]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [wordStatuses, setWordStatuses] = useState<('correct' | 'wrong' | 'unread')[]>([]);
  const [sessionData, setSessionData] = useState({
    finalAccuracy: 0,
    finalWordsRead: 0,
    duration: 0
  });

  // Pick passage based on passageId or random
  useEffect(() => {
    if (passageId) {
      const p = passages.find(p => p.id === passageId);
      if (p) setCurrentPassage(p);
    } else {
      const randomIndex = Math.floor(Math.random() * passages.length);
      setCurrentPassage(passages[randomIndex]);
    }
    resetTranscript();
    setCurrentIndex(0);
    setAccuracy(0);
    setWordStatuses([]);
  }, [passageId, resetTranscript]);

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

  // Real-time tracking with accurate FUZZY matching
  useEffect(() => {
    if (!transcript) return;

    const spokenWords = transcript
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    let wStatus: ('correct' | 'wrong' | 'unread')[] = Array(words.length).fill('unread');

    let spokenIdx = 0;
    let passageIdx = 0;
    let correctCount = 0;

    // Lookahead window size to recover from misheard/extra/skipped words
    const LOOKAHEAD_WINDOW = 5;

    while (spokenIdx < spokenWords.length && passageIdx < words.length) {
      const sWord = spokenWords[spokenIdx];
      const pWord = words[passageIdx];

      if (isMatch(sWord, pWord)) {
        wStatus[passageIdx] = 'correct';
        correctCount++;
        spokenIdx++;
        passageIdx++;
      } else {
        // 1. Check if the user skipped words (is sWord matching a future passage word?)
        let foundInPassage = false;
        for (let i = 1; i <= LOOKAHEAD_WINDOW && passageIdx + i < words.length; i++) {
          if (isMatch(sWord, words[passageIdx + i])) {
            for (let j = 0; j < i; j++) wStatus[passageIdx + j] = 'wrong'; // mark skipped words as wrong
            passageIdx += i;
            foundInPassage = true;
            break;
          }
        }

        if (!foundInPassage) {
          // 2. Check if the user said extra words (is pWord matching a future spoken word?)
          let foundInSpoken = false;
          for (let i = 1; i <= LOOKAHEAD_WINDOW && spokenIdx + i < spokenWords.length; i++) {
            if (isMatch(spokenWords[spokenIdx + i], pWord)) {
              spokenIdx += i; // skip the extra spoken words
              foundInSpoken = true;
              break;
            }
          }

          if (!foundInSpoken) {
            // 3. No match found, mark wrong and increment both to move on
            wStatus[passageIdx] = 'wrong';
            spokenIdx++;
            passageIdx++;
          }
        }
      }
    }

    setWordStatuses(wStatus);
    setCurrentIndex(Math.min(passageIdx, words.length - 1));

    if (passageIdx > 0) {
      setAccuracy(Math.round((correctCount / passageIdx) * 100));
    } else {
      setAccuracy(0);
    }

    // Auto stop if completed
    if (passageIdx >= words.length && listening) {
      setTimeout(() => stop(), 1000);
    }
  }, [transcript, words, listening]);

  // Animate progress bar
  useEffect(() => {
    if (progressBarRef.current) {
      const progressValue = (currentIndex / words.length) * 100;
      gsap.to(progressBarRef.current, {
        width: `${Math.min(progressValue, 100)}%`,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [currentIndex, words.length]);

  // Auto-scroll to active word so user never loses their place
  useEffect(() => {
    if (activeWordRef.current && textContainerRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center", // Keeps the active text clearly in the center of the box
      });
    }
  }, [currentIndex]);

  const speakWord = (word: string, lang: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const cleanWord = word.replace(/[^\w\s'-]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanWord);
      utterance.rate = 0.8;  // Slower for clarity
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  };

  const start = () => {
    resetTranscript();
    setCurrentIndex(0);
    setAccuracy(0);
    setWordStatuses([]);
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

    setSessionData({
      finalAccuracy: accuracy,
      finalWordsRead: currentIndex,
      duration
    });

    const progressValue = Math.round((currentIndex / words.length) * 100);

    if (onStop && startTime) {
      onStop(accuracy, progressValue, sessionStartTime, endTime, currentPassage.title);
    }

    setShowResults(true);
  };

  const handleRefreshPassage = () => {
    if (listening) return;
    if (!passageId) {
      const otherPassages = passages.filter(p => p.id !== currentPassage.id);
      const randomIndex = Math.floor(Math.random() * otherPassages.length);
      if (otherPassages.length > 0) {
        setCurrentPassage(otherPassages[randomIndex]);
      }
    }
    resetTranscript();
    setCurrentIndex(0);
    setAccuracy(0);
    setWordStatuses([]);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-6">
        <div className="text-center bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md">
          <IoWarning className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Browser Not Supported</h2>
          <p className="text-slate-600">Your browser does not support Speech Recognition. Please try using Google Chrome on Desktop or Android.</p>
        </div>
      </div>
    );
  }

  const progress = Math.round((currentIndex / words.length) * 100);

  return (
    <>
      <section className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
        <div ref={containerRef} className="w-full max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center pt-10">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
              Practice Reading
            </h1>
            <p className="text-base text-slate-600">
              Read the passage out loud. <span className="font-semibold text-sky-600">Tap on any word</span> to hear its pronunciation!
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-white text-slate-700 rounded-full text-sm font-semibold border border-slate-200 shadow-sm">
              {currentPassage.title}
            </div>
          </div>

          {/* Main Container */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="flex items-center justify-center gap-6 md:gap-12 text-center bg-white py-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <p className="text-xs md:text-sm text-slate-500 mb-1 font-semibold uppercase tracking-wider">Words Read</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-900">
                  {currentIndex}<span className="text-slate-400 text-lg font-medium">/{words.length}</span>
                </p>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div>
                <p className="text-xs md:text-sm text-slate-500 mb-1 font-semibold uppercase tracking-wider">Progress</p>
                <p className="text-2xl md:text-3xl font-bold text-sky-500">{Math.min(progress, 100)}%</p>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div>
                <p className="text-xs md:text-sm text-slate-500 mb-1 font-semibold uppercase tracking-wider">Accuracy</p>
                <p className="text-2xl md:text-3xl font-bold text-emerald-500">{accuracy}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full">
              <div className="w-full h-3 bg-white border border-slate-200 rounded-full overflow-hidden shadow-sm">
                <div
                  ref={progressBarRef}
                  className="h-full bg-gradient-to-r from-sky-400 to-sky-500 rounded-full transition-all"
                  style={{ width: "0%" }}
                />
              </div>
            </div>

            {/* Reading Passage */}
            <div
              ref={textContainerRef}
              className="bg-white rounded-2xl p-6 md:p-10 border border-slate-200 relative group max-h-[50vh] overflow-y-auto shadow-inner"
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* How to Use overlay / section */}
              <AnimatePresence>
                {!listening && currentIndex === 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 bg-sky-50 border border-sky-200 rounded-xl p-5 text-sky-800 text-sm md:text-base overflow-hidden"
                  >
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-sky-900">
                      <IoInformationCircle className="w-6 h-6" /> How to Use
                    </h3>
                    <ul className="list-disc list-inside space-y-1 ml-1 font-medium">
                      <li>Click <strong className="font-bold text-sky-900">Start Reading</strong> and allow microphone access.</li>
                      <li>Read the passage clearly and at a natural pace.</li>
                      <li>The text will automatically track your voice like a professional typing tester.</li>
                      <li>Tap on any word before starting to hear its correct pronunciation!</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleRefreshPassage}
                disabled={listening}
                className={`sticky top-0 float-right z-20 p-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-200 hover:bg-sky-50 transition-all ${listening ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                title="Reset passage"
              >
                <IoRefresh className="w-5 h-5" />
              </button>

              <div className="text-xl md:text-3xl leading-[2.2] md:leading-[2.5] text-slate-800 font-medium tracking-wide">
                {originalWords.map((word, i) => {
                  let className = "inline-block px-1 mx-0.5 rounded transition-all duration-200 relative cursor-pointer group/word ";
                  const status = wordStatuses[i] || 'unread';

                  if (i === currentIndex) {
                    className += "text-slate-900 font-semibold bg-slate-100 shadow-sm";
                  } else if (status === 'correct') {
                    className += "text-slate-800";
                  } else if (status === 'wrong') {
                    className += "text-red-500 line-through decoration-red-300 decoration-2";
                  } else {
                    className += "text-slate-400"; // unread looks gray like MonkeyType
                  }

                  const cleanWord = word.replace(/\n/g, '');

                  return (
                    <span
                      key={i}
                      ref={i === currentIndex ? activeWordRef : null}
                      className={className}
                      onClick={() => {
                        if (!listening) speakWord(cleanWord, currentPassage.language);
                      }}
                      title={!listening ? "Click to hear pronunciation" : ""}
                    >
                      {i === currentIndex && (
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          className="absolute -left-[2px] top-[10%] bottom-[10%] w-[3px] bg-sky-500 rounded-full"
                        />
                      )}
                      {cleanWord}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              {!listening ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={start}
                  className="flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold rounded-xl shadow-md shadow-sky-200 hover:shadow-lg hover:shadow-sky-300 transition-all text-lg border border-sky-600/20"
                >
                  <IoMic className="w-6 h-6" />
                  Start Reading
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={stop}
                  className="flex items-center justify-center gap-3 px-10 py-4 bg-slate-800 text-white font-bold rounded-xl shadow-md hover:bg-slate-900 transition-all text-lg"
                >
                  <IoSquare className="w-6 h-6" />
                  Stop Reading
                </motion.button>
              )}
            </div>

            {/* Live Indicator */}
            <AnimatePresence>
              {listening && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-3 text-sm font-medium text-sky-700 bg-sky-100 py-3 px-6 rounded-full w-max mx-auto shadow-sm"
                >
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-3 h-3 bg-red-500 rounded-full"
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
