// src/components/StoreMapModal.js
import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, Text, Pressable } from 'react-native';
import {GoogleMap, InfoWindow, LoadScript, Marker} from '@react-google-maps/api';

const mapContainerStyle = {
    height: '500px',
    width: '100%'
};

const StoreMapModal = ({ visible, onClose, navigation, stores, centro = { lat: -34.6037, lng: -58.3816 } }) => {
    const [selectedStore, setSelectedStore] = useState(null);

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
                <LoadScript googleMapsApiKey="AIzaSyAcFW_irUNVIJSuCV3_2ddMjtB1WpfoEeQ">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={12}
                        center={centro}
                    >
                        {stores.map(store => (
                            <Marker
                                key={store.id}
                                position={{ lat: store.domicilioLatitud, lng: store.domicilioLongitud }}
                                label={{
                                    fontSize: '80px',
                                }}
                                onClick={() => {
                                    onClose();
                                    navigation.navigate('VisualStoreProfile', { store: store });
                                }}
                                onMouseOver={() => setSelectedStore(store)}
                                onMouseOut={() => setSelectedStore(null)}
                            />
                        ))}
                        {selectedStore && (
                            <InfoWindow
                                position={{ lat: selectedStore.domicilioLatitud, lng: selectedStore.domicilioLongitud }}
                                onCloseClick={() => setSelectedStore(null)}
                            >
                                <View>
                                    <Text>{selectedStore.storeName}</Text>
                                </View>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </LoadScript>
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
});

export default StoreMapModal;
