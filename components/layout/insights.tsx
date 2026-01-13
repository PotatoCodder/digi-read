import Image from 'next/image';
import insightImage from '@/assets/insight.png';
export default function InsightsSection() {
  return (
    <section className="w-full bg-slate-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Side - Tablet Mockup */}
          <div className="relative">
            <div className="bg-white p-8 rounded-3xl shadow-2xl">
              {/* Tablet Frame */}
              <div className="relative bg-slate-900 rounded-2xl p-3 shadow-xl">
                {/* Screen */}
                <div className="bg-white rounded-lg overflow-hidden">
                  <Image
                    src={insightImage}// Update this to your dashboard screenshot
                    alt="Digi-Read Dashboard"
                    width={600}
                    height={450}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Actionable Insights at Your Fingertips
            </h2>

            {/* Description */}
            <p className="text-lg text-slate-600 leading-relaxed">
              Don't just collect data—understand it. Digi-Read translates complex speech patterns into clear, actionable instructional recommendations.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-700 text-base">
                  Automatically flag students needing tier-2 intervention.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-700 text-base">
                  Identify phonics gaps with syllable-level precision.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-700 text-base">
                  Share progress directly with parents via secure portals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}