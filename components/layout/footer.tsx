export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
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
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              AI-powered reading assessments designed to save teachers time and help students grow.
            </p>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Product</h3>
            <div className="flex flex-col space-y-3">
              <a href="#features" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                Pricing
              </a>
              <a href="#security" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                Security
              </a>
              <a href="#integrations" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                Integrations
              </a>
            </div>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Company</h3>
            <div className="flex flex-col space-y-3">
              <a href="#about" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                About Us
              </a>
              <a href="#careers" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                Careers
              </a>
              <a href="#blog" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                Blog
              </a>
              <a href="#partners" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                Partners
              </a>
            </div>
          </div>

          {/* Support Column */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Support</h3>
            <div className="flex flex-col space-y-3">
              <a href="#help" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                Help Center
              </a>
              <a href="#contact" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                Contact Us
              </a>
              <a href="#privacy" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-sm text-slate-600 hover:text-sky-500 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <p className="text-sm text-slate-500">
            © 2024 Digi-Read Inc. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            {/* Share Icon */}
            <a 
              href="#share" 
              className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-sky-500 transition-colors"
              aria-label="Share"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </a>

            {/* Globe/Language Icon */}
            <a 
              href="#language" 
              className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-sky-500 transition-colors"
              aria-label="Language"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </a>

            {/* Email Icon */}
            <a 
              href="mailto:contact@digi-read.com" 
              className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-sky-500 transition-colors"
              aria-label="Email"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}