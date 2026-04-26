'use client';

import { useState } from 'react';
import useSearchModal, { SearchQuery } from '../hooks/useSearchModal';
import { LayoutGrid, Waves, Building2, TreePine, Home } from 'lucide-react';

const categories = [
    { label: 'All', value: '', icon: LayoutGrid },
    { label: 'Beach', value: 'beach', icon: Waves },
    { label: 'Villas', value: 'villas', icon: Building2 },
    { label: 'Cabins', value: 'cabins', icon: TreePine },
    { label: 'Tiny homes', value: 'tiny_homes', icon: Home },
];

const Categories = () => {
    const searchModal = useSearchModal();
    const [category, setCategory] = useState('');

    const _setCategory = (_category: string) => {
        setCategory(_category);

        const query: SearchQuery = {
            country: searchModal.query.country,
            checkIn: searchModal.query.checkIn,
            checkOut: searchModal.query.checkOut,
            guests: searchModal.query.guests,
            bedrooms: searchModal.query.bedrooms,
            bathrooms: searchModal.query.bathrooms,
            category: _category
        };

        searchModal.setQuery(query);
    };

    return (
        <div className="pt-3 cursor-pointer pb-6 flex items-center space-x-8">
            {categories.map(({ label, value, icon: Icon }) => (
                <div
                    key={value}
                    onClick={() => _setCategory(value)}
                    className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${
                        category === value ? 'border-black opacity-100' : 'border-white opacity-60'
                    } hover:border-gray-200 hover:opacity-100 transition-all whitespace-nowrap`}
                >
                    <Icon size={20} strokeWidth={1.5} />
                    <span className="text-xs">{label}</span>
                </div>
            ))}
        </div>
    );
};

export default Categories;