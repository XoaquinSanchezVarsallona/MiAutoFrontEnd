import React, {useContext, useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
    Image
} from 'react-native';
import {NotificationContext} from "../../components/notification/NotificationContext";
import StarRating from '../../components/StarRating';
import crossIcon from "../../assets/cross.png";
import TinyButton from "../../components/TinyButton";
import CustomScrollBar from "../../components/CustomScrollBar";

export function StoreProfile({ navigation, route }) {
    const { store } = route.params;

    const [notificationDescription, setNotificationDescription] = useState(''); //notificación actual recien agregada
    const [notifications, setNotifications] = useState([]); //lista de notificaciones q se muestran
    const [experiences, setExperiences] = useState([]);
    const [isExperienceModalVisible, setIsExperienceModalVisible] = useState(false);
    const [storeId, setStoreId] = useState(null);
    const { showNotification, setColor } = useContext(NotificationContext);
    const [storeData, setInputs] = useState({
        storeName: '',
        domicilio: '',
        tipoDeServicio: '',
        description: '',
        phoneNumber: '',
        webPageLink: '',
        instagramLink: '',
        googleMapsLink: '',
    });

    const [averageRating, setAverageRating] = useState(0);

    const deleteStore = async () => {
        try {
            const response = await fetch(`http://localhost:9002/store/${store.storeEmail}/deleteStore`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setColor('#32cd32')
                showNotification('Store deleted successfully');
                navigation.goBack();
            } else {
                setColor('red')
                showNotification('Failed to delete store');
            }
        } catch (error) {
            console.error('Error:', error);
            setColor('red')
            showNotification('Failed to delete store');
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`http://localhost:9002/fetchNotifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ storeEmail: store.storeEmail }),
            });
            console.log('respuesta del fetch:', response)
            const notifications = await response.json();
            setNotifications(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchExperiences = async () => {
        try {
            const response = await fetch('http://localhost:9002/getExperiences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('response is ok:', response);
                const experiences = await response.json();
                setExperiences(experiences);
            } else {
                console.error('Failed to fetch experiences');
            }
        } catch (error) {
            console.error('Error fetching experiences:', error);
        }
    };

    const handleSubmitNotification = async () => {
        try {
            const response = await fetch(`http://localhost:9002/createNotification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email : store.storeEmail,
                    description: notificationDescription }),
            });

            if (response.status === 400) {
                setColor('red')
                showNotification('No users to notify');
                return;
            }

            if (!response.ok) {
                console.error('Network response was not ok');
            }

            setNotificationDescription('');
            await fetchNotifications();

        } catch (error) {
            console.error('Error submitting notification:', error);
            setColor('red')
            showNotification('Error submitting notification');
        }
    };

    const handleDeleteNotification = async (description) => {
        try {
            const response = await fetch(`http://localhost:9002/deleteNotificationFromDescription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ storeEmail: store.storeEmail, description: description }),
            });
            if (response.ok) {
                //setNotifications(notifications.filter(notification => notification.description !== description));
                await fetchNotifications();
            } else {
                console.error('Failed to delete notification');
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const fetchStoreId = async () => {
        try {
            const response = await fetch(`http://localhost:9002/getStoreByEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ storeEmail: store.storeEmail }),
            });
            if (response.ok) {
                const storeId = await response.json();
                setStoreId(storeId);
            } else {
                console.error('Failed to fetch store details');
            }
        } catch (error) {
            console.error('Error fetching store details:', error);
        }
    };

    const fetchStoreData = async () => {
        try {
            const response = await fetch('http://localhost:9002/getVisualStoreProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: store.storeEmail,
                }),
            });

            if (response.ok) {
                console.log('Network response was ok');
            } else {
                console.log('Network response NOT was ok');
            }

            const data = await response.json();

            setInputs(prevState => ({
                ...prevState,
                storeName: data.storeName || '',
                domicilio: data.domicilio || '',
                tipoDeServicio: data.tipoDeServicio || '',
                description: data.description || '',
                phoneNumber: data.phoneNumber || '',
                webPageLink: data.webPageLink || '',
                instagramLink: data.instagramLink || '',
                googleMapsLink: data.googleMapsLink || '',
            }));

        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    const openExperienceModal = async () => {
        await fetchExperiences();
        const storeExperiences = experiences.filter(experience => experience.storeId === storeId);
        const averageRating = storeExperiences.length > 0 ? calculateAverageRating(storeExperiences) : 0;
        setExperiences(storeExperiences);
        setAverageRating(averageRating);
        setIsExperienceModalVisible(true);
    };

    const closeExperienceModal = () => {
        setIsExperienceModalVisible(false);
    };

    useEffect(() => {
        fetchStoreId().then();
        fetchStoreData().then();
        fetchNotifications().then();
        fetchExperiences().then();
    }, []);

    const calculateAverageRating = (experiences) => {
        const totalRating = experiences.reduce((sum, experience) => sum + experience.rating, 0);
        return (totalRating / experiences.length) / 2;
    };

// <TinyButton onPress={deleteStore()} color={'red'} text={'Delete Store'} />
// <TinyButton onPress={() => { navigation.navigate("EditVisualStoreProfile", {email : store.storeEmail} ) }} color={'orange'} text={'Modify Store Details'} />
// <TinyButton onPress={openExperienceModal()} color={'#0E46A3'} text={'View Experiences'} />
    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <CustomScrollBar style={styles.commentsSection}>

                <View style={styles.content}>
                    <Text style={styles.title}>{storeData.storeName}</Text>
                    <Text style={styles.detail}>Store Email: {store.storeEmail}</Text>
                    <Text style={styles.detail}>Store Service type: {storeData.tipoDeServicio}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TinyButton
                        onPress={openExperienceModal}
                        color={'#32cd32'}
                        text={'View Experiences'}
                    />
                    <TinyButton
                        onPress={() => { navigation.navigate("EditVisualStoreProfile", {email : store.storeEmail} ) }}
                        color={'#1e90ff'}
                        text={'Modify Store Details'}
                    />
                    <TinyButton
                        onPress={deleteStore}
                        color={'red'}
                        text={'Delete Store'}
                    />
                </View>

                <View style={styles.notificationSection}>
                    <Text style={styles.sectionTitle}>Publish Notification</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Enter your notification"
                        value={notificationDescription}
                        onChangeText={setNotificationDescription}
                        multiline={true}
                        numberOfLines={4}
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmitNotification}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.notificationsContainer}>
                    <Text style={styles.commentsTitle}>Notifications</Text>
                        {notifications.reduce((unique, notification) => {
                            if (!unique.some(item => item.description === notification.description)) {
                                unique.push(notification);
                            }
                            return unique;
                        }, []).sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate)).map((notification, index) => (
                            <View key={index} style={styles.commentContainer}>
                                <TouchableOpacity onPress={() => handleDeleteNotification(notification.description)}>
                                    <Image
                                        source={crossIcon}
                                        style={styles.crossIcon}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.comment}>{notification.description}</Text>
                                <Text style={styles.creationDate}>{new Date(notification.creationDate).toLocaleDateString()}</Text>
                            </View>
                        ))}
                </View>

            </CustomScrollBar>

            <Modal
                visible={isExperienceModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeExperienceModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.sectionTitle}>Experiences</Text>
                        {experiences.length === 0 ? (
                            <Text style={styles.noExperiencesText}>No experiences yet</Text>
                        ) : (
                            <>
                                <View style={styles.averageRatingContainer}>
                                    <Text style={styles.experienceText}>Overall Rating: </Text>
                                    <StarRating rating={averageRating} />
                                </View>
                                {experiences.map((experience) => (
                                    <View key={experience.experienceId} style={styles.experienceCard}>
                                        <View style={styles.experienceDetails}>
                                            <View>
                                                <Text style={styles.experienceText}>Date: {new Date(experience.creationDate).toLocaleDateString()}</Text>
                                                <Text style={styles.experienceText}>Car License Plate: {experience.patente}</Text>
                                                <Text style={styles.experienceText}>Description: {experience.description}</Text>
                                            </View>
                                            <StarRating rating={experience.rating / 2} />
                                        </View>
                                    </View>
                                ))}
                            </>
                        )}
                        <TouchableOpacity style={styles.closeButton} onPress={closeExperienceModal}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
        margin: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        width: '90%',
        alignSelf: 'center',
    },
    buttonContainer: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '90%',
        alignItems: 'center',
        alignSelf: 'center',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 5,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        width: '30%',
    },
    notificationsContainer: {
        width: '100%',
        alignSelf: 'center',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    modifyButton: {
        backgroundColor: 'orange',
        padding: 5,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        width: '30%',
    },
    viewExperiencesButton: {
        backgroundColor: 'blue',
        padding: 5,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        width: '30%',
    },
    noExperiencesText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    detail: {
        fontSize: 16,
    },
    notificationSection: {
        backgroundColor: 'rgba(30, 144, 255, 0.9)',
        padding: 20,
        borderRadius: 10,
        marginVertical: 20,
        width: '90%',
        alignSelf: 'center',
    },
    sectionTitle: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    textArea: {
        width: '100%',
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: 'white',
    },
    submitButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    commentsSection: {
        marginTop: 20,
        padding: 10,
        borderRadius: 10,
        width: '80%',
        alignSelf: 'center',
    },
    commentsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
        textAlign: 'center',
    },
    commentContainer: {
        backgroundColor: 'rgba(30, 144, 255, 0.9)',
        padding: 10,
        paddingVertical: 25,
        borderRadius: 5,
        marginBottom: 10,
        width: '80%',
    },
    comment: {
        fontSize: 14,
        color: 'white',
        width: '100%',
        alignItems: 'center',

    },
    creationDate: {
        fontSize: 12,
        color: 'white',
        position: 'absolute',
        bottom: 5,
        right: 5,
    },
    crossIcon: {
        width: 25,
        height: 25,
        position: 'absolute',
        zIndex: 9999,
        top: -13,
        right: 2,
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
    experienceCard: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',
    },
    experienceText: {
        fontSize: 16,
        color: 'black',
    },
    closeButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    experienceDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    averageRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
});

export default StoreProfile;