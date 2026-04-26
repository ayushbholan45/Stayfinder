'use client';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyListItem from "./PropertyListItem";
import apiService from '@/app/services/apiService';
import useSearchModal from '@/app/hooks/useSearchModal';

export type PropertyType = {
    id: string;
    title: string;
    image_url: string;
    price_per_night: number;
    is_favorite: boolean;
}

interface PropertyListProps {
    landlord_id?: string | null;
    favorites?: boolean | null;
    emptyMessage?: React.ReactNode;
}

const PropertyList: React.FC<PropertyListProps> = ({
    landlord_id,
    favorites,
    emptyMessage
}) => {
    const params = useSearchParams();
    const searchModal = useSearchModal();
    const country = searchModal.query.country;
    const numGuests = searchModal.query.guests;
    const numBathrooms = searchModal.query.bathrooms;
    const numBedrooms = searchModal.query.bedrooms;
    const checkinDate = searchModal.query.checkIn;
    const checkoutDate = searchModal.query.checkOut;
    const category = searchModal.query.category;
    const [properties, setProperties] = useState<PropertyType[]>([]);

    const markFavorite = (id: string, is_favorite: boolean) => {
        const tmpProperties = properties.map((property: PropertyType) => {
            if (property.id == id) {
                property.is_favorite = is_favorite;
            }
            return property;
        });
        setProperties(tmpProperties);
    }

    const getProperties = async () => {
        let url = '/api/properties/';

        if (landlord_id) {
            url += `?landlord_id=${landlord_id}`;
        } else if (favorites) {
            url += '?is_favorites=true';
        } else {
            let urlQuery = '';

            if (country) urlQuery += '&country=' + country;
            if (numGuests) urlQuery += '&numGuests=' + numGuests;
            if (numBedrooms) urlQuery += '&numBedrooms=' + numBedrooms;
            if (numBathrooms) urlQuery += '&numBathrooms=' + numBathrooms;
            if (category) urlQuery += '&category=' + category;
            if (checkinDate) urlQuery += '&checkin=' + format(checkinDate, 'yyyy-MM-dd');
            if (checkoutDate) urlQuery += '&checkout=' + format(checkoutDate, 'yyyy-MM-dd');

            if (urlQuery.length) {
                url += '?' + urlQuery.substring(1);
            }
        }

        const tmpProperties = await apiService.get(url);

        setProperties(tmpProperties.data.map((property: PropertyType) => {
            property.is_favorite = tmpProperties.favorites.includes(property.id);
            return property;
        }));
    };

    useEffect(() => {
        getProperties();
    }, [
        landlord_id,
        favorites,
        country,
        numGuests,
        numBedrooms,
        numBathrooms,
        category,
        checkinDate?.toISOString(),
        checkoutDate?.toISOString(),
        params.toString()
    ]);

    if (properties.length === 0 && emptyMessage) {
        return <>{emptyMessage}</>;
    }

    return (
        <>
            {properties.map((property) => (
                <PropertyListItem
                    key={property.id}
                    property={property}
                    markFavorite={(is_favorite: any) => markFavorite(property.id, is_favorite)}
                />
            ))}
        </>
    );
}

export default PropertyList;