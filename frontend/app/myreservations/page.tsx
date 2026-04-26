'use client'

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import apiService from "../services/apiService"

const MyReservationsPage = () => {
    const [reservations, setReservations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchReservations = async () => {
        try {
            const response = await apiService.get('/api/auth/myreservations/')
            if (Array.isArray(response)) {
                setReservations(response)
            } else if (Array.isArray(response.reservations)) {
                setReservations(response.reservations)
            } else if (Array.isArray(response.data)) {
                setReservations(response.data)
            }
        } catch (error) {
            console.error('API ERROR:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReservations()
    }, [])

    const cancelReservation = async (reservationId: string) => {
        try {
            await apiService.delete(`/api/properties/reservations/${reservationId}/cancel/`)
            setReservations(prev => prev.filter((r: any) => r.id !== reservationId))
        } catch (error) {
            console.error('Cancel error:', error)
        }
    }

    if (loading) {
        return (
            <main className="max-w-400 mx-auto px-6 pb-6">
                <h1 className="my-6 text-2xl">My reservations</h1>
                <p className="text-gray-500">Loading...</p>
            </main>
        )
    }

    return (
        <main className="max-w-400 mx-auto px-6 pb-6">
            <h1 className="my-6 text-2xl">My reservations</h1>

            {reservations.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-4xl mb-4"></p>
                    <h2 className="text-xl font-bold mb-2">No reservations yet</h2>
                    <p className="text-gray-500 mb-6">
                        You haven't made any reservations yet. Start exploring properties!
                    </p>
                    <Link
                        href="/"
                        className="py-4 px-6 bg-stayfinder text-white rounded-xl inline-block hover:bg-stayfinder-dark"
                    >
                        Explore properties
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {reservations.map((reservation: any) => (
                        <div
                            key={reservation.id}
                            className="p-5 flex flex-row gap-4 shadow-md border border-gray-300 rounded-xl"
                        >
                            <div className="w-1/4 shrink-0">
                                <div className="relative overflow-hidden aspect-square rounded-xl">
                                    <Image
                                        fill
                                        src={reservation.property.image_url}
                                        className="hover:scale-110 object-cover transition h-full w-full"
                                        alt={reservation.property.title}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h2 className="mb-4 text-xl">{reservation.property.title}</h2>
                                    <p className="mb-2">
                                        <strong>Check in date: </strong>{reservation.start_date}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Check out date: </strong>{reservation.end_date}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Number of nights: </strong>{reservation.number_of_nights}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Total price: </strong>${reservation.total_price}
                                    </p>
                                </div>

                                <div className="mt-6 flex gap-3 flex-wrap">
                                    <Link
                                        href={`/properties/${reservation.property.id}`}
                                        className="cursor-pointer py-4 px-6 bg-stayfinder text-white rounded-xl hover:bg-stayfinder-dark"
                                    >
                                        Go to property
                                    </Link>
                                    <button
                                        onClick={() => cancelReservation(reservation.id)}
                                        className="cursor-pointer py-4 px-6 bg-white border border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition"
                                    >
                                        Cancel reservation
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}

export default MyReservationsPage