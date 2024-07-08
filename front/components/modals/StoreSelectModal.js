import React, {useState} from 'react';
import {Modal, View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity, Image, TextInput} from 'react-native';
import InputText from "../../components/InputText";
import { Picker } from "react-native-web";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function StoreSelectModal({ visible, onClose, stores, onStoreSelect, tipoDeServicio, handleInputChange }) {
    const [search, setSearch] = useState('')
    console.log('Stores passed to StoreSelectModal:', stores); // Added log to check the stores

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.sectionTitle}>Select Store</Text>
                    <View style={styles.controlContainer}>
                        <TextInput
                            onChangeText={setSearch}
                            value={search}
                            placeholder={"Search for stores"}
                            placeholderTextColor='black'
                            color = 'black'
                            style={styles.inputTextholder}
                        />
                        <Image
                            style={styles.icon}
                            source={require('../../assets/lupa.png')}
                        />
                        <Picker
                            selectedValue={tipoDeServicio}
                            onValueChange={(itemValue) => handleInputChange(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Any" value="any" />
                            <Picker.Item label="Mechanic" value="mecanico" />
                            <Picker.Item label="Service Station" value="estacion de servicio" />
                            <Picker.Item label="Car Wash" value="lavadero" />
                            <Picker.Item label="Rating" value="rating" />
                            <Picker.Item label="Distance" value="distance" />
                        </Picker>
                    </View>
                    <ScrollView style={styles.storesList}>
                        {stores != null && stores.length > 0 ? (
                            stores.filter(store => store.storeName.startsWith(search)).map((store, index) => (
                                <Pressable
                                    key={index}
                                    style={styles.storeButton}
                                    onPress={() => onStoreSelect(store)}
                                >
                                    <Text style={styles.storeName}>{store.storeName}</Text>
                                </Pressable>
                            ))
                        ) : (
                            <Text style={styles.noStoresText}>No stores available</Text>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
    },
    controlContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    storesList: {
        flex: 1,
        width: '100%',
        marginTop: 10,
    },
    storeButton: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    storeName: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
    },
    noStoresText: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        marginTop: 20,
    },
    picker: {
        flex: 1,
        height: 40,
        marginRight: 10,
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
        borderColor: 'gray',
        borderRadius: 5,
        borderWidth: 1,
    },
    mapButton: {
        backgroundColor: '#1e90ff',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 10,
        marginBottom: 15,
        width: 50,
        height: 50,
    },
    inputTextholder: {
        width: '100%',
        color: 'black',
        backgroundColor: 'transparent',
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
    },
    scrollViewContent: {
        alignItems: 'center',
        paddingBottom: 20,
    }
});
