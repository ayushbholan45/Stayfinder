'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import apiService from "@/app/services/apiService";

interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    created_by: {
        id: string;
        name: string;
        avatar_url: string;
    };
}

interface ReviewsProps {
    propertyId: string;
    userId: string | null;
}

const StarRating = ({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) => {
    const [hovered, setHovered] = useState(0);

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange && onChange(star)}
                    onMouseEnter={() => onChange && setHovered(star)}
                    onMouseLeave={() => onChange && setHovered(0)}
                    className={`text-2xl ${
                        star <= (hovered || rating) ? 'text-yellow-400' : 'text-gray-300'
                    } ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

const Reviews: React.FC<ReviewsProps> = ({ propertyId, userId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const getReviews = async () => {
        const response = await apiService.get(`/api/properties/${propertyId}/reviews/`);
        setReviews(response);
    };

    useEffect(() => {
        getReviews();
    }, []);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    const handleSubmit = async () => {
        if (!rating || !comment) {
            setError('Please provide a rating and comment');
            return;
        }

        setIsSubmitting(true);
        setError('');

        const formData = new FormData();
        formData.append('rating', rating.toString());
        formData.append('comment', comment);

        const response = await apiService.post(`/api/properties/${propertyId}/reviews/add/`, formData);

        if (response.error) {
            setError(response.error);
        } else {
            setSuccess(true);
            setRating(0);
            setComment('');
            getReviews();
        }

        setIsSubmitting(false);
    };

    return (
        <div className="mt-8">
            <hr className="opacity-20 mb-8" />

            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold">Reviews</h2>
                {averageRating && (
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-xl">★</span>
                        <span className="font-bold">{averageRating}</span>
                        <span className="text-gray-500">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                    </div>
                )}
            </div>

            {/* Review Form */}
            {userId && !success && (
                <div className="mb-8 p-5 border border-gray-200 rounded-xl">
                    <h3 className="font-bold mb-3">Leave a review</h3>
                    <StarRating rating={rating} onChange={setRating} />
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience..."
                        className="mt-3 w-full p-3 border border-gray-300 rounded-xl h-28 resize-none"
                    />
                    {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="mt-3 px-6 py-2 bg-stayfinder text-white rounded-xl hover:bg-stayfinder-dark font-semibold disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit review'}
                    </button>
                </div>
            )}

            {success && (
                <div className="mb-8 p-5 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-green-700 font-semibold"> Review submitted successfully!</p>
                </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden relative flex-shrink-0">
                                {review.created_by.avatar_url ? (
                                    <Image
                                        fill
                                        src={review.created_by.avatar_url}
                                        alt={review.created_by.name}
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                        👤
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold">{review.created_by.name}</p>
                                    <StarRating rating={review.rating} />
                                </div>
                                <p className="text-gray-500 text-sm">{new Date(review.created_at).toLocaleDateString()}</p>
                                <p className="mt-2 text-gray-700">{review.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reviews;