/**
 * SelfieUpload Component
 * Selfie upload for user reference photo
 */

'use client';

import { useState, useRef } from 'react';
import Button from '@/components/ui/Button';
import { userAPI } from '@/lib/api';
import { isValidImageFile, isValidImageSize, createFilePreview, revokeFilePreview } from '@/lib/utils';

interface SelfieUploadProps {
    onUploadComplete?: (selfieUrl: string) => void;
    existingSelfie?: string;
}

export default function SelfieUpload({ onUploadComplete, existingSelfie }: SelfieUploadProps) {
    const [preview, setPreview] = useState<string | null>(existingSelfie || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');

        if (!isValidImageFile(file)) {
            setError('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
            return;
        }

        if (!isValidImageSize(file, 5)) {
            setError('File too large. Maximum size is 5MB.');
            return;
        }

        // Clear old preview
        if (preview && preview.startsWith('blob:')) {
            revokeFilePreview(preview);
        }

        setSelectedFile(file);
        setPreview(createFilePreview(file));
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setError('');

        try {
            const response = await userAPI.uploadSelfie(selectedFile);

            // Clear blob preview
            if (preview && preview.startsWith('blob:')) {
                revokeFilePreview(preview);
            }

            setPreview(response.selfieUrl);
            setSelectedFile(null);
            onUploadComplete?.(response.selfieUrl);
        } catch (err: any) {
            console.error('Selfie upload error:', err);
            setError(err.response?.data?.message || 'Failed to upload selfie. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="flex flex-col items-center">
                {/* Preview */}
                <div className="w-48 h-48 mb-4 relative">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Selfie preview"
                            className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <svg
                                className="w-16 h-16 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {preview ? 'Change Photo' : 'Select Photo'}
                    </Button>

                    {selectedFile && (
                        <Button
                            variant="primary"
                            onClick={handleUpload}
                            loading={uploading}
                        >
                            Upload
                        </Button>
                    )}
                </div>

                <p className="mt-3 text-xs text-gray-500 text-center">
                    Upload a clear front-facing photo of yourself.<br />
                    This will be used to find your photos in events.
                </p>
            </div>
        </div>
    );
}
