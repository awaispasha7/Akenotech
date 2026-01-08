'use client';

import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FOOTBALL_API_URL, API_ENDPOINTS } from '@/config/api';

interface VideoUploaderProps {
    onUploadComplete: (jobId: string) => void;
    onError: (error: string) => void;
    isProcessing: boolean;
}

const ALLOWED_TYPES = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];
const MAX_SIZE_MB = 500;

type InputMode = 'upload' | 'youtube';

export default function VideoUploader({
    onUploadComplete,
    onError,
    isProcessing
}: VideoUploaderProps) {
    const [inputMode, setInputMode] = useState<InputMode>('youtube');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [youtubeUrl, setYoutubeUrl] = useState<string>('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            if (rejection.errors[0]?.code === 'file-too-large') {
                onError(`File too large. Maximum size: ${MAX_SIZE_MB}MB`);
            } else if (rejection.errors[0]?.code === 'file-invalid-type') {
                onError(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`);
            } else {
                onError('Invalid file selected');
            }
            return;
        }

        if (acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0]);
        }
    }, [onError]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/*': ALLOWED_TYPES,
        },
        maxSize: MAX_SIZE_MB * 1024 * 1024,
        multiple: false,
        disabled: isUploading || isProcessing,
    });

    const handleFileUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(progress);
                }
            });

            const response = await new Promise<any>((resolve, reject) => {
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const responseText = xhr.responseText.trim();
                            if (!responseText) {
                                reject(new Error('Empty response from server'));
                                return;
                            }
                            const parsed = JSON.parse(responseText);
                            if (!parsed.job_id) {
                                reject(new Error('Invalid response: missing job_id'));
                                return;
                            }
                            resolve(parsed);
                        } catch (parseError: any) {
                            console.error('Error parsing upload response:', parseError, 'Response:', xhr.responseText);
                            reject(new Error(`Failed to parse server response: ${parseError.message}`));
                        }
                    } else {
                        try {
                            const error = JSON.parse(xhr.responseText);
                            reject(new Error(error.detail || error.error || 'Upload failed'));
                        } catch {
                            reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
                        }
                    }
                };
                xhr.onerror = () => reject(new Error('Network error during upload'));
                xhr.ontimeout = () => reject(new Error('Upload timeout - the file may be too large'));
                xhr.timeout = 300000; // 5 minute timeout for large files
                xhr.open('POST', API_ENDPOINTS.FOOTBALL_UPLOAD);
                xhr.send(formData);
            });

            onUploadComplete(response.job_id);
        } catch (error: any) {
            onError(error.message || 'Upload failed');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleYouTubeSubmit = async () => {
        if (!youtubeUrl.trim()) {
            onError('Please enter a YouTube URL');
            return;
        }

        // Improved YouTube URL validation - matches all formats including Shorts
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/|v\/)|youtu\.be\/|m\.youtube\.com\/(watch\?v=|shorts\/))[a-zA-Z0-9_-]{11}/;
        if (!youtubeRegex.test(youtubeUrl.trim())) {
            onError('Please enter a valid YouTube URL (supports regular videos and Shorts)');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        // Clear any existing interval
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }

        // Simulate progress while downloading
        let progressStartTime = Date.now();
        progressIntervalRef.current = setInterval(() => {
            setUploadProgress((prev) => {
                const elapsed = (Date.now() - progressStartTime) / 1000;
                let targetProgress;
                if (elapsed < 180) {
                    targetProgress = (elapsed / 180) * 95;
                } else {
                    const extraTime = elapsed - 180;
                    targetProgress = 95 + Math.min(4.5, (extraTime / 120) * 4.5);
                }
                const calculated = Math.max(prev, Math.min(targetProgress, 99.5));
                const incremented = prev < 99.5 ? Math.min(prev + Math.random() * 0.5, 99.5) : prev;
                return Math.max(calculated, incremented);
            });
        }, 500);

        try {
            console.log('[VideoUploader] Starting YouTube download request...');
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                console.log('[VideoUploader] Request timeout - aborting after 10 minutes');
                controller.abort();
            }, 600000);
            
            const response = await fetch(API_ENDPOINTS.FOOTBALL_YOUTUBE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: youtubeUrl.trim() }),
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
            console.log('[VideoUploader] Received response:', response.status, response.ok);

            if (!response.ok) {
                if (progressIntervalRef.current) {
                    clearInterval(progressIntervalRef.current);
                    progressIntervalRef.current = null;
                }
                let errorMessage = 'Failed to process YouTube URL';
                try {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const error = await response.json();
                        errorMessage = error.detail || error.error || errorMessage;
                    } else {
                        const text = await response.text();
                        errorMessage = text || errorMessage;
                    }
                } catch (parseError) {
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
            
            const data = await response.json();
            console.log('[VideoUploader] Download completed, job_id:', data.job_id);
            
            setUploadProgress(100);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            onUploadComplete(data.job_id);
        } catch (error: any) {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
            
            if (error.name === 'AbortError' || error.message.includes('timeout')) {
                setUploadProgress(0);
                onError('Download timeout. The video download took longer than 10 minutes. The video might be too large or the connection is slow. Please try a shorter video or check your internet connection.');
            } else if (error instanceof SyntaxError || error.message.includes('JSON')) {
                setUploadProgress(0);
                onError('Server returned an invalid response. Please try again or check if the backend is running.');
            } else if (error.message.includes('Failed to fetch') || error.message.includes('ECONNRESET')) {
                setUploadProgress(0);
                onError('Connection to server was lost. The download may still be processing in the background. Please wait a moment and try refreshing the page.');
            } else {
                setUploadProgress(0);
                onError(error.message || 'Failed to process YouTube URL');
            }
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Mode Toggle */}
            <div className="mb-6 flex gap-2 p-1 glass rounded-xl">
                <button
                    onClick={() => {
                        setInputMode('youtube');
                        setSelectedFile(null);
                        setYoutubeUrl('');
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                        inputMode === 'youtube'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                            : 'text-gray-400 hover:text-gray-200'
                    }`}
                    disabled={isUploading || isProcessing}
                >
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        YouTube URL
                    </span>
                </button>
                <button
                    onClick={() => {
                        setInputMode('upload');
                        setYoutubeUrl('');
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                        inputMode === 'upload'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                            : 'text-gray-400 hover:text-gray-200'
                    }`}
                    disabled={isUploading || isProcessing}
                >
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload File
                    </span>
                </button>
            </div>

            {/* YouTube URL Input */}
            {inputMode === 'youtube' && (
                <div className="space-y-4">
                    <div className="p-6 glass rounded-2xl border border-gray-600">
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Paste YouTube Video URL
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-gray-600 
                                         text-gray-200 placeholder-gray-500 focus:outline-none 
                                         focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                disabled={isUploading || isProcessing}
                            />
                            <button
                                onClick={handleYouTubeSubmit}
                                disabled={!youtubeUrl.trim() || isUploading || isProcessing}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 
                                         hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold 
                                         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                                         shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                            >
                                {isUploading ? 'Processing...' : 'Process'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Supports YouTube video URLs • Max 5 minutes • Max 500MB
                        </p>
                    </div>

                    {/* Download Progress */}
                    {isUploading && (
                        <div className="p-4 glass rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-300 font-medium">Downloading from YouTube...</span>
                                <span className="text-emerald-400 font-semibold">{uploadProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* File Upload Dropzone */}
            {inputMode === 'upload' && (
                <>
            <div
                {...getRootProps()}
                className={`
          relative p-8 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
          ${isDragActive
                        ? 'border-emerald-400 bg-emerald-500/10 scale-102'
                        : 'border-gray-600 hover:border-emerald-500 hover:bg-white/5'
                    }
          ${(isUploading || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className={`
            w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
            ${isDragActive ? 'bg-emerald-500/20 scale-110' : 'bg-gray-700/50'}
          `}>
                        <svg
                            className={`w-10 h-10 ${isDragActive ? 'text-emerald-400' : 'text-gray-400'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    </div>

                    <div className="text-center">
                        <p className="text-lg font-medium text-gray-200">
                            {isDragActive
                                ? 'Drop your video here...'
                                : 'Drag & drop a football video'
                            }
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            or click to browse
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Supported: {ALLOWED_TYPES.join(', ')} • Max {MAX_SIZE_MB}MB • Max 5 minutes
                        </p>
                    </div>
                </div>
            </div>

            {selectedFile && !isUploading && !isProcessing && (
                <div className="mt-6 p-4 glass rounded-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>

                            <div>
                                <p className="text-gray-200 font-medium truncate max-w-xs">
                                    {selectedFile.name}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {formatFileSize(selectedFile.size)}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleRemoveFile}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <button
                                onClick={handleFileUpload}
                        className="mt-4 w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 
                       hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold 
                       transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                       shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                    >
                        <span className="flex items-center justify-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Process Video</span>
                        </span>
                    </button>
                </div>
            )}

            {isUploading && (
                <div className="mt-6 p-4 glass rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 font-medium">Uploading...</span>
                        <span className="text-emerald-400 font-semibold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
                    )}
                </>
            )}
        </div>
    );
}

