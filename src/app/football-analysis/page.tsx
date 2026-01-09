'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VideoUploader from '@/components/football/VideoUploader';
import ProcessingStatus from '@/components/football/ProcessingStatus';
import VideoPlayer from '@/components/football/VideoPlayer';
import ErrorDisplay from '@/components/football/ErrorDisplay';
import { useAuth } from "@/components/AuthProvider";
import { getUserCredits } from "@/lib/creditService";

type AppState = 'upload' | 'processing' | 'result' | 'error';

export default function FootballAnalysisPage() {
    const router = useRouter();
    const { user, userData, loading: authLoading } = useAuth();
    const [appState, setAppState] = useState<AppState>('upload');
    const [jobId, setJobId] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [credits, setCredits] = useState<number | null>(null);
    const [isUnlimited, setIsUnlimited] = useState(false);

    // Load user credits
    useEffect(() => {
        if (user?.uid) {
            getUserCredits(user.uid).then((userCredits) => {
                setCredits(userCredits.credits);
                setIsUnlimited(userCredits.isUnlimited || false);
            });
        } else {
            setCredits(null);
            setIsUnlimited(false);
        }
    }, [user]);

    const handleUploadComplete = (newJobId: string) => {
        setJobId(newJobId);
        setAppState('processing');
        setError(null);
        
        // Refresh credits after using one
        if (user?.uid) {
            getUserCredits(user.uid).then((userCredits) => {
                setCredits(userCredits.credits);
                setIsUnlimited(userCredits.isUnlimited || false);
            });
        }
    };

    const handleError = (errorMessage: string) => {
        setError(errorMessage);
        setAppState('error');
        
        // Refresh credits on error (in case credit was used but upload failed)
        if (user?.uid) {
            getUserCredits(user.uid).then((userCredits) => {
                setCredits(userCredits.credits);
                setIsUnlimited(userCredits.isUnlimited || false);
            });
        }
    };

    const handleProcessingComplete = (url: string) => {
        setResultUrl(url);
        setAppState('result');
    };

    const handleReset = () => {
        setAppState('upload');
        setJobId(null);
        setResultUrl(null);
        setError(null);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-black">
            <Navbar />
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="field" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#field)" className="text-emerald-500" />
                </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-12">
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

                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 
                         bg-clip-text text-transparent mb-4">
                        Football Analysis Demo
                    </h1>

                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Upload a football match video and our AI will automatically detect and track
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

                {/* Authentication and Credits Status */}
                {!authLoading && (
                    <div className="max-w-4xl mx-auto mb-8 bg-white/5 border border-white/15 rounded-xl p-4 sm:p-6">
                        {user ? (
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <div className="text-sm sm:text-base text-white/80">
                                        Signed in as <span className="font-semibold text-white break-words">{userData?.displayName || user.email}</span>
                                    </div>
                                    {credits !== null && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-white/60 text-xs sm:text-sm">Credits:</span>
                                            {isUnlimited ? (
                                                <span className="font-bold text-emerald-400 text-sm sm:text-base">Unlimited</span>
                                            ) : (
                                                <span className={`font-bold text-sm sm:text-base ${credits > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {credits}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                <p className="text-sm sm:text-base text-white/80">Sign in to analyze football videos</p>
                                <Link
                                    href="/auth/login"
                                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition-all text-sm font-semibold text-center"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Main Content Area */}
                <div className="max-w-4xl mx-auto">
                    {appState === 'upload' && (
                        <VideoUploader
                            onUploadComplete={handleUploadComplete}
                            onError={handleError}
                            isProcessing={false}
                            userId={user?.uid || null}
                        />
                    )}

                    {appState === 'processing' && jobId && (
                        <ProcessingStatus
                            jobId={jobId}
                            onComplete={handleProcessingComplete}
                            onError={handleError}
                        />
                    )}

                    {appState === 'result' && resultUrl && (
                        <VideoPlayer
                            resultUrl={resultUrl}
                            onReset={handleReset}
                        />
                    )}

                    {appState === 'error' && error && (
                        <ErrorDisplay
                            error={error}
                            onDismiss={handleReset}
                        />
                    )}
                </div>

                {/* Footer */}
                <footer className="mt-16 text-center">
                    <div className="glass rounded-xl p-6 max-w-2xl mx-auto">
                        <h3 className="text-lg font-semibold text-gray-300 mb-3">How It Works</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="p-4 rounded-lg bg-white/5">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <span className="text-emerald-400 font-bold">1</span>
                                </div>
                                <p className="text-gray-400">Upload your football video</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <span className="text-emerald-400 font-bold">2</span>
                                </div>
                                <p className="text-gray-400">AI analyzes each frame</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <span className="text-emerald-400 font-bold">3</span>
                                </div>
                                <p className="text-gray-400">Download annotated video</p>
                            </div>
                        </div>
                    </div>

                    <p className="mt-8 text-sm text-gray-500">
                        Powered by YOLO Object Detection • Max 5 min video • MP4 output
                    </p>
                </footer>
            </div>
            
            <Footer />
        </div>
    );
}

