import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, ImageBackground, Button, Pressable, Image} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NotificationContext} from "../../../components/notification/NotificationContext";
import AddButton from "../../../components/AddButton";

export function AccidentInformation({navigation, route}) {
    const {patente} = route.params;
    const [userId, setUserId] = React.useState('');
    const [username, setUsername] = React.useState('');
    const {showNotification, setColor} = useContext(NotificationContext);
    const [canFetchProfile, setCanFetchProfile] = useState(false);
    const [frontDNI, setFront] = React.useState('');
    const [backDNI, setBack] = React.useState('');
    const [cedula, setCedula] = React.useState('');

    useEffect(() => {
        async function loadUserProfile() {
            const token = await AsyncStorage.getItem('userToken');
            console.log("Antes...")
            if (token) {
                const response = await fetch('http://localhost:9002/validateToken', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log("Paso!!")
                const data = await response.json();
                if (response.ok) {
                    setUserId(data.userId)
                    setUsername(data.username)

                    console.log("UserID: " + data.userId)
                    console.log("Username: " + data.username)
                    setCanFetchProfile(true); // Enable fetching more details
                } else {
                    console.error('Token validation failed:', data.message);
                    setCanFetchProfile(false);
                }
            }
        }

        loadUserProfile().then(r => console.log(r));
    }, []);

    useEffect(() => {
        const getPapers = async () => {
            try {
                const response = await fetch(`http://localhost:9002/displayPapers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        patente: patente
                    })
                })
                if (response.ok) {
                    const data = await response.json();
                    console.log("The response was: " + data)
                    setFront(data.dniFront)
                    setBack(data.dniBack)
                    setCedula(data.registration)
                    console.log('Registration was delivered successfully!')
                } else {
                    console.log('There was a problem in display of papers, but no error.')
                }
            } catch (e) {
                console.log("An error occurred displaying papers: " + e.message)
            }
        }
        getPapers().then()
        setCanFetchProfile(false)
    }, [canFetchProfile, userId]);

    const handleDownloadImage = async (base64Image) => {
        try {
            const url = 'data:image/png;base64,' + base64Image;
            const fileName = 'image.jpg';
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = fileName;
            downloadLink.click();
        } catch (e) {
            console.log("The handleDownload: " + e.message)
        }
    };

    const sendAlert = async () => {
        try {
            const response = await fetch(`http://localhost:9002/alertas/alertAccident/${username}/${patente}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setColor('#32cd32')
                showNotification('Alert send successfully');
            } else {
                setColor('red')
                showNotification('Failed to send alert');
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <Text style={styles.title}>Accident Information</Text>
            <View style={styles.imagesDisplay}>
                <View style={styles.imageSection}>
                    <Text style={styles.subTitle}>Front DNI</Text>
                    {frontDNI ? (
                        <>
                            <Image source={{uri: `data:image/jpeg;base64,${frontDNI}`}} style={styles.imageContainer}/>
                            <AddButton color={'#1e90ff'} onPress={() => handleDownloadImage(frontDNI)}
                                       text={'Download'}/>
                        </>
                    ) : (
                        <Text style={styles.notProvidedText}>No esta disponible la imagen de la cara del dni.</Text>
                    )}
                </View>
                <View style={styles.imageSection}>
                    <Text style={styles.subTitle}>Back DNI</Text>
                    {backDNI ? (
                        <>
                            <Image source={{uri: `data:image/jpeg;base64,${backDNI}`}} style={styles.imageContainer}/>
                            <AddButton color={'#1e90ff'} onPress={() => handleDownloadImage(backDNI)}
                                       text={'Download'}/>
                        </>
                    ) : (
                        <Text style={styles.notProvidedText}>No esta disponible la imagen de la contracara del
                            dni.</Text>
                    )}
                </View>
                <View style={styles.imageSection}>
                    <Text style={styles.subTitle}>Registration</Text>
                    {cedula ? (
                        <>
                            <Image source={{uri: `data:image/jpeg;base64,${cedula}`}} style={styles.imageContainer}/>
                            <AddButton color={'#1e90ff'} onPress={() => handleDownloadImage(cedula)} text={'Download'}/>
                        </>
                    ) : (
                        <Text style={styles.notProvidedText}>No esta disponible la imagen de la cedula azul.</Text>
                    )}
                </View>
            </View>
            <View style={styles.row}>
                <AddButton onPress={() => {
                    navigation.navigate('EditPapers', {patente: patente})
                }} text={'Change Images'}/>
                <AddButton color={'red'} onPress={() => {
                    sendAlert().then()
                }} text={'Confirm Accident'}/>
            </View>
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        width: '100%',
    },
    imagesDisplay: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        flex: 2,
        paddingHorizontal: 20,
    },
    imageSection: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        paddingBottom: 20,
    },
    subTitle: {
        fontSize: 25,
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    notProvidedText: {
        fontSize: 11,
        color: 'white',
        alignSelf: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20,
    },
    imageContainer: {
        width: 300,
        height: 200,
        marginTop: 20,
    },
});

export default AccidentInformation;