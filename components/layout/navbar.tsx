export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand - Left */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900">Digi-Read</span>
            </div>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className="text-slate-600 hover:text-sky-500 font-medium transition-colors duration-200"
            >
              Features
            </a>
            <a 
              href="#resources" 
              className="text-slate-600 hover:text-sky-500 font-medium transition-colors duration-200"
            >
              Resources
            </a>
          </div>

          {/* Right - CTA Button */}
          <div className="flex items-center space-x-4">
            <button className="hidden sm:block px-6 py-2.5 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition-colors duration-200 shadow-sm hover:shadow-md">
              Get Started
            </button>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-slate-600 hover:text-sky-500">
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}