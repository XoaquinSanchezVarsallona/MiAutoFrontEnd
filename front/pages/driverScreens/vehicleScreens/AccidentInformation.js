import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, ImageBackground, Button, Pressable, Image} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NotificationContext} from "../../../components/notification/NotificationContext";

export function AccidentInformation({navigation, route}) {
    const { patente } = route.params;
    const [username, setUsername] = React.useState('');
    const { showNotification, setColor } = useContext(NotificationContext);

    const [frontDNI, setFront] = React.useState('');
    const [backDNI, setBack] = React.useState('');
    const [cedula, setCedula] = React.useState('');

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
                console.log("Username: " + username)
                console.log("Patente: "+ patente)
                if (response.ok) {
                    const data = await response.json();
                    console.log("The response was: " + data)
                    setFront(data.dniFront)
                    setBack(data.dniBack)
                    setCedula(data.registration)
                    console.log('Registration was delivered successfully!')
                }
                else {
                    console.log('There was a problem in display of papers, but no error.')
                }
            } catch (e) {
                console.log("An error occurred displaying papers: "+ e.message)
            }
        }
        getPapers()
    }, []);

    const handleDownloadImage = async (base64Image) => {
        try {
            const url = 'data:image/png;base64,' + base64Image;
            const fileName = 'image.jpg';
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = fileName;
            downloadLink.click();
        } catch (e) {
            console.log("The handleDownload: "+ e.message)
        }
    };
    useEffect(() => {
        async function loadUserProfile() {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                const response = await fetch('http://localhost:9002/validateToken', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setUsername(data.username);
                } else {
                    console.error('Token validation failed:', data.message);
                }
            }
        }
        loadUserProfile().then();
    }, []);

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
            <View style={styles.container}>
                <Text style={styles.title}>Accident Information</Text>
                <View>
                    {frontDNI? (
                        <>
                            <Text style={styles.confirmText}>This is the image that was made for </Text>
                            <Image source={{uri: `data:image/jpeg;base64,${frontDNI}`}} style={styles.imageContainer}/>
                            <Button onPress={() => handleDownloadImage(frontDNI)}
                                    title={'Click here to download the image'}></Button>
                        </>
                    ) : (
                        <Text style={styles.confirmText}>No esta disponible la imagen de la cara del dni.</Text>
                    )}
                </View>
                <View>
                    {backDNI? (
                        <>
                            <Text style={styles.confirmText}> Esta es la imagen que proporcionaste para la contracara del dni.</Text>
                            <Image source={{uri: `data:image/jpeg;base64,${backDNI}`}} style={styles.imageContainer}/>
                            <Button onPress={() => handleDownloadImage(backDNI)}
                                    title={'Click here to download the image'}></Button>
                        </>
                    ) : (
                        <Text style={styles.confirmText}>No esta disponible la imagen de la contracara del dni.</Text>
                    )}
                </View>
                <View>
                    {cedula? (
                        <>
                            <Text style={styles.confirmText}> Esta es la imagen que proporcionaste para la cedula azul.</Text>
                            <Image source={{uri: `data:image/jpeg;base64,${cedula}`}} style={styles.imageContainer}/>
                            <Button onPress={() => handleDownloadImage(cedula)}
                                    title={'Click here to download the image'}></Button>
                        </>
                    ) : (
                        <Text style={styles.confirmText}>No esta disponible la imagen de la cedula azul.</Text>
                    )}
                </View>
                <Button onPress={() => {navigation.navigate('EditPapers', {patente: patente})}} title={"Click here if you want to change images"}></Button>
                <Pressable style={styles.confirmButton} onPress={() => {
                    sendAlert().then()
                    //hacer esta pagina para hacer el display de las fotos.
                }}>
                    <Text style={styles.confirmText}>Confirm Accident</Text>
                </Pressable>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        paddingBottom: 20,
    },
    confirmButton: {
        width: '80%',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 10,
        backgroundColor: '#32cd32',
        borderRadius: 20,
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
    },
    confirmText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default AccidentInformation;