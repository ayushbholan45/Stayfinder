import { create } from 'zustand';

interface ToastStore {
    message: string;
    type: 'success' | 'error' | '';
    show: (message: string, type?: 'success' | 'error') => void;
    hide: () => void;
}

const useToast = create<ToastStore>((set) => ({
    message: '',
    type: '',
    show: (message, type = 'success') => set({ message, type }),
    hide: () => set({ message: '', type: '' }),
}));

export default useToast;

