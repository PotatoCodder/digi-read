'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { IoPeople, IoCheckmarkCircle, IoChevronBack, IoChevronDown, IoSchool } from 'react-icons/io5'
import RealtimeReadingTracker from '@/components/layout/features/SpeechRecognition'
import FeaturesShowcase from '@/components/layout/featureShowcase'
import TestimonialsSection from '@/components/layout/tesemonials'

interface Student {
  id: number
  fullName: string
  classId: number
  class: {
    id: number
    section: string
  }
}

interface Classroom {
  id: number
  section: string
  teacherId: number
  teacher: {
    id: number
    fullName: string
  }
  students: Student[]
}

export default function ReadPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/classroom')
      .then(res => res.json())
      .then(data => {
        setClassrooms(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to fetch classrooms:', error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (containerRef.current && !selectedStudent) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
    }
  }, [selectedStudent, selectedClassroom])

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleStop = async (score: number, accuracy: number, startTime: Date, endTime: Date) => {
    if (!selectedStudent) return

    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          classId: selectedStudent.classId,
          score: accuracy,
          section: 'Solar System Reading',
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        })
      })

      if (response.ok) {
        showNotification('Score saved successfully!', 'success')
      } else {
        showNotification('Failed to save score', 'error')
      }
    } catch (error) {
      console.error('Failed to save score:', error)
      showNotification('Failed to save score', 'error')
    }
  }

  const handleBackToClassrooms = () => {
    setSelectedClassroom(null)
    setSelectedStudent(null)
  }

  const handleBackToStudents = () => {
    setSelectedStudent(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-12 h-12 bg-sky-500 rounded-full mx-auto mb-4"
          />
          <p className="text-slate-600">Loading classrooms...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
          >
            <div
              className={`rounded-lg p-4 shadow-lg flex items-start gap-3 ${
                notification.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <IoCheckmarkCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                notification.type === 'success' ? 'text-emerald-500' : 'text-red-500'
              }`} />
              <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-emerald-700' : 'text-red-700'}`}>
                {notification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 1: Select Classroom */}
      {!selectedClassroom && !selectedStudent && (
        <section className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
          <div ref={containerRef} className="w-full max-w-2xl">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <IoSchool className="w-8 h-8 text-sky-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Select a Classroom
              </h1>
              <p className="text-base text-slate-600">
                Choose a classroom to view its students
              </p>
            </div>

            {/* Classroom Count */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-1">Available Classrooms</p>
                <p className="text-2xl font-bold text-sky-500">{classrooms.length}</p>
              </div>
            </div>

            {/* Classroom Selection */}
            {classrooms.length === 0 ? (
              <div className="bg-slate-50 rounded-lg p-8 border border-slate-200 text-center">
                <p className="text-slate-500 mb-4">No classrooms available.</p>
                <p className="text-sm text-slate-400">Please create a classroom first.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {classrooms.map(classroom => (
                  <motion.button
                    key={classroom.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedClassroom(classroom)}
                    className="bg-slate-50 p-6 rounded-lg border-2 border-slate-200 hover:border-sky-400 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                            <IoSchool className="w-5 h-5 text-sky-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">
                              {classroom.section}
                            </h3>
                            <p className="text-sm text-slate-500">
                              Teacher: {classroom.teacher.fullName}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center gap-2 bg-sky-100 px-3 py-1.5 rounded-full">
                          <IoPeople className="w-4 h-4 text-sky-600" />
                          <span className="text-sm font-semibold text-sky-700">
                            {classroom.students.length} {classroom.students.length === 1 ? 'student' : 'students'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Tips */}
            <div className="mt-8 text-center text-xs text-slate-500">
              <p>💡 Select a classroom to see its students</p>
            </div>
          </div>
        </section>
      )}

      {/* Step 2: Select Student from Classroom */}
      {selectedClassroom && !selectedStudent && (
        <section className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
          <div ref={containerRef} className="w-full max-w-2xl">
            {/* Back Button */}
            <div className="mb-8">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToClassrooms}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <IoChevronBack className="w-5 h-5" />
                <span className="font-medium">Back to Classrooms</span>
              </motion.button>
            </div>

            {/* Header */}
            <div className="mb-12 text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <IoPeople className="w-8 h-8 text-sky-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Select a Student
              </h1>
              <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
                <IoSchool className="w-4 h-4 text-slate-600" />
                <p className="text-sm font-medium text-slate-700">
                  {selectedClassroom.section} • {selectedClassroom.teacher.fullName}
                </p>
              </div>
            </div>

            {/* Student Count */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-1">Students in Class</p>
                <p className="text-2xl font-bold text-sky-500">{selectedClassroom.students.length}</p>
              </div>
            </div>

            {/* Student Selection */}
            {selectedClassroom.students.length === 0 ? (
              <div className="bg-slate-50 rounded-lg p-8 border border-slate-200 text-center">
                <p className="text-slate-500 mb-4">No students in this classroom.</p>
                <p className="text-sm text-slate-400">Please add students first.</p>
              </div>
            ) : (
              <>
                {/* Dropdown */}
                <div className="bg-slate-50 rounded-lg p-8 border border-slate-200 mb-6">
                  <div className="relative">
                    <select
                      value=""
                      onChange={(e) => {
                        const student = selectedClassroom.students.find(s => s.id === parseInt(e.target.value))
                        if (student) {
                          setSelectedStudent(student)
                        }
                      }}
                      className="w-full px-4 py-4 pr-12 bg-white border-2 border-slate-300 rounded-lg text-slate-900 text-lg font-medium appearance-none cursor-pointer hover:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    >
                      <option value="">Choose a student...</option>
                      {selectedClassroom.students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.fullName}
                        </option>
                      ))}
                    </select>
                    <IoChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Grid View */}
                <div>
                  <p className="text-sm text-slate-600 mb-4 text-center font-medium">Or select from the list:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {selectedClassroom.students.map(student => (
                      <motion.button
                        key={student.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedStudent(student)}
                        className="bg-white p-4 rounded-lg border-2 border-slate-200 hover:border-sky-400 hover:shadow-md transition-all text-left"
                      >
                        <div className="font-semibold text-slate-900">
                          {student.fullName}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Tips */}
            <div className="mt-8 text-center text-xs text-slate-500">
              <p>💡 Select a student to start tracking their reading progress</p>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Reading Tracker */}
      {selectedStudent && (
        <>
          {/* Selected Student Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-40 bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <IoPeople className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-sky-100">Reading Session For:</p>
                    <p className="text-lg font-bold">
                      {selectedStudent.fullName} • {selectedClassroom?.section}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBackToStudents}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-medium transition-colors text-sm"
                  >
                    <IoChevronBack className="w-4 h-4" />
                    <span className="hidden sm:inline">Change Student</span>
                    <span className="sm:hidden">Student</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBackToClassrooms}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-medium transition-colors text-sm"
                  >
                    <IoSchool className="w-4 h-4" />
                    <span className="hidden sm:inline">Change Classroom</span>
                    <span className="sm:hidden">Class</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reading Tracker */}
          <RealtimeReadingTracker 
            onStop={handleStop}
            studentName={selectedStudent.fullName}
            classroom={selectedClassroom?.section || ''}
          />
        </>
      )}

      {/* Features and Testimonials - Only show when no selection made */}
      {!selectedClassroom && !selectedStudent && (
        <>
          <FeaturesShowcase />
          <TestimonialsSection />
        </>
      )}
    </div>
  )
}