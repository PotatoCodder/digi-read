import Image from 'next/image';
import heroImage from '@/assets/heroo.png';
export default function HeroSection() {
  return (
    <section className="w-full bg-slate-50 min-h-screen flex items-center px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Digi-Read
              <span className="block text-sky-500 mt-2">
                Empowering Fluency with AI and Voice
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-slate-600 max-w-xl">
              Transform reading education with intelligent voice analysis and real-time feedback that helps students improve fluency and confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3.5 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors duration-200 shadow-md hover:shadow-lg">
                Get Started
              </button>
              <button className="px-8 py-3.5 bg-white text-slate-700 font-semibold rounded-lg border-2 border-slate-200 hover:border-sky-500 hover:text-sky-500 transition-all duration-200 shadow-sm">
                Let's Try
              </button>
            </div>

            {/* Optional Stats/Features */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">AI-Powered</p>
                  <p className="text-xs text-slate-500">Real-time analysis</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Voice Recognition</p>
                  <p className="text-xs text-slate-500">Instant feedback</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative">
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-sm">
              <Image
                src={heroImage} // Update this path to match your actual image location
                alt="Digi-Read platform demonstration"
                fill
                className="px-4 py-8"
                priority
              />
              {/* Optional gradient overlay for better image integration */}
              <div className="absolute inset-0  from-sky-500/10 to-transparent"></div>
            </div>

            {/* Optional floating card accent */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg hidden lg:block">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-500">95%</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Accuracy Rate</p>
                  <p className="text-xs text-slate-500">Voice recognition</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}