import Image from "next/image"
import Link from "next/link";
import apiService from "../services/apiService"

const MyReservationsPage = async () => {
    let reservations: any[] = []

    try {
        const response = await apiService.get('/api/auth/myreservations/')
        console.log('RAW RESPONSE:', JSON.stringify(response))

        if (Array.isArray(response)) {
            reservations = response
        } else if (Array.isArray(response.reservations)) {
            reservations = response.reservations
        } else if (Array.isArray(response.data)) {
            reservations = response.data
        }
        // if response is an error object like {"detail": "..."}, reservations stays []
    } catch (error) {
        console.error('API ERROR:', error)
    }

    return (
        <main className="max-w-400 mx-auto px-6 pb-6">
            <h1 className="my-6 text-2xl">My reservations</h1>

            {reservations.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-4xl mb-4"></p>
                    <h2 className="text-xl font-bold mb-2">No reservations yet</h2>
                    <p className="text-gray-500 mb-6">You haven't made any reservations yet. Start exploring properties!</p>
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
                        <div key={reservation.id} className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-md border border-gray-300 rounded-xl">
                            <div className="col-span-1">
                                <div className="relative overflow-hidden aspect-square rounded-xl">
                                    <Image
                                        fill
                                        src={reservation.property.image_url}
                                        className="hover:scale-110 object-cover transition h-full w-full"
                                        alt="Beach House"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-3">
                                <h2 className="mb-4 text-xl">{reservation.property.title}</h2>
                                <p className="mb-2"><strong>Check in date: </strong>{reservation.start_date}</p>
                                <p className="mb-2"><strong>Check out date: </strong>{reservation.end_date}</p>
                                <p className="mb-2"><strong>Number of nights: </strong>{reservation.number_of_nights}</p>
                                <p className="mb-2"><strong>Total price: </strong>${reservation.total_price}</p>

                                <Link
                                    href={`/properties/${reservation.property.id}`}
                                    className="mt-6 inline-block cursor-pointer py-4 px-6 bg-stayfinder text-white rounded-xl hover:bg-stayfinder-dark"
                                >
                                    Go to property
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}

export default MyReservationsPage