/**
 * LoginForm Component
 * Login form with email/password validation and API integration
 */

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authAPI } from '@/lib/api';
import { storeToken, storeUser, getRedirectPath } from '@/lib/auth';

export default function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
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
            const response = await authAPI.login(formData);

            // Store token and user data
            storeToken(response.token);
            storeUser(response.user);

            // Redirect based on role
            const redirectPath = getRedirectPath(response.user.role);
            router.push(redirectPath);
        } catch (error: any) {
            console.error('Login error:', error);

            if (error.response?.data?.message) {
                setGeneralError(error.response.data.message);
            } else if (error.message === 'Network Error') {
                setGeneralError('Cannot connect to server. Please try again later.');
            } else {
                setGeneralError('Invalid email or password');
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
                required
                fullWidth
                autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:underline">
                    Forgot password?
                </a>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
            >
                Sign In
            </Button>
        </form>
    );
}
