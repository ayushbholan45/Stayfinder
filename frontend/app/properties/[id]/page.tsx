import Image from "next/image"
import ReservationSidebar from "@/app/ components/properties/ReservationSidebar"
import apiService from "@/app/services/apiService"
import { getUserId } from "@/app/lib/actions"
import Link from "next/link"
import Reviews from "@/app/ components/properties/Reviews"

const PropertyDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const property = await apiService.get(`/api/properties/${id}`)
    const userId = await getUserId();

    let existingReservation = null;
    if (userId) {
        try {
            const reservations = await apiService.get('/api/auth/myreservations/');
            const list = Array.isArray(reservations) ? reservations
                : Array.isArray(reservations.reservations) ? reservations.reservations
                : Array.isArray(reservations.data) ? reservations.data : [];
            existingReservation = list.find((r: any) => r.property.id === id) || null;
        } catch {}
    }

    return (
        <main className="max-w-6xl mx-auto px-6 pb-6">
            <div className="w-full h-[64vh] mb-4 overflow-hidden rounded-xl relative">
                <Image fill src={property.image_url} className="object-cover w-full h-full" alt="Beach house" />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                <div className="py-6 pr-6 col-span-3">
                    <h1 className="mb-4 text-4xl">{property.title}</h1>
                    <span className="mb-6 block text-lg text-gray-600">
                        {property.guests} guests - {property.bedrooms} bedrooms - {property.bathrooms} bathrooms
                    </span>

                    <hr className="opacity-20" />

                    <Link
                        href={`/landlords/${property.landlord.id}`}
                        className="py-6 flex items-center space-x-4">
                        {property.landlord.avatar_url && (
                            <Image
                                src={property.landlord.avatar_url}
                                width={50}
                                height={50}
                                className="rounded-full w-12.5 h-12.5 object-cover"
                                alt="The user name"
                            />
                        )}
                        <p><strong>{property.landlord.name}</strong> is your host</p>
                    </Link>

                    <hr className="opacity-20" />

                    <p className="mt-6 text-lg">{property.description}</p>

                    <Reviews propertyId={id} userId={userId} />
                </div>

                <div className="col-span-2">
                    <div className="sticky top-36">
                        <ReservationSidebar
                            property={property}
                            userId={userId}
                            existingReservation={existingReservation}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default PropertyDetailPage