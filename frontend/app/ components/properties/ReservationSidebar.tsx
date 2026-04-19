
const ReservationSidebar = () => {
  return (
    <aside className="mt-8 p-6 col-span-2 rounded-xl border border-gray-300 shadow-xl">
      <h2 className="mb-5 text-2xl">$150 per night</h2>

      <div className="mb-6 p-3 border border-gray-400 rounded-xl">
        <label className="mb-2 block font-bold text-xs">Guests</label>
        <select className="w-full -ml-1 text-xm">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
        </select>
      </div>

      <div className="w-full mb-6 py-4 text-center text-white font-semibold text-xl bg-stayfinder hover:bg-stayfinder-dark rounded-4xl cursor-pointer">Book</div>

      <div className="mb-4 flex justify-between align-center">
        <p>$150 * 4 nights</p>
        <p>$600</p>
      </div>

      <div className="mb-4 flex justify-between align-center">
        <p>Stayfinder fee</p>
        <p>$60</p>
      </div>

      <hr className="opacity-20" />

      <div className="mt-4 flex justify-between align-center font-bold">
        <p>Total</p>
        <p>$60</p>
      </div>
    </aside>
  )
}

export default ReservationSidebar
