/**
 * Login Page
 */

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import LoginForm from '@/components/auth/LoginForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-md mx-auto px-4 py-16">
                <Card>
                    <CardHeader>
                        <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
                        <p className="text-gray-600 text-center mt-2">
                            Sign in to your account
                        </p>
                    </CardHeader>

                    <CardBody>
                        <LoginForm />

                        <div className="mt-6 text-center text-sm text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                                Sign up
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
