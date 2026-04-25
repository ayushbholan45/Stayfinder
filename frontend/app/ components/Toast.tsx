'use client';

import { useEffect } from 'react';
import useToast from '@/app/hooks/useToast';

const Toast = () => {
    const { message, type, hide } = useToast();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                hide();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!message) return null;

    return (
        <div className={`fixed top-25 right-6 z-50 px-6 py-4 rounded-xl shadow-lg text-white font-semibold transition-all duration-300 ${
            type === 'success' ? 'bg-green-800' : 'bg-red-800'
        }`}>
            {type === 'success' ? '' : ''} {message}
        </div>
    );
};

export default Toast;