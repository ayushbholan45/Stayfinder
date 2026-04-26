import { getUserId } from "../lib/actions";
import PropertyList from "../ components/properties/PropertyList"
import Link from "next/link";

const MyPropertiesPage = async () => {
    const userId = await getUserId();

    if (!userId) {
        return (
            <main className="max-w-400 mx-auto px-6 py-12">
                <p>You need to be authenticated...</p>
            </main>
        )
    }

    return (
        <main className="max-w-400 mx-auto px-6 pb-6">
            <h1 className="my-6 text-2xl">My properties</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <PropertyList
                    landlord_id={userId}
                    emptyMessage={
                        <div className="col-span-4 text-center py-20">
                            <p className="text-4xl mb-4"></p>
                            <h2 className="text-xl font-bold mb-2">No properties yet</h2>
                            <p className="text-gray-500 mb-6">You haven't listed any properties yet. Start hosting today!</p>
                            <Link
                                href="/"
                                className="py-4 px-6 bg-stayfinder text-white rounded-xl inline-block"
                            >
                                Go to home
                            </Link>
                        </div>
                    }
                />
            </div>
        </main>
    )
}

export default MyPropertiesPage