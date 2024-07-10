import React, {useEffect, useState} from 'react';
import {Modal, View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity, Image, TextInput} from 'react-native';
import InputText from "../../components/InputText";
import { Picker } from "react-native-web";
import Icon from 'react-native-vector-icons/FontAwesome';
import {haversineDistance} from "../map/haversineDistance";
import CustomScrollBar from "../CustomScrollBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StoreSelectModal({ visible, onClose, firstStores, onStoreSelect, primerTipoDeServicio, userId }) {
    const [search, setSearch] = useState('')
    const [stores, setStores] = useState(firstStores);
    const [tipoDeServicio, setServicios] = useState(primerTipoDeServicio);
    const [filteredStores, setFilteredStores] = useState(stores);
    const [inputs, setInputs] = useState({
        userID: userId,
        userEmail:'',
    })
    const [centro, setCentro] = useState(null);

    const fetchUserLocation = async (userEmail) => {
        try {
            const response = await fetch(`http://localhost:9002/user/${userEmail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log("user data:", data)
                setCentro({ lat: data.domicilioLatitude, lng: data.domicilioLongitude });
            } else {
                console.log(`Failed to fetch user location`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const fetchRating = async () => {
        try {
            const response = await fetch(`http://localhost:9002/getStoresByRating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json()
                setStores(data)
                return data
            }
            else console.log("There is a problem in fetchRating!")

        } catch (e) {
            console.log("There is a error in fetchRating: " + e.message)
        }
    }

    const sortByService = async (service, stores) => {
        if (service === "rating") {
            fetchRating().then()
        }

        if (service === 'distance' && centro) {
            let list = stores.sort((a, b) => {
                const distanceA = haversineDistance(centro, {lat: a.domicilioLatitud, lng: a.domicilioLongitud});
                const distanceB = haversineDistance(centro, {lat: b.domicilioLatitud, lng: b.domicilioLongitud});
                return distanceA - distanceB;
            }); //llega bien las coordenadas, sortea bien, printea bien, pero no se guarda bien.
            console.log("imprimo lista dado distance, antes de savear")
            console.log(list);
            setStores(list);
            setServicios(service);
            setFilteredStores(list);
            console.log("imprimo lista dado distance, despues de savear")
            console.log(stores);
        } else if (service !== 'any') {
            let list = stores.filter(store => store.tipoDeServicio === service)
            setStores(list);
            setServicios(service);
            setFilteredStores(list);
            console.log(list);
        }
    };


    const handleInputChange = (field, value) => {
        fetchRating().then(r => sortByService(field, r))
        setServicios(prevState => ({
            ...prevState,
            [field]: value
        }));
        sortByService(field).then()
    };

    const fetchStores = async () => {
        try {
            const response = await fetch(`http://localhost:9002/fetchAllStores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: 'email'}), //email doesnt matter.
            });
            if (response.ok) {
                return await response.json();
            } else {
                console.log(`Failed to fetch stores`);
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {

        const loadUserProfile = async () => {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                // Send token to your backend to validate and get user details
                const response = await fetch('http://localhost:9002/validateToken', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setInputs({
                        ...inputs,
                        userID: data.userId,
                        username: data.username,
                    });
                } else {
                    console.error('Token validation failed:', data.message);
                }
            }
        };

        loadUserProfile().then();
    }, []);

    useEffect(() => {
        console.log("tengo el user idddd" + inputs.userID)
        fetchStores()
            .then(fetchedStores => {
                console.log('Fetched stores:', fetchedStores);
                setStores(fetchedStores);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        console.log("user id before looking for email: " + inputs.userID)
        findUserEmailById().then(userEmail => {
            if (userEmail) {
                console.log("user email found" + userEmail)
                fetchUserLocation(userEmail);
            }
        });
    }, [inputs.userID]);

    function findUserEmailById() {
        return fetch(`http://localhost:9002/findUserById/${inputs.userID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.log(`Failed to fetch user with ID: ${inputs.userID}`);
                    return null;
                }
            })
            .then(data => {
                if (data) {
                    console.log("se obtuvo bien el userEmail" + data.email)
                    setInputs(prevInputs => ({
                        ...prevInputs,
                        userEmail: data.email,
                    }));
                    return data.email;
                }
            })
            .catch(error => console.error('Error:', error));
    }


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
                    <CustomScrollBar>
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
                    </CustomScrollBar>
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
        height: '70%',
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
