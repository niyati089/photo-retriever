/**
 * Card Component
 * Reusable card container with header, body, and footer sections
 */

'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

interface CardBodyProps {
    children: ReactNode;
    className?: string;
}

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

/**
 * Main Card component
 */
export function Card({ children, className, hover = false }: CardProps) {
    return (
        <div
            className={cn(
                'bg-white rounded-lg shadow-md border border-gray-200',
                hover && 'transition-shadow hover:shadow-lg',
                className
            )}
        >
            {children}
        </div>
    );
}

/**
 * Card Header
 */
export function CardHeader({ children, className }: CardHeaderProps) {
    return (
        <div className={cn('px-6 py-4 border-b border-gray-200', className)}>
            {children}
        </div>
    );
}

/**
 * Card Body
 */
export function CardBody({ children, className }: CardBodyProps) {
    return (
        <div className={cn('px-6 py-4', className)}>
            {children}
        </div>
    );
}

/**
 * Card Footer
 */
export function CardFooter({ children, className }: CardFooterProps) {
    return (
        <div className={cn('px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg', className)}>
            {children}
        </div>
    );
}

export default Card;
