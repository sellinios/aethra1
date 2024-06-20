import React, { useEffect, useState } from 'react';

interface Place {
    name: string;
    latitude: number;
    longitude: number;
    slug: string;
    admin_division: {
        slug: string;
        parent: {
            slug: string;
            parent: {
                slug: string;
                parent: {
                    slug: string;
                } | null;
            } | null;
        } | null;
    } | null;
    url: string | null;
}

const LocationFinder: React.FC = () => {
    const [nearestPlace, setNearestPlace] = useState<Place | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const storedLocation = localStorage.getItem('locationData');
        if (storedLocation) {
            try {
                const locationData: Place = JSON.parse(storedLocation);
                setNearestPlace(locationData);
            } catch (e) {
                console.error('Error parsing location data:', e);
            }
        }
    }, []);

    const fetchNearestPlace = async (latitude: number, longitude: number) => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const response = await fetch(`/api/en/nearest-place/?latitude=${latitude}&longitude=${longitude}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch nearest place: ${response.statusText}`);
            }
            const data: Place = await response.json();
            setNearestPlace(data);
            localStorage.setItem('locationData', JSON.stringify(data));
        } catch (error) {
            console.error('Error fetching nearest place:', error);
            setError('Failed to fetch nearest place.');
        } finally {
            setLoading(false);
        }
    };

    const handleLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    fetchNearestPlace(latitude, longitude);
                },
                error => {
                    console.error('Error getting location', error);
                    setError('Failed to get location.');
                    setLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    const formatCoordinate = (coord: number | null) => {
        return coord ? coord.toFixed(2) : '';
    };

    const getWeatherUrl = (place: Place | null) => {
        if (!place || !place.admin_division || !place.admin_division.parent || !place.admin_division.parent.parent || !place.admin_division.parent.parent.parent) {
            return '#';
        }
        const citySlug = place.slug;
        const subregionSlug = place.admin_division.slug;
        const regionSlug = place.admin_division.parent.slug;
        const countrySlug = place.admin_division.parent.parent.slug;
        const continentSlug = place.admin_division.parent.parent.parent.slug;

        return `/weather/${continentSlug}/${countrySlug}/${regionSlug}/${subregionSlug}/${citySlug}/`;
    };

    return (
        <div>
            {error && <div className="alert alert-danger">{error}</div>}
            {!nearestPlace && (
                <button onClick={handleLocation} disabled={loading}>
                    {loading ? 'Loading...' : 'Find My Nearest Place'}
                </button>
            )}
            {nearestPlace && (
                <div className="alert alert-success" role="alert">
                    <strong>Nearest Place:</strong> (Lat: {formatCoordinate(nearestPlace.latitude)}, Long: {formatCoordinate(nearestPlace.longitude)}){' '}
                    <a href={getWeatherUrl(nearestPlace)}>{nearestPlace.name}</a>
                </div>
            )}
        </div>
    );
};

export default LocationFinder;
