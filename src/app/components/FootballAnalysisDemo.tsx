'use client';

import Link from 'next/link';

export default function FootballAnalysisDemo() {
    return (
        <section id="football-analysis" className="relative bg-gradient-to-br from-emerald-900/30 via-[#050816] to-teal-900/30 text-white border-y-2 border-emerald-500/30 overflow-hidden py-20 md:py-28">
            {/* Enhanced Animated Background Elements */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="field-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#field-pattern)" className="text-emerald-500" />
                </svg>
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                {/* Badge */}
                <div className="flex justify-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/50 rounded-full px-4 py-2 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                            AI-Powered Analysis
                        </span>
                    </div>
                </div>

                <div className="grid gap-12 md:grid-cols-2 items-center">
                    {/* Left Side - Main Content */}
                    <div className="space-y-6 md:space-y-8">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-20 h-20 bg-emerald-500/20 blur-2xl rounded-full animate-pulse"></div>
                            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 
                                flex items-center justify-center shadow-2xl shadow-emerald-500/50 mb-6">
                                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                                    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                            Advanced{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300">
                                Football Analysis
                            </span>{' '}
                            with AI
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed">
                            Upload a football match video and our advanced AI will automatically detect and track
                            players and the ball in real-time using cutting-edge YOLO technology. Get professional-grade
                            analysis with player detection, ball tracking, and detailed match insights.
                        </p>
                        
                        {/* Enhanced Feature Tags */}
                        <div className="flex flex-wrap gap-3">
                            {[
                                { name: 'Player Detection', icon: '👥' },
                                { name: 'Ball Tracking', icon: '⚽' },
                                { name: 'Real-time Analysis', icon: '⚡' },
                                { name: 'HD Output', icon: '🎬' }
                            ].map((feature) => (
                                <span
                                    key={feature.name}
                                    className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500/10 to-teal-500/10 
                                        border border-emerald-400/30 rounded-full text-emerald-300 font-medium
                                        hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300
                                        backdrop-blur-sm shadow-lg shadow-emerald-500/10"
                                >
                                    <span className="mr-2">{feature.icon}</span>
                                    {feature.name}
                                </span>
                            ))}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link
                                href="/football-analysis"
                                className="group inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 
                                    text-black px-8 py-4 rounded-full font-bold text-base shadow-2xl hover:shadow-emerald-500/50 
                                    hover:from-emerald-400 hover:via-emerald-300 hover:to-teal-400 hover:scale-105 transition-all"
                            >
                                Analyze Football Video
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Right Side - How It Works & Info Cards */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-500/10 
                            border border-emerald-400/30 rounded-2xl p-6 md:p-8 backdrop-blur-md space-y-4 shadow-2xl shadow-emerald-500/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 
                                    border border-emerald-400/50 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <svg className="w-7 h-7 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-xl font-bold text-white">
                                    How It Works
                                </p>
                            </div>
                            <ul className="space-y-4 text-sm md:text-base text-gray-200">
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400 mt-1 text-lg">✓</span>
                                    <span>Upload your football match video (MP4, AVI, MOV, MKV, WebM)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400 mt-1 text-lg">✓</span>
                                    <span>Our YOLO AI analyzes each frame to detect players and track the ball</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400 mt-1 text-lg">✓</span>
                                    <span>Get real-time analysis with professional tracking overlays</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400 mt-1 text-lg">✓</span>
                                    <span>Download your annotated video with player and ball tracking</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 
                            border border-emerald-400/30 rounded-xl p-5 text-center backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                            <p className="text-sm md:text-base text-emerald-300 font-semibold">
                                ⚽ Powered by YOLO Object Detection · Max 5 min video · HD MP4 output
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

