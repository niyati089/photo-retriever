/**
 * PhotoGallery Component
 * Photo grid display with modal preview and actions
 */

'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Photo } from '@/types/photo';
import { formatDate } from '@/lib/utils';

interface PhotoGalleryProps {
    photos: Photo[];
    loading?: boolean;
    onDelete?: (photoId: string) => void;
    onRefresh?: () => void;
    showStatus?: boolean;
}

export default function PhotoGallery({
    photos,
    loading = false,
    onDelete,
    onRefresh,
    showStatus = false,
}: PhotoGalleryProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    const getStatusBadge = (status: Photo['status']) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
            processing: { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
            approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
            rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
        };

        const config = statusConfig[status];
        return (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${config.color}`}>
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (photos.length === 0) {
        return (
            <div className="text-center py-12">
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                <p className="mt-4 text-gray-600">No photos found</p>
                {onRefresh && (
                    <Button variant="outline" onClick={onRefresh} className="mt-4">
                        Refresh
                    </Button>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                    <div
                        key={photo.id}
                        className="group relative aspect-square cursor-pointer"
                        onClick={() => setSelectedPhoto(photo)}
                    >
                        <img
                            src={photo.thumbnailUrl || photo.url}
                            alt="Photo"
                            className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105"
                        />

                        {showStatus && (
                            <div className="absolute top-2 left-2">
                                {getStatusBadge(photo.status)}
                            </div>
                        )}

                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            {/* Photo Modal */}
            {selectedPhoto && (
                <Modal
                    isOpen={!!selectedPhoto}
                    onClose={() => setSelectedPhoto(null)}
                    title="Photo Details"
                    size="lg"
                >
                    <div className="space-y-4">
                        <img
                            src={selectedPhoto.url}
                            alt="Full size photo"
                            className="w-full rounded-lg"
                        />

                        <div className="space-y-2 text-sm">
                            {showStatus && (
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-700">Status:</span>
                                    {getStatusBadge(selectedPhoto.status)}
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700">Uploaded:</span>
                                <span className="text-gray-600">{formatDate(selectedPhoto.uploadedAt)}</span>
                            </div>

                            {selectedPhoto.uploaderName && (
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-700">By:</span>
                                    <span className="text-gray-600">{selectedPhoto.uploaderName}</span>
                                </div>
                            )}

                            {selectedPhoto.status === 'rejected' && selectedPhoto.rejectionReason && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-sm text-red-700">
                                        <strong>Rejection Reason:</strong> {selectedPhoto.rejectionReason}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = selectedPhoto.url;
                                    link.download = `photo-${selectedPhoto.id}.jpg`;
                                    link.click();
                                }}
                            >
                                Download
                            </Button>

                            {onDelete && (
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this photo?')) {
                                            onDelete(selectedPhoto.id);
                                            setSelectedPhoto(null);
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}
