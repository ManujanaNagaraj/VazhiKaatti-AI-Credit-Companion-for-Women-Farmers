import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, User, Lock } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Assuming demo admin login: admin / admin
            if (username === 'admin' && password === 'admin') {
                localStorage.setItem('admin_verified', 'true');
                navigate('/officer');
            } else {
                setError('Invalid credentials. (Hint: Use admin/admin for demo)');
            }
        } catch (err) {
            setError('Login failed / உள்நுழைவு தோல்வி');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen flex items-center justify-center p-4"
                style={{ background: 'linear-gradient(135deg, #0F1B2D 0%, #1e3a5f 100%)' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full"
                >
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2" style={{ color: '#D4A017' }}>
                            VazhiKaatti
                        </h1>
                        <p className="text-xl" style={{ color: '#E8F4EA', fontFamily: 'Noto Sans Tamil, sans-serif' }}>
                            நிர்வாகி போர்டல்
                        </p>
                    </div>

                    {/* Login Card */}
                    <div
                        className="rounded-3xl shadow-2xl p-8"
                        style={{
                            backgroundColor: '#152943',
                            border: '3px solid #D4A017'
                        }}
                    >
                        <div className="text-center mb-6">
                            <ShieldCheck className="h-16 w-16 mx-auto mb-3" style={{ color: '#D4A017' }} />
                            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#FAF7F0' }}>
                                Admin Login
                            </h2>
                            <p className="text-gray-400" style={{ fontFamily: 'Noto Sans Tamil, sans-serif' }}>
                                அதிகாரி உள்நுழைவு
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#B8C5D0' }}>
                                    Username / பயனர் பெயர்
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#6B7280' }} />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter username"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border-2 font-medium"
                                        style={{
                                            borderColor: '#2D5A7B',
                                            backgroundColor: '#1e3a5f',
                                            color: '#E8F4EA',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#D4A017'}
                                        onBlur={(e) => e.target.style.borderColor = '#2D5A7B'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#B8C5D0' }}>
                                    Password / கடவுச்சொல்
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#6B7280' }} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border-2 font-medium"
                                        style={{
                                            borderColor: '#2D5A7B',
                                            backgroundColor: '#1e3a5f',
                                            color: '#E8F4EA',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#D4A017'}
                                        onBlur={(e) => e.target.style.borderColor = '#2D5A7B'}
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm text-center"
                                    style={{ color: '#e74c3c' }}
                                >
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 transition-all"
                                style={{
                                    backgroundColor: '#D4A017',
                                    color: '#0F1B2D',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Logging in...</span>
                                    </>
                                ) : (
                                    <span style={{ fontFamily: 'Noto Sans Tamil, sans-serif' }}>
                                        உள்நுழைய
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>

                </motion.div>
            </div>
        </AnimatedPage>
    );
};

export default AdminLogin;
