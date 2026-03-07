import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <AnimatedPage>
            <div className="min-h-screen flex items-center justify-center p-4"
                style={{ background: 'linear-gradient(135deg, #1B4332 0%, #0d2418 100%)' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl w-full"
                >
                    {/* Logo */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold mb-4" style={{ color: '#D4A017' }}>
                            VazhiKaatti
                        </h1>
                        <p className="text-2xl" style={{ color: '#FAF7F0', fontFamily: 'Noto Sans Tamil, sans-serif' }}>
                            வழிகாட்டி - Welcome / வரவேற்கிறோம்
                        </p>
                        <p className="text-lg mt-4" style={{ color: '#e8f4ea' }}>
                            Please select your role to proceed / தொடர உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Farmer/Women Option */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/farmer-login')}
                            className="rounded-3xl shadow-2xl p-8 cursor-pointer flex flex-col items-center justify-center text-center transition-all"
                            style={{
                                backgroundColor: '#FAF7F0',
                                border: '4px solid #2D6A4F'
                            }}
                        >
                            <User className="h-24 w-24 mb-6" style={{ color: '#2D6A4F' }} />
                            <h2 className="text-3xl font-bold mb-4" style={{ color: '#1B4332' }}>Farmer / Women</h2>
                            <p className="text-xl" style={{ color: '#6B4226', fontFamily: 'Noto Sans Tamil, sans-serif' }}>
                                விவசாயி / பெண்கள்
                            </p>
                            <p className="mt-6 text-gray-600">Login with Aadhaar to access schemes and credit score</p>
                        </motion.div>

                        {/* Admin/Officer Option */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/admin-login')}
                            className="rounded-3xl shadow-2xl p-8 cursor-pointer flex flex-col items-center justify-center text-center transition-all"
                            style={{
                                backgroundColor: '#1e3a5f',
                                border: '4px solid #D4A017'
                            }}
                        >
                            <ShieldCheck className="h-24 w-24 mb-6" style={{ color: '#D4A017' }} />
                            <h2 className="text-3xl font-bold mb-4" style={{ color: '#FAF7F0' }}>Admin / Officer</h2>
                            <p className="text-xl" style={{ color: '#D4A017', fontFamily: 'Noto Sans Tamil, sans-serif' }}>
                                நிர்வாகி / அதிகாரி
                            </p>
                            <p className="mt-6 text-gray-300">Login to verify applications and manage platform</p>
                        </motion.div>
                    </div>

                </motion.div>
            </div>
        </AnimatedPage>
    );
};

export default LoginPage;
