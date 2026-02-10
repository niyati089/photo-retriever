/**
 * Sidebar Component
 * Dashboard sidebar navigation with role-specific menu items
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { UserRole } from '@/types/auth';
import { cn } from '@/lib/utils';

interface MenuItem {
    label: string;
    href: string;
    icon: string; // Icon name for easier identification
    roles: UserRole[];
}

const menuItems: MenuItem[] = [
    {
        label: 'Dashboard',
        href: '/dashboard/user',
        icon: 'home',
        roles: ['user'],
    },
    {
        label: 'My Photos',
        href: '/dashboard/user/photos',
        icon: 'photos',
        roles: ['user'],
    },
    {
        label: 'Dashboard',
        href: '/dashboard/photographer',
        icon: 'home',
        roles: ['photographer'],
    },
    {
        label: 'Upload Photos',
        href: '/dashboard/photographer/upload',
        icon: 'upload',
        roles: ['photographer'],
    },
    {
        label: 'My Uploads',
        href: '/dashboard/photographer/uploads',
        icon: 'photos',
        roles: ['photographer'],
    },
    {
        label: 'Dashboard',
        href: '/dashboard/admin',
        icon: 'home',
        roles: ['admin'],
    },
    {
        label: 'Approvals',
        href: '/dashboard/admin/approvals',
        icon: 'approval',
        roles: ['admin'],
    },
    {
        label: 'Users',
        href: '/dashboard/admin/users',
        icon: 'users',
        roles: ['admin'],
    },
    {
        label: 'Analytics',
        href: '/dashboard/admin/analytics',
        icon: 'analytics',
        roles: ['admin'],
    },
];

/**
 * Icon component mapper
 */
function MenuIcon({ icon, className }: { icon: string; className?: string }) {
    const iconPaths: Record<string, string> = {
        home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        photos: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
        upload: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
        approval: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        analytics: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    };

    return (
        <svg
            className={cn('w-5 h-5', className)}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={iconPaths[icon] || iconPaths.home}
            />
        </svg>
    );
}

interface SidebarProps {
    collapsed?: boolean;
}

/**
 * Sidebar navigation for dashboard pages
 */
export default function Sidebar({ collapsed = false }: SidebarProps) {
    const pathname = usePathname();
    const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        setUser(getUser());
    }, []);

    if (!user) return null;

    // Filter menu items based on user role
    const filteredMenuItems = menuItems.filter((item) =>
        item.roles.includes(user.role)
    );

    const sidebarContent = (
        <div className="flex flex-col h-full bg-gray-900 text-white">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold">
                    {user.role === 'admin' && 'Admin Panel'}
                    {user.role === 'photographer' && 'Photographer Panel'}
                    {user.role === 'user' && 'My Dashboard'}
                </h2>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-2">
                {filteredMenuItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            )}
                        >
                            <MenuIcon icon={item.icon} />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    {!collapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    'hidden lg:block bg-gray-900 border-r border-gray-800 transition-all duration-300',
                    collapsed ? 'w-20' : 'w-64'
                )}
            >
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar Toggle Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed bottom-4 right-4 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <>
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsMobileOpen(false)}
                    />
                    <aside className="lg:hidden fixed top-0 left-0 bottom-0 w-64 z-50">
                        {sidebarContent}
                    </aside>
                </>
            )}
        </>
    );
}
