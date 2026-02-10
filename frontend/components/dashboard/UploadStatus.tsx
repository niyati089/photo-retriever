/**
 * UploadStatus Component
 * Status dashboard for photographers showing upload progress
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { photoAPI } from '@/lib/api';
import { Photo } from '@/types/photo';
import { formatDate } from '@/lib/utils';

export default function UploadStatus() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await photoAPI.getUploadStatus();
            setPhotos(data);
        } catch (err: any) {
            console.error('Error fetching upload status:', err);
            setError(err.response?.data?.message || 'Failed to load upload status');
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status: Photo['status']) => {
        const configs = {
            pending: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Pending Review' },
            processing: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Processing' },
            approved: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Approved' },
            rejected: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Rejected' },
        };
        return configs[status];
    };

    const stats = {
        total: photos.length,
        pending: photos.filter((p) => p.status === 'pending').length,
        approved: photos.filter((p) => p.status === 'approved').length,
        rejected: photos.filter((p) => p.status === 'rejected').length,
    };

    if (loading) {
        return <LoadingSpinner size="lg" text="Loading upload status..." centered />;
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardBody>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600 mt-1">Total Uploads</div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                            <div className="text-sm text-gray-600 mt-1">Pending</div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
                            <div className="text-sm text-gray-600 mt-1">Approved</div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
                            <div className="text-sm text-gray-600 mt-1">Rejected</div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Upload List */}
            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold">Recent Uploads</h2>
                </CardHeader>
                <CardBody>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    {photos.length === 0 ? (
                        <p className="text-center text-gray-600 py-8">No uploads yet</p>
                    ) : (
                        <div className="space-y-3">
                            {photos.map((photo) => {
                                const statusConfig = getStatusConfig(photo.status);
                                return (
                                    <div
                                        key={photo.id}
                                        className={`border rounded-lg p-4 ${statusConfig.border} ${statusConfig.bg}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={photo.thumbnailUrl || photo.url}
                                                alt="Upload"
                                                className="w-16 h-16 object-cover rounded"
                                            />

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-sm font-medium ${statusConfig.color}`}>
                                                        {statusConfig.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Uploaded {formatDate(photo.uploadedAt)}
                                                </p>
                                                {photo.status === 'rejected' && photo.rejectionReason && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        Reason: {photo.rejectionReason}
                                                    </p>
                                                )}
                                            </div>

                                            <a
                                                href={photo.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline text-sm"
                                            >
                                                View
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
