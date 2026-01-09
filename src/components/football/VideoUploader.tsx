'use client';

import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

interface VideoUploaderProps {
    onUploadComplete: (jobId: string) => void;
    onError: (error: string) => void;
    isProcessing: boolean;
    userId: string | null;
}

const ALLOWED_TYPES = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];
const MAX_SIZE_MB = 500;

export default function VideoUploader({
    onUploadComplete,
    onError,
    isProcessing,
    userId
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

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('userId', userId);

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
                xhr.open('POST', '/api/football/upload');
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
            {/* File Upload Dropzone */}
            <div
                {...getRootProps()}
                className={`
                    relative p-12 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
                    ${isDragActive
                        ? 'border-emerald-400 bg-emerald-500/10 scale-[1.02]'
                        : 'border-gray-600 hover:border-emerald-500 hover:bg-white/5'
                    }
                    ${(isUploading || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className={`
                        w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300
                        ${isDragActive ? 'bg-emerald-500/20 scale-110' : 'bg-gray-700/50'}
                    `}>
                        <svg
                            className={`w-12 h-12 ${isDragActive ? 'text-emerald-400' : 'text-gray-400'}`}
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
                        <p className="text-xl font-semibold text-gray-200 mb-2">
                            {isDragActive
                                ? 'Drop your video here...'
                                : 'Upload Football Match Video'
                            }
                        </p>
                        <p className="text-sm text-gray-400 mb-1">
                            Drag & drop your video file or click to browse
                        </p>
                        <p className="text-xs text-gray-500 mt-3">
                            Supported formats: {ALLOWED_TYPES.join(', ')} • Max {MAX_SIZE_MB}MB • Max 5 minutes
                        </p>
                    </div>
                </div>
            </div>

            {/* Selected File Preview */}
            {selectedFile && !isUploading && !isProcessing && (
                <div className="mt-6 p-6 glass rounded-xl border border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 
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

            {/* Upload Progress */}
            {isUploading && (
                <div className="mt-6 p-6 glass rounded-xl border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-300 font-medium">Uploading video...</span>
                        <span className="text-emerald-400 font-semibold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
