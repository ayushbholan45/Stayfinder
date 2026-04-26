'use client';
import Image from "next/image";

import Modal from "./Modal";
import useAddPropertyModal from "@/app/hooks/useAddPropertyModal";
import CustomButtons from "../forms/CustomButtons";
import { ChangeEvent, useState } from "react";
import Categories from "../addproperty/Categories";
import SelectCountry, { SelectCountryValue } from "../forms/SelectCountry";
import apiService from "@/app/services/apiService";
import { useRouter } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const AddPropertyModal = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<string[]>([]);
    const [dataCategory, setDataCategory] = useState('');
    const [dataTitle, setDataTitle] = useState('');
    const [dataDescription, setDataDescription] = useState('');
    const [dataPrice, setDataPrice] = useState('');
    const [dataBedrooms, setDataBedrooms] = useState('');
    const [dataBathrooms, setDataBathrooms] = useState('');
    const [dataGuests, setDataGuests] = useState('');
    const [dataCountry, setDataCountry] = useState<SelectCountryValue>();
    const [dataImage, setDataImage] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [dataImages, setDataImages] = useState<File[]>([]);

    const addPropertyModal = useAddPropertyModal();
    const router = useRouter();

    const setCategory = (category: string) => {
        setDataCategory(category);
    }

    const setImages = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const files = Array.from(event.target.files);
            setDataImages(prev => [...prev, ...files]);
            if (!dataImage) setDataImage(files[0]);
        }
    }

    const removeImage = (index: number) => {
        const updated = dataImages.filter((_, i) => i !== index);
        setDataImages(updated);
        if (index === 0) {
            setDataImage(updated[0] || null);
        }
    }

    const generateDescription = async () => {
        if (!dataTitle) return;

        setIsGenerating(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = `Write a short, attractive property description for a vacation rental listing with the following details:
            - Title: ${dataTitle}
            - Category: ${dataCategory || 'vacation rental'}
            - Price per night: $${dataPrice || 'not specified'}
            - Bedrooms: ${dataBedrooms || 'not specified'}
            - Bathrooms: ${dataBathrooms || 'not specified'}
            - Max guests: ${dataGuests || 'not specified'}
            
            Keep it to 3-4 sentences, friendly and inviting. Do not use bullet points.`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();
            setDataDescription(text);
        } catch (error) {
            console.error('Gemini error:', error);
        }

        setIsGenerating(false);
    }

    const submitForm = async () => {
        console.log('submitForm');

        if (
            dataCategory &&
            dataTitle &&
            dataDescription &&
            dataPrice &&
            dataCountry &&
            dataImage
        ) {
            const formData = new FormData();
            formData.append('category', dataCategory)
            formData.append('title', dataTitle)
            formData.append('description', dataDescription)
            formData.append('price_per_night', dataPrice)
            formData.append('bedrooms', dataBedrooms)
            formData.append('bathrooms', dataBathrooms)
            formData.append('guests', dataGuests)
            formData.append('country', dataCountry.label)
            formData.append('country_code', dataCountry.value)
            formData.append('image', dataImage)
            dataImages.forEach((img) => {
                formData.append('images', img)
            })

            const response = await apiService.post('/api/properties/create/', formData)

            if (response.success) {
                console.log('SUCCESS :)');
                router.push('/?added=true');
                addPropertyModal.close();
            } else {
                console.log('ERROR');
                const tmpErrors: string[] = Object.values(response).map((error: any) => {
                    return error;
                })
                setErrors(tmpErrors)
            }
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length > 0) {
            setDataImages(prev => [...prev, ...files]);
            if (!dataImage) setDataImage(files[0]);
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = () => {
        setIsDragging(false);
    }

    const content = (
        <>
            {/* Step 1 - Category */}
            {currentStep == 1 ? (
                <>
                    <h2 className="mb-6 text-2xl">Choose category</h2>
                    <Categories
                        dataCategory={dataCategory}
                        setCategory={(category) => setCategory(category)}
                    />
                    <CustomButtons
                        label="Next"
                        className="bg-stayfinder hover:bg-stayfinder-dark"
                        onClick={() => setCurrentStep(2)}
                    />
                </>

            /* Step 2 - Title */
            ) : currentStep == 2 ? (
                <>
                    <h2 className="mb-6 text-2xl">Title</h2>
                    <div className="pt-3 pb-6 space-y-4">
                        <div className="flex flex-col space-y-2">
                            <label>Title</label>
                            <input
                                type="text"
                                value={dataTitle}
                                onChange={(e) => setDataTitle(e.target.value)}
                                className="w-full p-4 border border-gray-600 rounded-xl"
                            />
                        </div>
                    </div>
                    <CustomButtons
                        label="Previous"
                        className="mb-2 bg-amber-600 hover:bg-amber-700"
                        onClick={() => setCurrentStep(1)}
                    />
                    <CustomButtons
                        label="Next"
                        className="bg-stayfinder hover:bg-stayfinder-dark"
                        onClick={() => setCurrentStep(3)}
                    />
                </>

            /* Step 3 - Details */
            ) : currentStep == 3 ? (
                <>
                    <h2 className="mb-6 text-2xl">Details</h2>
                    <div className="pt-3 pb-6 space-y-4">
                        <div className="flex flex-col space-y-2">
                            <label>Price per night</label>
                            <input
                                type="number"
                                value={dataPrice}
                                onChange={(e) => setDataPrice(e.target.value)}
                                className="w-full p-4 border border-gray-600 rounded-xl"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label>Bedrooms</label>
                            <input
                                type="number"
                                value={dataBedrooms}
                                onChange={(e) => setDataBedrooms(e.target.value)}
                                className="w-full p-4 border border-gray-600 rounded-xl"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label>Bathrooms</label>
                            <input
                                type="number"
                                value={dataBathrooms}
                                onChange={(e) => setDataBathrooms(e.target.value)}
                                className="w-full p-4 border border-gray-600 rounded-xl"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label>Maximum number of guests</label>
                            <input
                                type="number"
                                value={dataGuests}
                                onChange={(e) => setDataGuests(e.target.value)}
                                className="w-full p-4 border border-gray-600 rounded-xl"
                            />
                        </div>
                    </div>
                    <CustomButtons
                        label="Previous"
                        className="mb-2 bg-amber-600 hover:bg-amber-700"
                        onClick={() => setCurrentStep(2)}
                    />
                    <CustomButtons
                        label="Next"
                        className="bg-stayfinder hover:bg-stayfinder-dark"
                        onClick={() => setCurrentStep(4)}
                    />
                </>

            /* Step 4 - Description with AI */
            ) : currentStep == 4 ? (
                <>
                    <h2 className="mb-6 text-2xl">Describe your place</h2>
                    <div className="pt-3 pb-6 space-y-4">
                        <div className="flex flex-col space-y-2">
                            <label className="flex items-center justify-between">
                                <span>Description</span>
                                <button
                                    onClick={generateDescription}
                                    disabled={isGenerating}
                                    className="flex items-center gap-1.5 px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                                >
                                    {isGenerating ? (
                                        <>
                                            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Generating...
                                        </>
                                    ) : (
                                        <>✨ Generate with AI</>
                                    )}
                                </button>
                            </label>
                            <textarea
                                value={dataDescription}
                                onChange={(e) => setDataDescription(e.target.value)}
                                placeholder="Write your description or click 'Generate with AI' to auto-fill..."
                                className="w-full p-4 h-50 border border-gray-600 rounded-xl"
                            ></textarea>
                        </div>
                    </div>
                    <CustomButtons
                        label="Previous"
                        className="mb-2 bg-amber-600 hover:bg-amber-700"
                        onClick={() => setCurrentStep(3)}
                    />
                    <CustomButtons
                        label="Next"
                        className="bg-stayfinder hover:bg-stayfinder-dark"
                        onClick={() => setCurrentStep(5)}
                    />
                </>

            /* Step 5 - Location */
            ) : currentStep == 5 ? (
                <>
                    <h2 className="mb-6 text-2xl">Location</h2>
                    <div className="pt-3 pb-6 space-y-4">
                        <SelectCountry
                            value={dataCountry}
                            onChange={(value) => setDataCountry(value as SelectCountryValue)}
                        />
                    </div>
                    <CustomButtons
                        label="Previous"
                        className="mb-2 bg-amber-600 hover:bg-amber-700"
                        onClick={() => setCurrentStep(4)}
                    />
                    <CustomButtons
                        label="Next"
                        className="bg-stayfinder hover:bg-stayfinder-dark"
                        onClick={() => setCurrentStep(6)}
                    />
                </>

            /* Step 6 - Images */
            ) : (
                <>
                    <h2 className="mb-6 text-2xl">Images</h2>
                    <div className="pt-3 pb-6 space-y-4">
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="file-upload"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                className={`flex flex-col items-center justify-center gap-2.5 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors
                                    ${isDragging
                                        ? 'border-stayfinder bg-stayfinder/10'
                                        : 'border-neutral-300 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-400'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="17 8 12 3 7 8"/>
                                    <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-neutral-700">
                                        {isDragging ? 'Drop your images here' : 'Choose files'}
                                    </p>
                                    <p className="text-xs text-neutral-400 mt-1">or drag and drop here · multiple allowed</p>
                                </div>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={setImages}
                                />
                            </label>
                            <p className="text-xs text-neutral-400 text-center">PNG, JPG, WEBP up to 10MB each. First image will be the main photo.</p>
                        </div>

                        {dataImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {dataImages.map((img, index) => (
                                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200">
                                        <Image
                                            fill
                                            alt={`Image ${index + 1}`}
                                            src={URL.createObjectURL(img)}
                                            className="object-cover"
                                        />
                                        {index === 0 && (
                                            <span className="absolute top-1 left-1 bg-stayfinder text-white text-xs px-2 py-0.5 rounded-full">
                                                Main
                                            </span>
                                        )}
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow hover:bg-red-50"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {errors.map((error, index) => (
                        <div key={index} className="p-5 mb-4 bg-stayfinder text-white rounded-xl opacity-80">
                            {error}
                        </div>
                    ))}

                    <CustomButtons
                        label="Previous"
                        className="mb-2 bg-amber-600 hover:bg-amber-700"
                        onClick={() => setCurrentStep(5)}
                    />
                    <CustomButtons
                        label="Submit"
                        className="bg-stayfinder hover:bg-stayfinder-dark"
                        onClick={submitForm}
                    />
                </>
            )}
        </>
    )

    return (
        <>
            <Modal
                isOpen={addPropertyModal.isOpen}
                close={addPropertyModal.close}
                label="Add property"
                content={content}
            />
        </>
    )
}

export default AddPropertyModal