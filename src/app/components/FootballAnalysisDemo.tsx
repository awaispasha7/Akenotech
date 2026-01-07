'use client';

import Link from 'next/link';

export default function FootballAnalysisDemo() {
    return (
        <section id="football-analysis" className="relative bg-black py-20 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="field-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#field-pattern)" className="text-emerald-500" />
                </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <header className="text-center mb-12">
                    <div className="inline-flex items-center justify-center space-x-3 mb-4">
                        {/* Football Icon */}
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 
                            flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M19 5 L5 19"
                                    stroke="currentColor" strokeWidth="1" opacity="0.5" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 
                         bg-clip-text text-transparent mb-4">
                        Football Analysis Demo
                    </h2>

                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Paste a YouTube video URL or upload a football match video and our AI will automatically detect and track
                        players and the ball in real-time using advanced YOLO technology.
                    </p>

                    {/* Feature Tags */}
                    <div className="flex flex-wrap justify-center gap-3 mt-6">
                        {['Player Detection', 'Ball Tracking', 'Real-time Analysis', 'HD Output'].map((feature) => (
                            <span
                                key={feature}
                                className="px-3 py-1 text-sm bg-white/5 border border-white/10 rounded-full text-gray-400"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>
                </header>

                {/* CTA Button */}
                <div className="flex justify-center">
                    <Link
                        href="/football-analysis"
                        className="group inline-flex items-center justify-center bg-emerald-500 text-black px-8 py-4 rounded-full font-bold text-base shadow-2xl hover:shadow-emerald-500/50 hover:bg-emerald-400 hover:scale-105 transition-all"
                    >
                        Analyze Football Video
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}

