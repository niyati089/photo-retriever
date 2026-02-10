/**
 * Signup Page
 */

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import SignupForm from '@/components/auth/SignupForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-md mx-auto px-4 py-16">
                <Card>
                    <CardHeader>
                        <h1 className="text-2xl font-bold text-center">Create Account</h1>
                        <p className="text-gray-600 text-center mt-2">
                            Join PhotoRetriever today
                        </p>
                    </CardHeader>

                    <CardBody>
                        <SignupForm />

                        <div className="mt-6 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 hover:underline font-medium">
                                Sign in
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
