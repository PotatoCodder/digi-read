import React from 'react'
import RealtimeReadingTracker from '@/components/layout/features/SpeechRecognition'
import FeaturesShowcase from '@/components/layout/featureShowcase'
import TestimonialsSection from '@/components/layout/tesemonials'
export default function page() {
  return (
    <div>
      <RealtimeReadingTracker />
      <FeaturesShowcase />
      <TestimonialsSection />
    </div>
  )
}