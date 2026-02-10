/**
 * User profile and admin related types
 */

import { UserRole } from './auth';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    selfieUrl?: string;
    createdAt: string;
    lastLogin?: string;
}

export interface UserStats {
    totalUsers: number;
    totalPhotographers: number;
    totalPhotos: number;
    pendingApprovals: number;
}

export interface AdminApprovalItem {
    id: string;
    photoUrl: string;
    thumbnailUrl?: string;
    uploadedBy: string;
    uploaderEmail: string;
    uploadedAt: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface ApprovalAction {
    photoId: string;
    action: 'approve' | 'reject';
    reason?: string;
}
