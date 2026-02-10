/**
 * Photo and upload related types
 */

export type PhotoStatus = 'pending' | 'processing' | 'approved' | 'rejected';
export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface Photo {
    id: string;
    url: string;
    thumbnailUrl?: string;
    uploadedBy: string;
    uploaderName?: string;
    status: PhotoStatus;
    uploadedAt: string;
    processedAt?: string;
    rejectionReason?: string;
}

export interface UploadProgress {
    fileId: string;
    fileName: string;
    progress: number;
    status: UploadStatus;
    error?: string;
}

export interface PhotoUploadResponse {
    success: boolean;
    photoId?: string;
    message?: string;
}

export interface PhotoGalleryResponse {
    photos: Photo[];
    total: number;
    page: number;
    pageSize: number;
}

export interface SearchRequest {
    selfieUrl: string;
    threshold?: number;
}

export interface SearchResponse {
    photos: Photo[];
    matches: number;
}
