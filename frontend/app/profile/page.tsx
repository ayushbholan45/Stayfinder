'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import apiService from "@/app/services/apiService";
import useToast from "@/app/hooks/useToast";

interface Reservation {
    id: string;
    start_date: string;
    end_date: string;
    number_of_nights: number;
    total_price: number;
    property: {
        id: string;
        title: string;
        image_url: string;
        price_per_night: number;
        landlord: {
            id: string;
            name: string;
        };
    };
}

interface Profile {
    id: string;
    name: string;
    email: string;
    avatar_url: string;
    bio: string;
}

const ProfilePage = () => {
    const toast = useToast();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const getProfile = async () => {
        const response = await apiService.get('/api/auth/profile/');
        setProfile(response);
        setName(response.name || '');
        setBio(response.bio || '');
        setAvatarPreview(response.avatar_url || '');
    };

    const getReservations = async () => {
        const response = await apiService.get('/api/auth/myreservations/');
        if (Array.isArray(response)) setReservations(response);
        else if (Array.isArray(response.reservations)) setReservations(response.reservations);
        else if (Array.isArray(response.data)) setReservations(response.data);
    };

    useEffect(() => {
        getProfile();
        getReservations();
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('bio', bio);
        if (avatar) formData.append('avatar', avatar);
        await apiService.post('/api/auth/profile/update/', formData);
        toast.show('Profile updated successfully!');
        setIsEditing(false);
        getProfile();
    };

    const handleCancel = async (reservationId: string) => {
        setCancellingId(reservationId);
        try {
            await apiService.delete(`/api/auth/myreservations/${reservationId}/cancel/`);
            toast.show('Reservation cancelled.');
            setConfirmCancelId(null);
            getReservations();
        } catch {
            toast.show('Failed to cancel reservation.');
        } finally {
            setCancellingId(null);
        }
    };

    const handleMessageHost = async (landlordId: string) => {
        try {
            const response = await apiService.get(`/api/chat/start/${landlordId}/`);
            if (response.conversation_id) {
                router.push(`/inbox/${response.conversation_id}`);
            }
        } catch {
            toast.show('Could not start conversation.');
        }
    };

    if (!profile) return null;

    const pastTrips = reservations.filter(r => new Date(r.end_date) < new Date());
    const upcomingTrips = reservations.filter(r => new Date(r.end_date) >= new Date());

    return (
        <main className="max-w-4xl mx-auto px-6 pb-12">

            {/* Cancel Confirm Dialog */}
            {confirmCancelId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
                        <h3 className="text-xl font-bold mb-2">Cancel reservation?</h3>
                        <p className="text-gray-500 mb-6">This action cannot be undone. Your reservation will be permanently cancelled.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmCancelId(null)}
                                className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
                            >
                                Keep it
                            </button>
                            <button
                                onClick={() => handleCancel(confirmCancelId)}
                                disabled={cancellingId === confirmCancelId}
                                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50"
                            >
                                {cancellingId === confirmCancelId ? 'Cancelling...' : 'Yes, cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 py-8 border-b border-gray-200">
                <div className="relative">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-200 relative">
                        {avatarPreview ? (
                            <Image fill src={avatarPreview} alt="Avatar" className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400">
                                👤
                            </div>
                        )}
                    </div>
                    {isEditing && (
                        <label className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1.5 cursor-pointer shadow">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                            </svg>
                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </label>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left">
                    {isEditing ? (
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                className="w-full p-3 border border-gray-300 rounded-xl"
                            />
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself..."
                                className="w-full p-3 border border-gray-300 rounded-xl h-28 resize-none"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-2 bg-stayfinder text-white rounded-xl hover:bg-stayfinder-dark font-semibold"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold">{profile.name}</h1>
                            <p className="text-gray-500 mt-1">{profile.email}</p>
                            <p className="mt-3 text-gray-700">{profile.bio || 'No bio yet.'}</p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-4 px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 font-semibold text-sm"
                            >
                                Edit profile
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Upcoming Trips */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Upcoming trips</h2>
                {upcomingTrips.length === 0 ? (
                    <p className="text-gray-500">No upcoming trips.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                        {upcomingTrips.map((reservation) => (
                            <div key={reservation.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                                <div
                                    className="relative h-40 cursor-pointer flex-shrink-0"
                                    onClick={() => router.push(`/properties/${reservation.property.id}`)}
                                >
                                    <Image
                                        fill
                                        src={reservation.property.image_url}
                                        alt={reservation.property.title}
                                        className="object-cover hover:scale-105 transition"
                                    />
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h3
                                        className="font-bold text-lg cursor-pointer hover:underline"
                                        onClick={() => router.push(`/properties/${reservation.property.id}`)}
                                    >
                                        {reservation.property.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {reservation.start_date} → {reservation.end_date}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {reservation.number_of_nights} nights · <span className="font-bold text-black">${reservation.total_price}</span>
                                    </p>
                                    <div className="flex gap-2 mt-auto pt-4">
                                        <button
                                            onClick={() => handleMessageHost(reservation.property.landlord.id)}
                                            className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                                        >
                                            Message host
                                        </button>
                                        <button
                                            onClick={() => setConfirmCancelId(reservation.id)}
                                            className="flex-1 py-2 px-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
                                        >
                                            Cancel reservation
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Past Trips */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Past trips</h2>
                {pastTrips.length === 0 ? (
                    <p className="text-gray-500">No past trips yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pastTrips.map((reservation) => (
                            <div
                                key={reservation.id}
                                className="border border-gray-200 rounded-xl overflow-hidden shadow-sm opacity-80 cursor-pointer hover:opacity-100 transition"
                                onClick={() => router.push(`/properties/${reservation.property.id}`)}
                            >
                                <div className="relative h-40">
                                    <Image
                                        fill
                                        src={reservation.property.image_url}
                                        alt={reservation.property.title}
                                        className="object-cover grayscale-30"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg">{reservation.property.title}</h3>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {reservation.start_date} → {reservation.end_date}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {reservation.number_of_nights} nights · <span className="font-bold text-black">${reservation.total_price}</span>
                                    </p>
                                    <p className="mt-3 text-sm text-stayfinder font-semibold">Book again →</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default ProfilePage;