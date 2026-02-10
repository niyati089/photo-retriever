/**
 * SignupForm Component
 * Registration form with role selection and validation
 */

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authAPI } from '@/lib/api';
import { storeToken, storeUser, getRedirectPath } from '@/lib/auth';
import { UserRole } from '@/types/auth';

export default function SignupForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user' as UserRole,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setGeneralError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.signup({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });

            // Store token and user data
            storeToken(response.token);
            storeUser(response.user);

            // Redirect based on role
            const redirectPath = getRedirectPath(response.user.role);
            router.push(redirectPath);
        } catch (error: any) {
            console.error('Signup error:', error);

            if (error.response?.data?.message) {
                setGeneralError(error.response.data.message);
            } else if (error.message === 'Network Error') {
                setGeneralError('Cannot connect to server. Please try again later.');
            } else {
                setGeneralError('Failed to create account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {generalError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {generalError}
                </div>
            )}

            <Input
                id="name"
                type="text"
                label="Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                required
                fullWidth
                autoComplete="name"
            />

            <Input
                id="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                required
                fullWidth
                autoComplete="email"
            />

            <Input
                id="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                helperText="Minimum 8 characters"
                required
                fullWidth
                autoComplete="new-password"
            />

            <Input
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                required
                fullWidth
                autoComplete="new-password"
            />

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    I am a <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'user' })}
                        className={`p-4 border-2 rounded-lg transition-all ${formData.role === 'user'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                    >
                        <div className="font-medium">User</div>
                        <div className="text-xs text-gray-600 mt-1">Find my photos</div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'photographer' })}
                        className={`p-4 border-2 rounded-lg transition-all ${formData.role === 'photographer'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                    >
                        <div className="font-medium">Photographer</div>
                        <div className="text-xs text-gray-600 mt-1">Upload photos</div>
                    </button>
                </div>
            </div>

            <div className="text-xs text-gray-600">
                By signing up, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                </a>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
            >
                Create Account
            </Button>
        </form>
    );
}
