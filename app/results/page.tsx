'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
    IoArrowBack,
    IoCheckmarkCircle,
    IoCloseCircle,
    IoTrophy,
    IoTime,
    IoStatsChart,
    IoRefresh,
    IoCalendar,
    IoLanguage,
    IoChevronForward
} from 'react-icons/io5'


interface ReadingResult {
    finalAccuracy: number
    finalWordsRead: number
    totalWords: number
    duration: number
    wordStatuses: ('correct' | 'wrong' | 'unread')[]
    originalWords: string[]
    passageTitle: string
    language: string
    studentName: string
    classroom: string
    date: string
}

export default function ResultsPage() {
    const router = useRouter()
    const [history, setHistory] = useState<ReadingResult[]>([])
    const [expandedId, setExpandedId] = useState<number | null>(0) // Expand the first one by default

    useEffect(() => {
        const savedHistory = localStorage.getItem('readingHistory')
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory))
        }
    }, [])

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const getReadingLevel = (score: number) => {
        if (score >= 90) return {
            level: 'Independent',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            icon: IoTrophy,
            gradient: 'from-emerald-500 to-emerald-600'
        }
        if (score >= 51) return {
            level: 'Instructional',
            color: 'text-sky-600',
            bg: 'bg-sky-50',
            border: 'border-sky-100',
            icon: IoCheckmarkCircle,
            gradient: 'from-sky-500 to-sky-600'
        }
        return {
            level: 'Frustrated',
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            icon: IoRefresh,
            gradient: 'from-slate-500 to-slate-600'
        }
    }

    const handleBackToRead = () => {
        router.push('/read')
    }

    if (history.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-200"
                >
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                        <IoStatsChart className="w-10 h-10 text-slate-300" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">No data yet</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        Complete your first reading session to start tracking your performance history!
                    </p>
                    <button
                        onClick={handleBackToRead}
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all transform active:scale-95"
                    >
                        Start Reading Now
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">

            <main className="max-w-6xl mx-auto px-6 py-12 pt-28">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-black uppercase tracking-widest mb-3">
                            Analytics Dashboard
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                            Reading Results
                        </h1>
                        <p className="text-slate-500 mt-3 text-lg font-medium">
                            Review your session progress and pronunciation accuracy
                        </p>
                    </div>

                    <button
                        onClick={handleBackToRead}
                        className="px-6 py-3 bg-white text-slate-900 font-bold rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all flex items-center gap-2 text-sm"
                    >
                        <IoRefresh className="w-4 h-4" />
                        New Reading
                    </button>
                </div>

                {/* Unified List View */}
                <div className="space-y-4">
                    {history.map((item, index) => {
                        const isExpanded = expandedId === index
                        const level = getReadingLevel(item.finalAccuracy)
                        const progress = Math.round((item.finalWordsRead / item.totalWords) * 100)

                        return (
                            <motion.div
                                key={`${item.date}-${index}`}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`group bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden ${isExpanded ? 'shadow-2xl border-slate-300 ring-4 ring-slate-100' : 'shadow-sm border-slate-200 hover:border-slate-300 hover:shadow-md'
                                    }`}
                            >
                                {/* Collapsed Row Head */}
                                <div
                                    onClick={() => setExpandedId(isExpanded ? null : index)}
                                    className="px-8 py-5 cursor-pointer flex flex-col md:flex-row md:items-center gap-6"
                                >
                                    {/* Date & Time */}
                                    <div className="flex flex-col shrink-0 min-w-[140px]">
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                                            {index === 0 ? "Latest Session" : "Previous Session"}
                                        </span>
                                        <span className="text-slate-900 font-black text-sm">
                                            {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <span className="text-slate-400 text-[11px] font-bold">
                                            {new Date(item.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    {/* Vertical Divider (Desktop) */}
                                    <div className="hidden md:block w-px h-10 bg-slate-100" />

                                    {/* Passage & Class */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${item.language.includes('US') ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {item.language.includes('US') ? '🇺🇸 English' : '🇵🇭 Filipino'}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 truncate tracking-tight">
                                            {item.passageTitle}
                                        </h3>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="flex items-center gap-4 md:gap-8 shrink-0">
                                        <div className="text-right">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Accuracy</div>
                                            <div className={`text-2xl font-black ${item.finalAccuracy >= 70 ? 'text-emerald-500' : 'text-slate-900'}`}>
                                                {item.finalAccuracy}%
                                            </div>
                                        </div>

                                        <div className="text-right hidden sm:block">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Words</div>
                                            <div className="text-base font-black text-slate-900">
                                                {item.finalWordsRead}/{item.totalWords}
                                            </div>
                                        </div>

                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 ${isExpanded ? 'rotate-180 bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                                            <motion.div animate={{ y: isExpanded ? 0 : [0, 2, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                                                <IoChevronForward className={`w-5 h-5 ${isExpanded ? 'rotate-90' : ''}`} />
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                            className="overflow-hidden border-t border-slate-50"
                                        >
                                            <div className="px-8 pb-10 pt-6">
                                                {/* Analysis Block */}
                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                                                    {/* Side Details */}
                                                    <div className="lg:col-span-4 space-y-6">
                                                        <div className={`p-6 rounded-3xl border ${level.bg} ${level.border} relative overflow-hidden`}>
                                                            <div className="absolute -right-4 -top-4 opacity-10">
                                                                <level.icon className="w-24 h-24" />
                                                            </div>
                                                            <h4 className={`text-sm font-black uppercase tracking-widest ${level.color} mb-3`}>Performance Level</h4>
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-12 h-12 rounded-2xl ${level.color} bg-white flex items-center justify-center shadow-sm border ${level.border}`}>
                                                                    <level.icon className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <div className={`text-xl font-black ${level.color}`}>{level.level}</div>
                                                                    <div className="text-slate-500 text-xs font-bold leading-none">Ranked by local metrics</div>
                                                                </div>
                                                            </div>
                                                            <p className="mt-4 text-xs font-bold text-slate-600 leading-relaxed italic">
                                                                "{item.finalAccuracy >= 90 ? "Native-like fluency achieved!" : item.finalAccuracy >= 50 ? "Consistent pacing, room for clarity." : "Slow down and focus on enunciation."}"
                                                            </p>
                                                        </div>

                                                        {/* Summary Row */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
                                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</div>
                                                                <div className="flex items-center gap-2">
                                                                    <IoTime className="w-4 h-4 text-slate-400" />
                                                                    <span className="text-sm font-black text-slate-900">{formatDuration(item.duration)}</span>
                                                                </div>
                                                            </div>
                                                            <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
                                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completion</div>
                                                                <div className="flex items-center gap-2">
                                                                    <IoCheckmarkCircle className="w-4 h-4 text-slate-400" />
                                                                    <span className="text-sm font-black text-slate-900">{progress}%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Detailed Word Analysis */}
                                                    <div className="lg:col-span-8 flex flex-col">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Passage Breakdown</h4>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> <span className="text-[10px] font-black text-slate-400">CORRECT</span></div>
                                                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400" /> <span className="text-[10px] font-black text-slate-400">ERROR</span></div>
                                                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-200" /> <span className="text-[10px] font-black text-slate-400">UNREAD</span></div>
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 bg-slate-50/50 rounded-[2rem] p-6 md:p-8 border border-slate-100 text-lg md:text-xl leading-[2] font-medium tracking-wide text-slate-700">
                                                            {item.originalWords.map((word, i) => {
                                                                const status = item.wordStatuses[i] || 'unread'
                                                                let cl = "inline-block px-1.5 py-0.5 mx-0.5 rounded-lg transition-all "
                                                                if (status === 'correct') cl += "text-emerald-700 bg-emerald-100/40"
                                                                else if (status === 'wrong') cl += "text-red-700 bg-red-100/30 line-through decoration-red-300"
                                                                else cl += "text-slate-300"

                                                                return <span key={i} className={cl}>{word}</span>
                                                            })}
                                                        </div>

                                                        <div className="mt-6 flex items-center justify-end gap-3">
                                                            <button
                                                                onClick={() => {
                                                                    const historyCopy = [...history];
                                                                    historyCopy.splice(index, 1);
                                                                    setHistory(historyCopy);
                                                                    localStorage.setItem('readingHistory', JSON.stringify(historyCopy));
                                                                }}
                                                                className="text-xs font-black text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest p-2"
                                                            >
                                                                Remove Log
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
