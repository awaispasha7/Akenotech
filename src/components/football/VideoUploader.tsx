'use client';

import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { API_ENDPOINTS } from '@/config/api';

interface VideoUploaderProps {
    onUploadComplete: (jobId: string) => void;
    onError: (error: string) => void;
    isProcessing: boolean;
    userId: string | null;
    credits: number | null;
    isUnlimited: boolean;
}

const ALLOWED_TYPES = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];
const MAX_SIZE_MB = 500;

export default function VideoUploader({
    onUploadComplete,
    onError,
    isProcessing,
    userId,
    credits,
    isUnlimited
}: VideoUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

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

        // Check authentication
        if (!userId) {
            onError('Please sign in to upload videos');
            return;
        }

        // Check credits before upload
        if (credits !== null && credits <= 0 && !isUnlimited) {
            onError('You have no credits remaining. Please contact support to add more credits.');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // First, deduct credit via Next.js API (lightweight check and deduction)
            const creditDeductionResponse = await fetch('/api/football/deduct-credit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (!creditDeductionResponse.ok) {
                const errorData = await creditDeductionResponse.json().catch(() => ({ error: 'Credit deduction failed' }));
                setIsUploading(false);
                onError(errorData.error || 'Failed to deduct credit. Please try again.');
                return;
            }

            // If credit deduction succeeds, upload directly to Python backend
            // This avoids Next.js HTTP/2 protocol errors with large files
            const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
            const uploadUrl = `${backendUrl}/api/videos/upload`;

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
                xhr.open('POST', uploadUrl);
                xhr.send(formData);
            });

            onUploadComplete(response.job_id);
        } catch (error: any) {
            // Handle authentication and credit errors
            const errorMessage = error.message || 'Upload failed';
            if (errorMessage.includes('401') || errorMessage.includes('Authentication')) {
                onError('Please sign in to upload videos');
            } else if (errorMessage.includes('403') || errorMessage.includes('credits')) {
                onError(errorMessage);
            } else {
                onError(errorMessage);
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
            {/* Credit Warning Message - Show before upload */}
            {credits !== null && credits <= 0 && !isUnlimited && (
                <div className="mb-6 p-4 rounded-xl bg-yellow-500/20 border border-yellow-400/60 text-yellow-300 text-sm">
                    You have no credits remaining. Please contact support to add more credits.
                </div>
            )}

            {/* Enhanced File Upload Dropzone */}
            <div
                {...getRootProps()}
                className={`
                    relative p-12 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
                    bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-emerald-500/5
                    backdrop-blur-sm
                    ${isDragActive
                        ? 'border-emerald-400 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-emerald-500/20 scale-[1.02] shadow-2xl shadow-emerald-500/30'
                        : 'border-emerald-400/40 hover:border-emerald-400 hover:bg-gradient-to-br hover:from-emerald-500/10 hover:via-teal-500/10 hover:to-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20'
                    }
                    ${(isUploading || isProcessing || (credits !== null && credits <= 0 && !isUnlimited)) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                        {isDragActive && (
                            <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full animate-pulse"></div>
                        )}
                        <div className={`
                            relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300
                            ${isDragActive 
                                ? 'bg-gradient-to-br from-emerald-400 to-teal-500 scale-110 shadow-2xl shadow-emerald-500/50' 
                                : 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/30'
                            }
                        `}>
                            <svg
                                className={`w-12 h-12 ${isDragActive ? 'text-white' : 'text-emerald-400'}`}
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
                    </div>

                    <div className="text-center space-y-2">
                        <p className={`text-xl md:text-2xl font-bold mb-2 transition-colors ${
                            isDragActive 
                                ? 'text-emerald-300' 
                                : 'bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent'
                        }`}>
                            {isDragActive
                                ? 'Drop your video here...'
                                : 'Upload Football Match Video'
                            }
                        </p>
                        <p className="text-sm md:text-base text-white/70 mb-1">
                            Drag & drop your video file or click to browse
                        </p>
                        <p className="text-xs md:text-sm text-white/50 mt-3 px-4 py-2 rounded-lg bg-black/30 border border-emerald-400/20 inline-block">
                            📹 Supported: {ALLOWED_TYPES.join(', ')} • Max {MAX_SIZE_MB}MB • Max 5 minutes
                        </p>
                    </div>
                </div>
            </div>

            {/* Enhanced Selected File Preview */}
            {selectedFile && !isUploading && !isProcessing && (
                <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-500/10 
                    border border-emerald-400/30 backdrop-blur-md shadow-xl shadow-emerald-500/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 
                                border border-emerald-400/50 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>

                            <div>
                                <p className="text-white font-semibold truncate max-w-xs">
                                    {selectedFile.name}
                                </p>
                                <p className="text-sm text-emerald-300/80 font-medium">
                                    {formatFileSize(selectedFile.size)}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleRemoveFile}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors
                                border border-transparent hover:border-red-400/30"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <button
                        onClick={handleFileUpload}
                        disabled={isUploading || isProcessing || (credits !== null && credits <= 0 && !isUnlimited)}
                        className={`
                            w-full py-4 px-6 rounded-xl font-bold text-base
                            transition-all duration-300
                            ${
                                (credits !== null && credits <= 0 && !isUnlimited)
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-60'
                                    : 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 hover:from-emerald-400 hover:via-emerald-300 hover:to-teal-400 text-black transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-emerald-500/40 hover:shadow-emerald-500/60 disabled:opacity-60 disabled:hover:scale-100'
                            }
                        `}
                    >
                        <span className="flex items-center justify-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                                {credits !== null && credits <= 0 && !isUnlimited
                                    ? 'No Credits'
                                    : 'Analyze Video Now →'
                                }
                            </span>
                        </span>
                    </button>
                    
                    {credits !== null && credits <= 0 && !isUnlimited && (
                        <div className="mt-4 p-4 rounded-xl bg-yellow-500/20 border border-yellow-400/60 text-yellow-300 text-sm">
                            You have no credits remaining. Please contact support to add more credits.
                        </div>
                    )}
                </div>
            )}

            {/* Enhanced Upload Progress */}
            {isUploading && (
                <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-500/10 
                    border border-emerald-400/30 backdrop-blur-md shadow-xl shadow-emerald-500/10">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-white font-semibold flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Uploading video...
                        </span>
                        <span className="text-emerald-400 font-bold text-lg">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden border border-emerald-400/20">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 transition-all duration-300 
                                shadow-lg shadow-emerald-500/50"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
