'use client';

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
    mainImage: string;
    images: { id: string; image_url: string; order: number }[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ mainImage, images }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [showAll, setShowAll] = useState(false);

    const allImages = [
        { id: 'main', image_url: mainImage, order: -1 },
        ...images.map(img => ({ id: img.id, image_url: img.image_url, order: img.order }))
    ];

    return (
        <>
            {/* Main image + grid */}
            <div className="w-full h-[64vh] mb-4 overflow-hidden rounded-xl relative cursor-pointer"
                onClick={() => setShowAll(true)}
            >
                <Image
                    fill
                    src={allImages[activeIndex].image_url}
                    className="object-cover w-full h-full"
                    alt="Property"
                />

                {/* Thumbnail strip */}
                {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {allImages.map((img, index) => (
                            <button
                                key={img.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveIndex(index);
                                }}
                                className={`w-2.5 h-2.5 rounded-full transition ${
                                    index === activeIndex ? 'bg-white' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* Prev/Next arrows */}
                {allImages.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1);
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Show all button */}
                {allImages.length > 1 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowAll(true);
                        }}
                        className="absolute bottom-4 right-4 bg-white text-black text-sm font-semibold px-4 py-2 rounded-xl shadow hover:bg-gray-100 transition"
                    >
                        Show all {allImages.length} photos
                    </button>
                )}
            </div>

            {/* Fullscreen modal */}
            {showAll && (
                <div className="fixed inset-0 bg-black z-50 flex flex-col">
                    <div className="flex justify-between items-center p-4">
                        <button
                            onClick={() => setShowAll(false)}
                            className="text-white hover:text-gray-300 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <p className="text-white text-sm">{activeIndex + 1} / {allImages.length}</p>
                    </div>

                    <div className="flex-1 relative">
                        <Image
                            fill
                            src={allImages[activeIndex].image_url}
                            alt="Property"
                            className="object-contain"
                        />
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={() => setActiveIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setActiveIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail strip */}
                    <div className="flex gap-2 p-4 overflow-x-auto">
                        {allImages.map((img, index) => (
                            <button
                                key={img.id}
                                onClick={() => setActiveIndex(index)}
                                className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                                    index === activeIndex ? 'border-white' : 'border-transparent opacity-60'
                                }`}
                            >
                                <Image fill src={img.image_url} alt="" className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageGallery;