/**
 * Navbar Component
 * Top navigation bar with logo, user menu, and logout functionality
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, logout as authLogout } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface NavbarProps {
    showAuthButtons?: boolean;
}

/**
 * Navbar component for all pages
 */
export default function Navbar({ showAuthButtons = false }: NavbarProps) {
    const router = useRouter();
    const user = typeof window !== 'undefined' ? getUser() : null;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = () => {
        authLogout();
        router.push('/login');
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            case 'photographer':
                return 'bg-blue-100 text-blue-800';
            case 'user':
            default:
                return 'bg-green-100 text-green-800';
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
                        <span className="text-xl font-bold text-gray-900">PhotoRetriever</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <span
                                            className={cn(
                                                'text-xs px-2 py-0.5 rounded-full font-medium',
                                                getRoleBadgeColor(user.role)
                                            )}
                                        >
                                            {user.role}
                                        </span>
                                    </div>
                                    <svg
                                        className={cn(
                                            'w-5 h-5 text-gray-400 transition-transform',
                                            userMenuOpen && 'rotate-180'
                                        )}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {/* User Dropdown Menu */}
                                {userMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setUserMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                            <Link
                                                href="/dashboard/user"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : showAuthButtons ? (
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={() => router.push('/login')}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => router.push('/signup')}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        ) : null}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {mobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 py-3 space-y-3">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 px-3 py-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <span
                                            className={cn(
                                                'text-xs px-2 py-0.5 rounded-full font-medium',
                                                getRoleBadgeColor(user.role)
                                            )}
                                        >
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard/user"
                                    className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Logout
                                </button>
                            </>
                        ) : showAuthButtons ? (
                            <>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => {
                                        router.push('/login');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={() => {
                                        router.push('/signup');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </>
                        ) : null}
                    </div>
                </div>
            )}
        </nav>
    );
}
