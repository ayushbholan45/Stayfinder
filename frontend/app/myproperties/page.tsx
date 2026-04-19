import PropertyList from "../ components/properties/PropertyList"


const MyReservationsPage = () => {
  return (
    <main className="max-w-400 mx-auto px-6 pb-6">
      <h1 className="my-6 text-2xl">My properties</h1>

        <div className=" grid grid-cols-1 md:grid-cols-4 gap-6">
            <PropertyList/>
        </div>
    </main>
  )
}

export default MyReservationsPage
