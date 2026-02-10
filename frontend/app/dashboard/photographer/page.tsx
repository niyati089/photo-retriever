/**
 * Photographer Dashboard Page
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import PhotoUpload from '@/components/dashboard/PhotoUpload';
import UploadStatus from '@/components/dashboard/UploadStatus';
import { isAuthenticated, isPhotographer } from '@/lib/auth';

export default function PhotographerDashboardPage() {
    const router = useRouter();
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        // Check authentication
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        // Check if user has photographer role
        if (!isPhotographer()) {
            router.push('/login');
            return;
        }
    }, [router]);

    const handleUploadComplete = () => {
        // Refresh the upload status list
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="flex">
                <Sidebar />

                <main className="flex-1 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Photographer Dashboard</h1>
                            <p className="text-gray-600 mt-2">
                                Upload and manage your event photos
                            </p>
                        </div>

                        {/* Upload Section */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold">Upload Photos</h2>
                            </CardHeader>
                            <CardBody>
                                <PhotoUpload
                                    onUploadComplete={handleUploadComplete}
                                    multiple
                                />
                            </CardBody>
                        </Card>

                        {/* Status Section */}
                        <div key={refreshKey}>
                            <UploadStatus />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
