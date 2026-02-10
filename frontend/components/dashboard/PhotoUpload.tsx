/**
 * PhotoUpload Component
 * Photo upload with drag-and-drop, preview, and progress tracking
 */

'use client';

import { useState, useRef, DragEvent } from 'react';
import Button from '@/components/ui/Button';
import { photoAPI } from '@/lib/api';
import { UploadProgress, UploadStatus } from '@/types/photo';
import { isValidImageFile, isValidImageSize, formatFileSize, createFilePreview, revokeFilePreview } from '@/lib/utils';

interface PhotoUploadProps {
    onUploadComplete?: () => void;
    multiple?: boolean;
}

export default function PhotoUpload({ onUploadComplete, multiple = true }: PhotoUploadProps) {
    const [uploads, setUploads] = useState<UploadProgress[]>([]);
    const [previews, setPreviews] = useState<{ id: string; url: string; file: File }[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (files: FileList) => {
        const fileArray = Array.from(files);
        const validFiles: File[] = [];
        const errors: string[] = [];

        fileArray.forEach((file) => {
            if (!isValidImageFile(file)) {
                errors.push(`${file.name}: Invalid file type. Only JPEG, PNG, and WebP are allowed.`);
                return;
            }

            if (!isValidImageSize(file, 10)) {
                errors.push(`${file.name}: File too large. Maximum size is 10MB.`);
                return;
            }

            validFiles.push(file);
        });

        if (errors.length > 0) {
            alert(errors.join('\n'));
        }

        if (validFiles.length > 0) {
            const newPreviews = validFiles.map((file) => ({
                id: Math.random().toString(36).substring(7),
                url: createFilePreview(file),
                file,
            }));

            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const removePreview = (id: string) => {
        setPreviews((prev) => {
            const preview = prev.find((p) => p.id === id);
            if (preview) {
                revokeFilePreview(preview.url);
            }
            return prev.filter((p) => p.id !== id);
        });
    };

    const uploadPhotos = async () => {
        if (previews.length === 0) return;

        const newUploads: UploadProgress[] = previews.map((preview) => ({
            fileId: preview.id,
            fileName: preview.file.name,
            progress: 0,
            status: 'uploading' as UploadStatus,
        }));

        setUploads(newUploads);

        for (const preview of previews) {
            try {
                setUploads((prev) =>
                    prev.map((u) =>
                        u.fileId === preview.id ? { ...u, progress: 50, status: 'uploading' as UploadStatus } : u
                    )
                );

                await photoAPI.uploadPhoto(preview.file);

                setUploads((prev) =>
                    prev.map((u) =>
                        u.fileId === preview.id ? { ...u, progress: 100, status: 'success' as UploadStatus } : u
                    )
                );

                revokeFilePreview(preview.url);
            } catch (error) {
                console.error('Upload error:', error);
                setUploads((prev) =>
                    prev.map((u) =>
                        u.fileId === preview.id
                            ? { ...u, status: 'error' as UploadStatus, error: 'Upload failed' }
                            : u
                    )
                );
            }
        }

        // Clear previews after upload
        setTimeout(() => {
            setPreviews([]);
            setUploads([]);
            onUploadComplete?.();
        }, 2000);
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
            >
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
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

                <p className="mt-2 text-sm text-gray-600">
                    Drag and drop your photos here, or{' '}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 hover:underline font-medium"
                    >
                        browse
                    </button>
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, WEBP up to 10MB {multiple && '(multiple files supported)'}
                </p>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple={multiple}
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {/* Preview Grid */}
            {previews.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Selected Photos ({previews.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {previews.map((preview) => (
                            <div key={preview.id} className="relative group">
                                <img
                                    src={preview.url}
                                    alt={preview.file.name}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                    onClick={() => removePreview(preview.id)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                                <p className="text-xs text-gray-600 mt-1 truncate">{preview.file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(preview.file.size)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <Button
                            onClick={uploadPhotos}
                            variant="primary"
                            fullWidth
                            disabled={uploads.some((u) => u.status === 'uploading')}
                            loading={uploads.some((u) => u.status === 'uploading')}
                        >
                            Upload {previews.length} Photo{previews.length !== 1 ? 's' : ''}
                        </Button>
                    </div>
                </div>
            )}

            {/* Upload Progress */}
            {uploads.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">Upload Progress</h3>
                    {uploads.map((upload) => (
                        <div key={upload.fileId} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-700 truncate flex-1">{upload.fileName}</span>
                                {upload.status === 'success' && (
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {upload.status === 'error' && (
                                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${upload.status === 'success'
                                            ? 'bg-green-500'
                                            : upload.status === 'error'
                                                ? 'bg-red-500'
                                                : 'bg-blue-500'
                                        }`}
                                    style={{ width: `${upload.progress}%` }}
                                />
                            </div>
                            {upload.error && <p className="text-xs text-red-600 mt-1">{upload.error}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
