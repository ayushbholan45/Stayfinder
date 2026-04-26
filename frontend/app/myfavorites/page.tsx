import PropertyList from "../ components/properties/PropertyList";
import { getUserId } from "../lib/actions";
import Link from "next/link";

const MyFavoritesPage = async () => {
    const userId = await getUserId();

    if (!userId) {
        return (
            <main className="max-w-400 mx-auto px-6 py-12">
                <p>You need to be authenticated...</p>
            </main>
        )
    }

    return (
        <main className="max-w-400 mx-auto px-6 pb-12">
            <h1 className="my-6 text-2xl">My favorites</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PropertyList
                    favorites={true}
                    emptyMessage={
                        <div className="col-span-3 text-center py-20">
                            <p className="text-4xl mb-4"></p>
                            <h2 className="text-xl font-bold mb-2">No favorites yet</h2>
                            <p className="text-gray-500 mb-6">You haven't added any properties to your favorites yet.</p>
                            <Link
                                href="/"
                                className="py-4 px-6 bg-stayfinder text-white rounded-xl inline-block"
                            >
                                Explore properties
                            </Link>
                        </div>
                    }
                />
            </div>
        </main>
    )
}

export default MyFavoritesPage;