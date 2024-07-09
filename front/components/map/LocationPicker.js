import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const mapContainerStyle = {
    height: '500px',
    width: '100%'
};

const LocationPicker = ({ onLocationSelect, defaultCenter = {lat: -34.6037, lng: -58.3816} }) => {
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);
    const [autocomplete, setAutocomplete] = useState(null);
    const mapRef = useRef(null);

    const handleMapClick = (event) => {
        const newLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        setMarkerPosition(newLocation);
        onLocationSelect(newLocation.lat, newLocation.lng);
    };

    const handlePlaceChanged = () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            const newLocation = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            setMarkerPosition(newLocation);
            mapRef.current.panTo(newLocation);
            onLocationSelect(newLocation.lat, newLocation.lng);
        }
    };

    return (
        <LoadScript googleMapsApiKey="AIzaSyAcFW_irUNVIJSuCV3_2ddMjtB1WpfoEeQ" libraries={['places']}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={12}
                center={defaultCenter}
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
            <Autocomplete
                onLoad={autocomplete => setAutocomplete(autocomplete)}
                onPlaceChanged={handlePlaceChanged}
            >
                <input
                    type="text"
                    placeholder="Busca una ubicación"
                    style={{ flex: 'start', width: '98%', marginTop: '10px', padding: '10px', alignItems: 'center'}}
                />
            </Autocomplete>
        </LoadScript>
    );
};

export default LocationPicker;
