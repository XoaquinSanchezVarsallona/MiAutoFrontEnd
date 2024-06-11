import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, Modal, TextInput, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import RouteCard from "../../../components/RouteCard";
import { NotificationContext } from "../../../components/notification/NotificationContext";
import CustomScrollBar from "../../../components/CustomScrollBar";
import {Picker} from "react-native-web";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export function VehicleExperiences({ navigation, route }) {
    const { vehicle, familyId, routesPassed, distance, userID } = route.params;
    const [experiences, setExperiences] = useState([]);
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const patente = vehicle.patente;
    const [experiencesUpdated, setExperiencesUpdated] = useState(false);
    const { showNotification, setColor } = useContext(NotificationContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');

    const [inputs, setInputs] = useState({
        userID: '',
        username: '',
    });

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

        loadUserProfile().then(r => console.log(r));
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
            } else {
                console.log(`Failed to fetch stores`);
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    useEffect(() => {
        fetchExperiences();
        fetchStores();
    }, [routesPassed, experiencesUpdated, distance]);

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
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setColor('#32cd32');
            showNotification('Experience added successfully');

            await fetchExperiences(); // refetch experiences
            setRating('');
            setComment('');
            setIsModalVisible(false); // Close the modal after submitting
        } catch (error) {
            console.error('Error submitting experience:', error);
        }
    };

    const openModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const getStoreName = (storeId) => {
        const store = stores.find((store) => store.idStore === storeId);
        return store ? store.storeName : 'Unknown Store';
    };

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
                                        <Text style={styles.experienceText}>Date: {new Date(experience.creationDate).toLocaleDateString()}</Text>
                                        <Text style={styles.experienceText}>Description: {experience.description}</Text>
                                        <Text style={styles.experienceText}>Store: {getStoreName(experience.storeId)}</Text>
                                        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteExperience(experience.experienceId)}>
                                            <Text style={styles.deleteButtonText}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                        </View>
                    )}
                </CustomScrollBar>
            </View>
            <Pressable style={styles.addExperienceButton} onPress={openModal}>
                <Text style={styles.addExperienceText}>Add Experience</Text>
            </Pressable>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.sectionTitle}>Add Experience</Text>
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
                        <TextInput
                            style={styles.textArea}
                            placeholder="Enter your comment"
                            value={comment}
                            onChangeText={setComment}
                            multiline={true}
                            numberOfLines={4}
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitExperience}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
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
        width: '80%',
        alignSelf: 'center',
        paddingHorizontal: 16,
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
    addExperienceButton: {
        width: '50%',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 10,
        backgroundColor: '#32cd32',
        borderRadius: 20,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    addExperienceText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'rgba(30, 144, 255, 0.9)',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
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
        flexDirection: 'row',
    },
    filledStar: {
        color: 'gold',
        fontSize: 20,
    },
    emptyStar: {
        color: 'gray',
        fontSize: 20,
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
    experienceCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    experienceText: {
        fontSize: 16,
        color: '#000',
        marginBottom: 5,
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

});
export default VehicleExperiences;