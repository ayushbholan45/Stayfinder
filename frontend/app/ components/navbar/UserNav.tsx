'use client'

import { useState } from 'react'
import MenuLink from './MenuLink'
import LogoutButton from '../LogoutButton'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useLoginModal from '@/app/hooks/useLoginModal'
import useSignupModal from '@/app/hooks/useSignupModal'

interface UserNavProps {
    userId?: string | null;
    userName?: string | null;
}
 
const UserNav: React.FC<UserNavProps> = ({ userId, userName }) => {
    const router = useRouter();
    const loginModal = useLoginModal();    
    const signupModal = useSignupModal();    
    const [isOpen, setIsOpen] = useState(false)

    const initial = userName ? userName.charAt(0).toUpperCase() : null;

    return (
        <div className="flex items-center gap-3">
            {/* Avatar initial — redirects to profile */}
            {userId && initial && (
                <Link
                    href="/profile"
                    className="w-9 h-9 rounded-full bg-stayfinder text-white flex items-center justify-center font-bold text-sm hover:bg-stayfinder-dark transition"
                >
                    {initial}
                </Link>
            )}

            <div className="p-2 relative inline-block border rounded-full">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center cursor-pointer"
                >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>

                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                </button>

                {isOpen && (
                    <div className='w-55 absolute top-15 right-0 bg-white border border-gray-300 rounded-xl shadow-md flex flex-col cursor-pointer'>
                        {userId ? (
                            <>
                                <MenuLink
                                    label='Profile'
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/profile');
                                    }}
                                />
                                <MenuLink
                                    label='Inbox'
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/inbox');
                                    }}
                                />
                                <MenuLink
                                    label='My properties'
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/myproperties');
                                    }}
                                />
                                <MenuLink
                                    label='My reservations'
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/myreservations');
                                    }}
                                />
                                <MenuLink
                                    label='My favorites'
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/myfavorites');
                                    }}
                                />
                                <LogoutButton
                                    onClose={() => setIsOpen(false)}
                                />
                            </>
                        ) : (
                            <>
                                <MenuLink 
                                    label='Login'
                                    onClick={() => { 
                                        setIsOpen(false);
                                        loginModal.open();
                                    }}
                                />
                                <MenuLink 
                                    label='Sign up'
                                    onClick={() => { 
                                        setIsOpen(false);
                                        signupModal.open();
                                    }}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserNav