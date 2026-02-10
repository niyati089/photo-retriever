/**
 * User Dashboard Page
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import SelfieUpload from '@/components/dashboard/SelfieUpload';
import PhotoGallery from '@/components/dashboard/PhotoGallery';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { isAuthenticated, isRegularUser } from '@/lib/auth';
import { userAPI } from '@/lib/api';
import { Photo } from '@/types/photo';

export default function UserDashboardPage() {
    const router = useRouter();
    const [selfieUploaded, setSelfieUploaded] = useState(false);
    const [matchedPhotos, setMatchedPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        // Check authentication
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        // Check if user has correct role
        if (!isRegularUser()) {
            router.push('/login');
            return;
        }
    }, [router]);

    const handleSearchPhotos = async () => {
        if (!selfieUploaded) {
            alert('Please upload a selfie first');
            return;
        }

        setSearching(true);
        try {
            // In production, this would use the actual selfie URL
            const response = await userAPI.searchPhotos({
                selfieUrl: 'user-selfie-url',
                threshold: 0.8,
            });

            setMatchedPhotos(response.photos);
        } catch (error) {
            console.error('Search error:', error);
            alert('Failed to search photos. Please try again.');
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="flex">
                <Sidebar />

                <main className="flex-1 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/*  Header */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                            <p className="text-gray-600 mt-2">
                                Upload a selfie to find your photos from events
                            </p>
                        </div>

                        {/* Selfie Upload Section */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold">Step 1: Upload Your Selfie</h2>
                            </CardHeader>
                            <CardBody>
                                <SelfieUpload
                                    onUploadComplete={() => setSelfieUploaded(true)}
                                />
                            </CardBody>
                        </Card>

                        {/* Search Section */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold">Step 2: Find Your Photos</h2>
                            </CardHeader>
                            <CardBody>
                                <div className="text-center py-4">
                                    <p className="text-gray-600 mb-4">
                                        Click the button below to search for your photos
                                    </p>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={handleSearchPhotos}
                                        loading={searching}
                                        disabled={!selfieUploaded}
                                    >
                                        {searching ? 'Searching...' : 'Find My Photos'}
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Results Section */}
                        {matchedPhotos.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <h2 className="text-xl font-semibold">
                                        Your Photos ({matchedPhotos.length})
                                    </h2>
                                </CardHeader>
                                <CardBody>
                                    <PhotoGallery
                                        photos={matchedPhotos}
                                        loading={loading}
                                    />
                                </CardBody>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
