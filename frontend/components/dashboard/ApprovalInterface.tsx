/**
 * ApprovalInterface Component
 * Admin interface for approving/rejecting photo uploads
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import { adminAPI } from '@/lib/api';
import { AdminApprovalItem } from '@/types/user';
import { formatDate } from '@/lib/utils';

export default function ApprovalInterface() {
    const [items, setItems] = useState<AdminApprovalItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<AdminApprovalItem | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchPendingApprovals();
    }, []);

    const fetchPendingApprovals = async () => {
        setLoading(true);
        try {
            const data = await adminAPI.getPendingApprovals();
            setItems(data);
        } catch (error) {
            console.error('Error fetching approvals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (photoId: string) => {
        setProcessing(true);
        try {
            await adminAPI.processApproval({ photoId, action: 'approve' });
            setItems((prev) => prev.filter((item) => item.id !== photoId));
            setSelectedItem(null);
        } catch (error) {
            console.error('Error approving photo:', error);
            alert('Failed to approve photo');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async (photoId: string, reason: string) => {
        setProcessing(true);
        try {
            await adminAPI.processApproval({ photoId, action: 'reject', reason });
            setItems((prev) => prev.filter((item) => item.id !== photoId));
            setSelectedItem(null);
            setRejectionReason('');
        } catch (error) {
            console.error('Error rejecting photo:', error);
            alert('Failed to reject photo');
        } finally {
            setProcessing(false);
        }
    };

    const handleBatchApprove = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Approve ${selectedIds.size} photos?`)) return;

        setProcessing(true);
        try {
            const actions = Array.from(selectedIds).map((id) => ({
                photoId: id,
                action: 'approve' as const,
            }));

            await adminAPI.processBatchApproval(actions);
            setItems((prev) => prev.filter((item) => !selectedIds.has(item.id)));
            setSelectedIds(new Set());
        } catch (error) {
            console.error('Error batch approving:', error);
            alert('Failed to batch approve photos');
        } finally {
            setProcessing(false);
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    if (loading) {
        return <LoadingSpinner size="lg" text="Loading pending approvals..." centered />;
    }

    return (
        <div className="space-y-6">
            {/* Header with Batch Actions */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                    Pending Approvals ({items.length})
                </h2>

                {selectedIds.size > 0 && (
                    <Button
                        variant="primary"
                        onClick={handleBatchApprove}
                        loading={processing}
                    >
                        Approve Selected ({selectedIds.size})
                    </Button>
                )}
            </div>

            {items.length === 0 ? (
                <Card>
                    <CardBody>
                        <p className="text-center text-gray-600 py-8">No pending approvals</p>
                    </CardBody>
                </Card>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="relative">
                            <Card hover>
                                <CardBody className="p-0">
                                    {/* Selection Checkbox */}
                                    <div className="absolute top-2 left-2 z-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(item.id)}
                                            onChange={() => toggleSelection(item.id)}
                                            className="w-5 h-5 rounded cursor-pointer"
                                        />
                                    </div>

                                    {/* Photo */}
                                    <div
                                        className="aspect-square cursor-pointer"
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <img
                                            src={item.thumbnailUrl || item.photoUrl}
                                            alt="Pending photo"
                                            className="w-full h-full object-cover rounded-t-lg"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="p-3 space-y-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {item.uploaderEmail}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(item.uploadedAt)}
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedItem && (
                <Modal
                    isOpen={!!selectedItem}
                    onClose={() => {
                        setSelectedItem(null);
                        setRejectionReason('');
                    }}
                    title="Review Photo"
                    size="lg"
                >
                    <div className="space-y-4">
                        <img
                            src={selectedItem.photoUrl}
                            alt="Full size"
                            className="w-full rounded-lg"
                        />

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Uploaded by:</span>
                                <span className="text-gray-600">{selectedItem.uploaderEmail}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Uploaded:</span>
                                <span className="text-gray-600">{formatDate(selectedItem.uploadedAt)}</span>
                            </div>
                        </div>

                        {/* Rejection Reason Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rejection Reason (optional)
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Explain why this photo is being rejected..."
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={() => handleApprove(selectedItem.id)}
                                loading={processing}
                            >
                                Approve
                            </Button>

                            <Button
                                variant="danger"
                                fullWidth
                                onClick={() => handleReject(selectedItem.id, rejectionReason)}
                                loading={processing}
                            >
                                Reject
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
