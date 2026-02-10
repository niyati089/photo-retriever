/**
 * Admin Dashboard Page
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardBody } from '@/components/ui/Card';
import ApprovalInterface from '@/components/dashboard/ApprovalInterface';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { isAuthenticated, isAdmin } from '@/lib/auth';
import { adminAPI } from '@/lib/api';
import { UserStats } from '@/types/user';

export default function AdminDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        // Check if user has admin role
        if (!isAdmin()) {
            router.push('/login');
            return;
        }

        fetchStats();
    }, [router]);

    const fetchStats = async () => {
        try {
            const data = await adminAPI.getStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
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
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600 mt-2">
                                Manage platform content and users
                            </p>
                        </div>

                        {/* Stats Section */}
                        {loading ? (
                            <LoadingSpinner centered />
                        ) : stats ? (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card>
                                    <CardBody>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
                                            <div className="text-sm text-gray-600 mt-1">Total Users</div>
                                        </div>
                                    </CardBody>
                                </Card>

                                <Card>
                                    <CardBody>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-purple-600">{stats.totalPhotographers}</div>
                                            <div className="text-sm text-gray-600 mt-1">Photographers</div>
                                        </div>
                                    </CardBody>
                                </Card>

                                <Card>
                                    <CardBody>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-green-600">{stats.totalPhotos}</div>
                                            <div className="text-sm text-gray-600 mt-1">Total Photos</div>
                                        </div>
                                    </CardBody>
                                </Card>

                                <Card>
                                    <CardBody>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-yellow-600">{stats.pendingApprovals}</div>
                                            <div className="text-sm text-gray-600 mt-1">Pending Approvals</div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        ) : null}

                        {/* Approval Interface */}
                        <ApprovalInterface />
                    </div>
                </main>
            </div>
        </div>
    );
}
