import { ImageBackground, Image, StyleSheet, Text, View, Modal, TextInput, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../../components/notification/NotificationContext";
import CustomScrollBar from "../../../components/CustomScrollBar";
import {Picker} from "react-native-web";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddButton from "../../../components/AddButton";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
initMercadoPago('TEST-25cf5ee8-fbe8-4fa3-b59f-bcb11680dd53', {locale: "en-US"});
import crossIcon from '../../../assets/cross.png';
import InputText from "../../../components/InputText";
import StarRating from "../../../components/StarRating";

function InteractiveStarRating({ rating, setRating }) {
    const handlePress = (value) => {
        setRating(value);
    };

    const stars = [1, 2, 3, 4, 5].map((value) => {
        let starStyle = styles.emptyStar;
        if (value <= rating / 2) {
            starStyle = styles.filledStar;
        }
        return (
            <TouchableOpacity key={value} onPress={() => handlePress(value * 2)}>
                <Text style={starStyle}>★</Text>
            </TouchableOpacity>
        );
    });

    return (
        <View style={styles.starContainer}>
            {stars}
        </View>
    );
}

export function VehicleExperiences({ route }) {
    const { vehicle, routesPassed, distance } = route.params;
    const [experiences, setExperiences] = useState([]);
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const patente = vehicle.patente;
    const [experiencesUpdated, setExperiencesUpdated] = useState(false);
    const { showNotification, setColor } = useContext(NotificationContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [preferenceId, setPreferenceId] = useState('');
    const [unitPrice, setUnitPrice] = useState(0);

    const [inputs, setInputs] = useState({
        userID: '',
        username: '',
    });

    const [storeNames, setStoreNames] = useState({});

    useEffect(() => {
        const loadUserProfile = async () => {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                // Send token to your backend to validate and get user details
                const response = await fetch('http://localhost:9002//validateToken', {
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


    const fetchExperiences = async () => {
        try {
            const response = await fetch('http://localhost:9002/getExperiences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const experiences = await response.json();
                setExperiences(experiences);
            } else {
                console.error('Failed to fetch experiences');
            }
        } catch (error) {
            console.error('Error fetching experiences:', error);
        }
    };

    const fetchStores = async () => {
        try {
            const response = await fetch(`http://localhost:9002/fetchAllStores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: route.params.email}),
            });
            if (response.ok) {
                const stores = await response.json();
                console.log(`Stores fetched:`, stores);
                setStores(stores);
                // Set the first store as the default selected store if no store is selected
                if (!selectedStore && stores.length > 0) {
                    setSelectedStore(stores[0].storeName);
                }
            } else {
                console.log(`Failed to fetch stores`);
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    useEffect(() => {
        fetchExperiences().then();
        fetchStores().then();
    }, [routesPassed, experiencesUpdated, distance]);

    useEffect(() => {
        fetchStoreNames().then();
    }, [experiences]);

    const deleteExperience = async (experienceId) => {
        try {
            const response = await fetch(`http://localhost:9002/deleteExperience/${experienceId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setColor('#ff0000');
                showNotification('Experience deleted successfully');
                setExperiencesUpdated(true);
                await fetchExperiences(); // refetch experiences
            } else if (response.status === 400) {
                const errorMessage = await response.text();
                alert(errorMessage);
            } else {
                console.error('Failed to delete experience');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmitExperience = async () => {
        try {
            console.log('Submitting experience:', rating, comment, selectedStore, vehicle.patente, inputs.userID)
            const response = await fetch('http://localhost:9002/submitExperience', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idUser: inputs.userID,
                    nameStore: selectedStore,
                    idAuto: vehicle.patente,
                    description: comment,
                    rating: rating,
                    price: unitPrice,
                }),
            });

            if (!response.ok) {
                console.error('Network response was not ok');
                setColor('red');
                showNotification('Failed to add experience');
            }

            await fetchExperiences(); // refetch experiences
        } catch (error) {
            console.error('Error submitting experience:', error);
            setColor('red');
            showNotification('Failed to add experience');
        }
    };

    const openModal = () => {
        setIsModalVisible(true);
    };

    const openPaymentModal = () => {
        setPaymentModalVisible(true)
    }

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const closePaymentModal = () => {
        setPaymentModalVisible(false)
    }

    const getStoreName = async (storeId) => {
        console.log('getStoreName called with storeId:', storeId);
        try {
            const response = await fetch(`http://localhost:9002/getStoreById`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ storeId: storeId }),
            });
            if (response.ok) {
                const storeName = await response.json();
                console.log('Matching store found:', storeName);
                return storeName;
            } else {
                console.log('Store not found');
                return 'Unknown Store';
            }
        } catch (error) {
            console.error('Error fetching store:', error);
            return 'Unknown Store';
        }
    };

    const fetchStoreNames = async () => {
        const storeNameMap = {};
        for (const experience of experiences) {
            if (!storeNames[experience.storeId]) {
                storeNameMap[experience.storeId] = await getStoreName(experience.storeId);
            }
        }
        setStoreNames(storeNameMap);
    };

    // MERCADO PAGO
    // Obtengo el Id de la preferencia
    const createPreference = async () => {
        const preference = {
            "items": [
                {
                    "title": `Experience on ${selectedStore}`,
                    "quantity": 1,
                    "currency_id": "ARS",
                    "unit_price": unitPrice,
                }
            ]
        }

        try {
            const response = await fetch(`http://localhost:9002/mercadopago/createPreference`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer TEST-7331184439919894-061911-895658e6ee20fbf990aa7b0a32d6c6ed-1068060174`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preference)
            });
            if (!response.ok) {
                console.error('Network response was not ok');
                return;
            }
            const id = await response.json();
            console.log('Preference created with id:', id.preferenceId)
            if (!id) {
                console.error("Error creating preference")
            } else { // Ensure that you're setting preferenceId to a valid string or number
                setPreferenceId(id.preferenceId || id)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handlePayment = async () => {
        if (unitPrice === 0) {
            setColor('red');
            showNotification('Please enter a price');
            return;
        } else if (comment === '') {
            setColor('red');
            showNotification('Please enter a comment');
            return;
        } else if (rating === '') {
            setColor('red');
            showNotification('Please select a rating');
            return;
        }
        handleSubmitExperience().then()
        closeModal();
        createPreference().then(() => openPaymentModal());
    }

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View>
                <Text style={styles.title}>Experiences of {vehicle.marca} {vehicle.modelo}</Text>
            </View>
            <View style={styles.scrollContainer}>
                <CustomScrollBar>
                    {experiences.length === 0 ? (
                        <Text style={styles.noExperiencesText}>No experiences yet</Text>
                    ) : (
                        <View style={styles.experiencesContainer}>
                            {experiences
                                .filter(experience => experience.patente === patente)
                                .sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))
                                .map((experience) => (
                                    <View key={experience.experienceId} style={styles.experienceCard}>
                                        <View style={styles.crossIconContainer}>
                                            <TouchableOpacity onPress={() => deleteExperience(experience.experienceId)}>
                                                <Image
                                                    source={crossIcon}
                                                    style={styles.crossIcon}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.titleCard}><Text style={styles.bold}>Store:</Text> {storeNames[experience.storeId] || 'Loading...'}</Text>
                                        <Text style={styles.experienceText}><Text style={styles.bold}>Description:</Text> {experience.description}</Text>
                                        <View style={styles.row}>
                                            <Text style={styles.experienceRowText}><Text style={styles.bold}>Date:</Text> {new Date(experience.creationDate).toLocaleDateString()}</Text>
                                            <Text style={styles.experienceRowText}><Text style={styles.bold}>Price:</Text> $ {experience.price} ARS</Text>
                                            <StarRating rating={experience.rating / 2} />
                                        </View>
                                        </View>
                                ))}
                        </View>
                    )}
                </CustomScrollBar>
            </View>
            <AddButton onPress={openModal} text={"Add Experience"}/>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.sectionTitle}>Add Experience</Text>
                        <Text style={styles.label}>Select a store</Text>
                        <Picker
                            selectedValue={selectedStore}
                            onValueChange={(itemValue) => setSelectedStore(itemValue)}
                            style={styles.picker}
                        >
                            {stores.map((store) => (
                                <Picker.Item key={store.idStore} label={store.storeName} value={store.idStore} />
                            ))}
                        </Picker>
                        <InteractiveStarRating rating={rating} setRating={setRating} />
                        <Text style={styles.label}>Comment</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Enter your comment"
                            value={comment}
                            onChangeText={setComment}
                            multiline={true}
                            numberOfLines={4}
                        />
                        <InputText
                            label="Price"
                            value={unitPrice}
                            onChangeText={(value) => {setUnitPrice(value)}}
                            placeholder={"Enter the price"}
                            backcolor={'white'}
                        />
                        <View style={styles.row}>
                            <AddButton onPress={handlePayment} text={"Continue"}/>
                            <AddButton onPress={closeModal} text={"Cancel"} color={'red'}/>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={paymentModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closePaymentModal}
            >
                <View style={styles.modalContainer}>
                    {preferenceId && <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts:{ valueProp: 'smart_option'}}} />}
                </View>
            </Modal>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        paddingTop: 30,
    },
    scrollContainer: {
        flex: 1,
        width: '60%',
        alignSelf: 'center',
        paddingHorizontal: 16,
    },
    label: {
        alignSelf: 'flex-start',
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
    },
    noExperiencesText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
    title: {
        fontSize: 40,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'rgba(30, 144, 255, 0.9)',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    textArea: {
        width: '100%',
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    submitButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 5,
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    starContainer: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 5,
    },
    filledStar: {
        color: 'gold',
        fontSize: 30,
    },
    emptyStar: {
        color: 'gray',
        fontSize: 30,
    },
    experiencesContainer: {
        alignItems: 'center',
        width: '100%',
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 10,
    },
    titleCard: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    experienceCard: {
        marginTop: 15,
        padding: 15,
        margin: 2,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        width: '100%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        position: 'relative',
    },
    crossIconContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
    },
    experienceText: {
        fontSize: 16,
        color: '#000',
        marginBottom: 5,
    },
    experienceRowText: {
        fontSize: 16,
        marginTop: 8,
        color: '#000',
    },
    deleteButton: {
        backgroundColor: '#ff0000',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    bold: {
        fontWeight: '500'
    },
    crossIcon: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: 10,
        right: 10,
    },
});
export default VehicleExperiences;