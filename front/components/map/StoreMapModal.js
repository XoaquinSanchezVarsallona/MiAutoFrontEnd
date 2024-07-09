// src/components/StoreMapModal.js
import React, { useState } from 'react';
import { Modal, StyleSheet, View, Text, Pressable } from 'react-native';
import { GoogleMap, InfoWindow, Marker, useLoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
    height: '500px',
    width: '100%'
};

const libraries = ['places']; // Specify libraries needed by your application

const StoreMapModal = ({ visible, onClose, navigation, stores, centro = { lat: -34.6037, lng: -58.3816 } }) => {
    const [selectedStore, setSelectedStore] = useState(null);
    const [open, setOpen] = useState(false);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyAcFW_irUNVIJSuCV3_2ddMjtB1WpfoEeQ",
        libraries,
    });

    if (loadError) return <Text>Error loading maps</Text>;
    if (!isLoaded) return <Text>Loading Maps</Text>;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <Pressable style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={12}
                    center={centro}
                >
                    {stores.map(store => (
                        <Marker
                            key={store.id}
                            position={{ lat: store.domicilioLatitud, lng: store.domicilioLongitud }}
                            onClick={() => {
                                setSelectedStore(store);
                                setOpen(true);
                                onClose();
                                navigation.navigate('VisualStoreProfile', { store: store });
                            }}
                            onMouseOver={() => setSelectedStore(store)}
                            onMouseOut={() => setSelectedStore(null)}
                        />
                    ))}
                </GoogleMap>
                {selectedStore && (
                    <View style={styles.storeInfo}>
                        <Text style={styles.storeName}>{selectedStore.storeName}</Text>
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    storeInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
    },
    storeName: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default StoreMapModal;
