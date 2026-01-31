'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { IoPersonAdd, IoSchool, IoPeople, IoCheckmarkCircle, IoWarning, IoStatsChart } from 'react-icons/io5'

interface Teacher {
  id: number
  fullName: string
  classes: Class[]
}

interface Class {
  id: number
  section: string
  teacherId: number
  teacher: Teacher
  students: Student[]
  readingRecords: any[]
}

interface Student {
  id: number
  fullName: string
  classId: number
  class: Class
  readingRecords: any[]
}

export default function ClassroomPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [classrooms, setClassrooms] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
    }
  }, [])

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const fetchData = async () => {
    try {
      const [teachersRes, classroomsRes, studentsRes] = await Promise.all([
        fetch('/api/teacher'),
        fetch('/api/classroom'),
        fetch('/api/student')
      ])
      const teachersData = await teachersRes.json()
      const classroomsData = await classroomsRes.json()
      const studentsData = await studentsRes.json()
      setTeachers(teachersData)
      setClassrooms(classroomsData)
      setStudents(studentsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      showNotification('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeacher = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const fullName = formData.get('fullName') as string
    const form = e.currentTarget
    try {
      const res = await fetch('/api/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName })
      })
      if (res.ok) {
        await fetchData()
        form.reset()
        showNotification('Teacher added successfully!', 'success')
      } else {
        showNotification('Failed to add teacher', 'error')
      }
    } catch (error) {
      console.error('Failed to create teacher:', error)
      showNotification('Failed to add teacher', 'error')
    }
  }

  const handleCreateClassroom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const section = formData.get('section') as string
    const teacherId = parseInt(formData.get('teacherId') as string)
    const form = e.currentTarget
    try {
      const res = await fetch('/api/classroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, teacherId })
      })
      if (res.ok) {
        await fetchData()
        form.reset()
        showNotification('Classroom created successfully!', 'success')
      } else {
        showNotification('Failed to create classroom', 'error')
      }
    } catch (error) {
      console.error('Failed to create classroom:', error)
      showNotification('Failed to create classroom', 'error')
    }
  }

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const fullName = formData.get('fullName') as string
    const classId = parseInt(formData.get('classId') as string)
    const form = e.currentTarget
    try {
      const res = await fetch('/api/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, classId })
      })
      if (res.ok) {
        await fetchData()
        form.reset()
        showNotification('Student added successfully!', 'success')
      } else {
        showNotification('Failed to add student', 'error')
      }
    } catch (error) {
      console.error('Failed to add student:', error)
      showNotification('Failed to add student', 'error')
    }
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
          <p className="text-slate-600">Loading classroom data...</p>
        </div>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-white px-6 py-12">
      <div ref={containerRef} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Classroom Management
          </h1>
          <p className="text-base text-slate-600">
            Manage teachers, classrooms, and students in one place
          </p>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-8 rounded-lg p-4 flex items-start gap-3 ${
                notification.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {notification.type === 'success' ? (
                <IoCheckmarkCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              ) : (
                <IoWarning className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${notification.type === 'success' ? 'text-emerald-700' : 'text-red-700'}`}>
                {notification.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Overview */}
        <div className="flex items-center justify-center gap-8 mb-12 text-center">
          <div>
            <p className="text-sm text-slate-500 mb-1">Teachers</p>
            <p className="text-2xl font-bold text-slate-900">{teachers.length}</p>
          </div>
          <div className="w-px h-12 bg-slate-200" />
          <div>
            <p className="text-sm text-slate-500 mb-1">Classrooms</p>
            <p className="text-2xl font-bold text-sky-500">{classrooms.length}</p>
          </div>
          <div className="w-px h-12 bg-slate-200" />
          <div>
            <p className="text-sm text-slate-500 mb-1">Students</p>
            <p className="text-2xl font-bold text-emerald-500">{students.length}</p>
          </div>
        </div>

        {/* Forms Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Add Teacher Form */}
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                <IoPersonAdd className="w-5 h-5 text-sky-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Add Teacher</h2>
            </div>
            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Enter teacher name"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-sky-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-sky-600 transition-colors"
              >
                Add Teacher
              </motion.button>
            </form>
          </div>

          {/* Create Classroom Form */}
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <IoSchool className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Create Classroom</h2>
            </div>
            <form onSubmit={handleCreateClassroom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Section
                </label>
                <input
                  type="text"
                  name="section"
                  required
                  placeholder="e.g., Grade 5-A"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teacher
                </label>
                <select
                  name="teacherId"
                  required
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                Create Classroom
              </motion.button>
            </form>
          </div>

          {/* Add Student Form */}
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <IoPeople className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Add Student</h2>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Enter student name"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Classroom
                </label>
                <select
                  name="classId"
                  required
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Classroom</option>
                  {classrooms.map(classroom => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.section} - {classroom.teacher.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-purple-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-purple-600 transition-colors"
              >
                Add Student
              </motion.button>
            </form>
          </div>
        </div>

        {/* Lists Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Teachers List */}
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <IoPersonAdd className="w-5 h-5 text-sky-500" />
              Teachers
            </h2>
            {teachers.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No teachers added yet</p>
            ) : (
              <ul className="space-y-2">
                {teachers.map(teacher => (
                  <motion.li
                    key={teacher.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-3 rounded-lg border border-slate-200 text-sm"
                  >
                    <div className="font-medium text-slate-900">{teacher.fullName}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {teacher.classes.length} {teacher.classes.length === 1 ? 'class' : 'classes'}
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

          {/* Classrooms List */}
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <IoSchool className="w-5 h-5 text-emerald-500" />
              Classrooms
            </h2>
            {classrooms.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No classrooms created yet</p>
            ) : (
              <ul className="space-y-2">
                {classrooms.map(classroom => (
                  <motion.li
                    key={classroom.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-3 rounded-lg border border-slate-200 text-sm"
                  >
                    <div className="font-medium text-slate-900">{classroom.section}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Teacher: {classroom.teacher.fullName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {classroom.students.length} {classroom.students.length === 1 ? 'student' : 'students'}
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

          {/* Students List */}
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <IoPeople className="w-5 h-5 text-purple-500" />
              Students
            </h2>
            {students.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No students added yet</p>
            ) : (
              <ul className="space-y-2">
                {students.map(student => (
                  <motion.li
                    key={student.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-3 rounded-lg border border-slate-200 text-sm"
                  >
                    <div className="font-medium text-slate-900">{student.fullName}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Class: {student.class.section}
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Classroom Details */}
        <div className="mt-12">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Classroom Details</h2>
            <p className="text-slate-600">View student performance by classroom</p>
          </div>

          {/* Search Filter */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search classrooms by section or teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {filteredClassrooms.length === 0 ? (
            <div className="bg-slate-50 rounded-lg p-12 border border-slate-200 text-center">
              <IoSchool className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">
                {searchTerm ? 'No classrooms match your search' : 'No classrooms created yet'}
              </p>
              <p className="text-sm text-slate-400 mt-2">
                {searchTerm ? 'Try a different search term' : 'Create a classroom to start tracking student performance'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredClassrooms.map(classroom => (
                <motion.div
                  key={classroom.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Classroom Header */}
                  <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          <IoSchool className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{classroom.section}</h3>
                          <p className="text-sm text-sky-100">Teacher: {classroom.teacher.fullName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                          <IoPeople className="w-4 h-4 text-white" />
                          <span className="text-sm font-semibold text-white">
                            {classroom.students.length} {classroom.students.length === 1 ? 'Student' : 'Students'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Students Table */}
                  {classroom.students.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <IoPeople className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No students in this classroom yet</p>
                      <p className="text-sm text-slate-400 mt-1">Add students to start tracking their progress</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="px-6 py-4 text-left">
                              <div className="flex items-center gap-2">
                                <IoPeople className="w-4 h-4 text-slate-500" />
                                <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Student</span>
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left">
                              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Recent Scores</span>
                            </th>
                            <th className="px-6 py-4 text-center">
                              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Average</span>
                            </th>
                            <th className="px-6 py-4 text-center">
                              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Sessions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {classroom.students.map((student, index) => {
                            const averageScore = student.readingRecords.length > 0
                              ? Math.round(
                                  student.readingRecords.reduce((sum: number, record: any) => sum + record.score, 0) / 
                                  student.readingRecords.length
                                )
                              : 0;
                            
                            const getScoreColor = (score: number) => {
                              if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
                              if (score >= 80) return 'text-sky-600 bg-sky-50 border-sky-200';
                              if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
                              return 'text-red-600 bg-red-50 border-red-200';
                            };

                            return (
                              <motion.tr
                                key={student.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-slate-50/50 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                      {student.fullName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="font-semibold text-slate-900">{student.fullName}</div>
                                      <div className="text-xs text-slate-500">ID: #{student.id}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  {student.readingRecords.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                      {student.readingRecords.slice(0, 3).map((record: any) => (
                                        <div
                                          key={record.id}
                                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${getScoreColor(record.score)}`}
                                        >
                                          <span className="font-bold">{record.score}%</span>
                                          <span className="text-xs opacity-75">
                                            {new Date(record.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                          </span>
                                        </div>
                                      ))}
                                      {student.readingRecords.length > 3 && (
                                        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
                                          +{student.readingRecords.length - 3} more
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-slate-400 italic">No scores yet</span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  {student.readingRecords.length > 0 ? (
                                    <div className="flex justify-center">
                                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold ${getScoreColor(averageScore)}`}>
                                        <span className="text-lg">{averageScore}%</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center">
                                      <span className="text-slate-400">—</span>
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex justify-center">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                                      <IoStatsChart className="w-4 h-4 text-slate-600" />
                                      <span className="text-sm font-semibold text-slate-700">
                                        {student.readingRecords.length}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>💡 Manage your classroom structure efficiently in one place</p>
        </div>
      </div>
    </section>
  )
}