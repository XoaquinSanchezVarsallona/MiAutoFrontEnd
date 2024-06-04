import React, {useEffect} from "react";
import {ImageBackground, Image, ScrollView, StyleSheet, Text, View, Button, WebView, Linking} from "react-native";


export function DisplayPapers({ route }) {
    const { username, patente } = route.params;
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

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <ScrollView style={styles.container}>
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
                        </>
                    ) : (
                        <Text style={styles.confirmText}>No esta disponible la imagen de la cedula azul.</Text>
                    )}
                </View>
            </ScrollView>
        </ImageBackground>
);
        }

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        paddingBottom: 40,
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
    imageContainer: {
        width: 300,
        height: 200,
        resizeMode: 'contain',
        marginVertical: 10,
        alignSelf: 'center',
    }
});