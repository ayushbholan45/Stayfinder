'use client';

import { useState, useEffect } from "react";
import { Range } from 'react-date-range';
import apiService from '@/app/services/apiService';
import useLoginModal from '@/app/hooks/useLoginModal';
import { differenceInDays, eachDayOfInterval, format } from "date-fns";
import DatePicker from "../forms/Calendar";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

export type Property = {
    id: string;
    guests: number;
    price_per_night: number;
}

interface ReservationSidebarProps {
    userId: string | null;
    property: Property;
}

// ✅ Stripe checkout form
interface CheckoutFormProps {
    propertyId: string;
    startDate: string;
    endDate: string;
    nights: number;
    totalPrice: number;
    guests: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
    propertyId, startDate, endDate, nights, totalPrice, guests, onSuccess, onCancel
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsLoading(true);
        setErrorMessage('');

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {},
            redirect: 'if_required'
        });

        if (error) {
            setErrorMessage(error.message || 'Payment failed');
            setIsLoading(false);
            return;
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Create reservation after payment
            const formData = new FormData();
            formData.append('guests', guests);
            formData.append('start_date', startDate);
            formData.append('end_date', endDate);
            formData.append('number_of_nights', nights.toString());
            formData.append('total_price', totalPrice.toString());

            const response = await apiService.post(`/api/properties/${propertyId}/book/`, formData);

            if (response.success) {
                onSuccess();
            }
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <PaymentElement />
            {errorMessage && (
                <p className="mt-2 text-red-500 text-sm">{errorMessage}</p>
            )}
            <div className="mt-4 flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full py-3 text-center border border-gray-300 rounded-xl font-semibold"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading || !stripe}
                    className="w-full py-3 text-center text-white font-semibold bg-stayfinder hover:bg-stayfinder-dark rounded-xl cursor-pointer disabled:opacity-50"
                >
                    {isLoading ? 'Processing...' : `Pay $${totalPrice}`}
                </button>
            </div>
            <p className="mt-3 text-xs text-gray-400 text-center">
                Test card: 4242 4242 4242 4242 | Any future date | Any CVC
            </p>
        </form>
    );
};

const ReservationSidebar: React.FC<ReservationSidebarProps> = ({ property, userId }) => {
    const loginModal = useLoginModal();

    const [fee, setFee] = useState<number>(0);
    const [nights, setNights] = useState<number>(1);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);
    const [minDate, setMinDate] = useState<Date>(new Date());
    const [bookedDates, setBookedDates] = useState<Date[]>([]);
    const [guests, setGuests] = useState<string>('1');
    const [clientSecret, setClientSecret] = useState<string>('');
    const [showPayment, setShowPayment] = useState<boolean>(false);
    const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
    const guestsRange = Array.from({ length: property.guests }, (_, index) => index + 1);

    const performBooking = async () => {
        if (userId) {
            if (dateRange.startDate && dateRange.endDate) {
                const formData = new FormData();
                formData.append('total_price', totalPrice.toString());

                const response = await apiService.post(
                    `/api/properties/${property.id}/create_payment_intent/`,
                    formData
                );

                if (response.clientSecret) {
                    setClientSecret(response.clientSecret);
                    setShowPayment(true);
                }
            }
        } else {
            loginModal.open();
        }
    };

    const _setDateRange = (selection: any) => {
        const newStartDate = new Date(selection.startDate);
        const newEndDate = new Date(selection.endDate);

        if (newEndDate <= newStartDate) {
            newEndDate.setDate(newStartDate.getDate() + 1);
        }

        setDateRange({
            ...dateRange,
            startDate: newStartDate,
            endDate: newEndDate
        });
    };

    const getReservations = async () => {
        const reservations = await apiService.get(`/api/properties/${property.id}/reservations/`);

        let dates: Date[] = [];
        reservations.forEach((reservation: any) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.start_date),
                end: new Date(reservation.end_date)
            });
            dates = [...dates, ...range];
        });

        setBookedDates(dates);
    };

    useEffect(() => {
        getReservations();

        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInDays(dateRange.endDate, dateRange.startDate);

            if (dayCount && property.price_per_night) {
                const _fee = ((dayCount * property.price_per_night) / 100) * 5;
                setFee(_fee);
                setTotalPrice((dayCount * property.price_per_night) + _fee);
                setNights(dayCount);
            } else {
                const _fee = (property.price_per_night / 100) * 5;
                setFee(_fee);
                setTotalPrice(property.price_per_night + _fee);
                setNights(1);
            }
        }
    }, [dateRange]);

    if (bookingSuccess) {
        return (
            <aside className="mt-8 p-6 col-span-2 rounded-xl border border-gray-300 shadow-xl">
                <div className="text-center py-8">
                    <p className="text-2xl mb-2"></p>
                    <h2 className="text-xl font-bold mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-500">Your reservation has been successfully created.</p>
                </div>
            </aside>
        );
    }

    return (
        <aside className="mt-8 p-6 col-span-2 rounded-xl border border-gray-300 shadow-xl">
            <h2 className="mb-5 text-2xl">${property.price_per_night} per night</h2>

            {!showPayment ? (
                <>
                    <DatePicker
                        value={dateRange}
                        bookedDates={bookedDates}
                        onChange={(value) => _setDateRange(value.selection)}
                    />

                    <div className="mb-6 p-3 border border-gray-400 rounded-xl">
                        <label className="mb-2 block font-bold text-xs">Guests</label>
                        <select
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            className="w-full -ml-1 text-xm"
                        >
                            {guestsRange.map(number => (
                                <option key={number} value={number}>{number}</option>
                            ))}
                        </select>
                    </div>

                    <div
                        onClick={performBooking}
                        className="w-full mb-6 py-4 text-center text-white font-semibold text-xl bg-stayfinder hover:bg-stayfinder-dark rounded-4xl cursor-pointer"
                    >
                        Book
                    </div>

                    <div className="mb-4 flex justify-between align-center">
                        <p>${property.price_per_night} * {nights} nights</p>
                        <p>${property.price_per_night * nights}</p>
                    </div>

                    <div className="mb-4 flex justify-between align-center">
                        <p>Stayfinder fee</p>
                        <p>${fee}</p>
                    </div>

                    <hr className="opacity-20" />

                    <div className="mt-4 flex justify-between align-center font-bold">
                        <p>Total</p>
                        <p>${totalPrice}</p>
                    </div>
                </>
            ) : (
                <>
                    <div className="mb-4 text-sm text-gray-500">
                        <p>{format(dateRange.startDate!, 'MMM dd')} → {format(dateRange.endDate!, 'MMM dd yyyy')}</p>
                        <p>{nights} nights · {guests} guest(s)</p>
                        <p className="font-bold text-black mt-1">Total: ${totalPrice}</p>
                    </div>

                    {clientSecret && (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <CheckoutForm
                                propertyId={property.id}
                                startDate={format(dateRange.startDate!, 'yyyy-MM-dd')}
                                endDate={format(dateRange.endDate!, 'yyyy-MM-dd')}
                                nights={nights}
                                totalPrice={totalPrice}
                                guests={guests}
                                onSuccess={() => {
                                    setShowPayment(false);
                                    setBookingSuccess(true);
                                }}
                                onCancel={() => setShowPayment(false)}
                            />
                        </Elements>
                    )}
                </>
            )}
        </aside>
    );
};

export default ReservationSidebar;