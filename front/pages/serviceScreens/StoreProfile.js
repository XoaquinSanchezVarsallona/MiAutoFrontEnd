import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, TextInput} from 'react-native';

export function StoreProfile({ navigation, route }) {
    const { store } = route.params;

    const [notificationDescription, setNotificationDescription] = useState(''); //notificación actual recien agregada
    const [notifications, setNotifications] = useState([]); //lista de notificaciones q se muestran

    const deleteStore = async () => {
        try {
            const response = await fetch(`http://localhost:9002/store/${store.storeEmail}/deleteStore`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Store deleted successfully');
                navigation.goBack();
            } else {
                console.error('Failed to delete store');
            }
        } catch (error) {
            console.error('Error:', error);
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
                alert('No users to notify');
                return;
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setNotificationDescription('');
            await fetchNotifications();

        } catch (error) {
            console.error('Error submitting notification:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{store.storeName}</Text>
                <Text style={styles.detail}>Store Email: {store.storeEmail}</Text>
                <Text style={styles.detail}>Store Address: {store.domicilio}</Text>
                <Text style={styles.detail}>Store Service type: {store.tipoDeServicio}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.deleteButton} onPress={deleteStore}>
                        <Text style={styles.buttonText}>Delete Store</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modifyButton} onPress={() => { navigation.navigate("EditVisualStoreProfile", {email : store.storeEmail} ) }}>
                        <Text style={styles.buttonText}>Modify Store Details</Text>
                    </TouchableOpacity>
                </View>
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

            <ScrollView style={styles.commentsSection}>
                <Text style={styles.commentsTitle}>Notifications</Text>
                {notifications.reduce((unique, notification) => {
                    if (!unique.some(item => item.description === notification.description)) {
                        unique.push(notification);
                    }
                    return unique;
                }, []).map((notification, index) => (
                    <View key={index} style={styles.commentContainer}>
                        <Text style={styles.comment}>{notification.description}</Text>
                        <Text style={styles.creationDate}>{new Date(notification.creationDate).toLocaleDateString()}</Text>
                    </View>
                ))}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
        margin: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        width: '80%',
        alignSelf: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        width: '45%',
    },
    modifyButton: {
        backgroundColor: 'orange',
        padding: 10,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        width: '45%',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
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
        width: '80%',
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
        borderRadius: 5,
        marginBottom: 10,
    },
    comment: {
        fontSize: 14,
        color: 'white',
    },
    creationDate: {
        fontSize: 12,
        color: 'white',
        textAlign: 'right',
    },
});

export default StoreProfile;