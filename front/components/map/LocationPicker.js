// src/components/LocationPicker.js
import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
    height: '500px',
    width: '100%'
};

const defaultCenter = {
    lat: -34.6037, // Coordenadas de ejemplo (Buenos Aires)
    lng: -58.3816
};

const LocationPicker = ({ onLocationSelect }) => {
    const [location, setLocation] = useState(defaultCenter);
    const [markerPosition, setMarkerPosition] = useState(null);
    const autocompleteRef = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        const input = document.getElementById('autocomplete');
        const autocomplete = new window.google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const newLocation = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                setLocation(newLocation);
                setMarkerPosition(newLocation);
                mapRef.current.panTo(newLocation);
                onLocationSelect(newLocation.lat, newLocation.lng);
            }
        });
        autocompleteRef.current = autocomplete;
    }, []);

    const handleMapClick = (event) => {
        const newLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        setMarkerPosition(newLocation);
        onLocationSelect(newLocation.lat, newLocation.lng);
    };

    return (
        <div>
            <input
                id="autocomplete"
                type="text"
                placeholder="Busca una ubicación"
                style={{ marginBottom: '10px', width: '100%', padding: '10px' }}
            />
            <LoadScript googleMapsApiKey="AIzaSyAcFW_irUNVIJSuCV3_2ddMjtB1WpfoEeQ" libraries={['places']}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={12}
                    center={location}
                    onClick={handleMapClick}
                    onLoad={map => mapRef.current = map}
                >
                    {markerPosition && (
                        <Marker
                            position={markerPosition}
                            draggable={true}
                            onDragEnd={handleMapClick}
                        />
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default LocationPicker;
