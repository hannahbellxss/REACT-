import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../api/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (user) {
        return <Navigate to="/welcome" replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate('/welcome');
        } catch (requestError) {
            const responseData = requestError.response?.data;
            const responseError = responseData?.errors?.[Object.keys(responseData.errors)[0]]?.[0]
                || responseData?.message;

            setError(responseError || requestError.message || 'Unable to sign in. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h2>Account Login</h2>

                {error && (
                    <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
