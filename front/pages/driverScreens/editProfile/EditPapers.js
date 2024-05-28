import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, TextInput } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageInput from "../../../components/ImageInput";

const fields = [
    'front of DNI', 'back of DNI', 'registration'
];

export function EditPapers(patente) {
    //const userToken  = AsyncStorage.getItem("userToken"); // agarro el token del authContext (si esta loggineado, lo va a tener)

    const [inputs, setInputs] = useState({
        userID: '',
        registration: null,
        dniFront: null,
        dniBack: null,
    });
    const [canFetchProfile, setCanFetchProfile] = useState(false);

    // This effect runs once and fetches the token and user ID
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
                    setInputs(prevInputs => ({
                        ...prevInputs,
                        userID: data.userId,
                    }));
                    setCanFetchProfile(true); // Enable fetching more details
                } else {
                    console.error('Token validation failed:', data.message);
                    setCanFetchProfile(false);
                }
            }
        }
        loadUserProfile().then(r => console.log(r));
    }, []);
    // This effect runs only when canFetchProfile is set to true
    useEffect(() => {
        if (canFetchProfile) {
            async function fetchGetImages() {
                try {
                    const response = await fetch(`http://localhost:9002/getImages`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: inputs.userID,
                            patente: patente
                        })
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setInputs(prevInputs => ({
                            ...prevInputs,
                            dniBack: data.dniBack,
                            dniFront: data.dniFront,
                            registration: data.registration
                        }))
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
            fetchGetImages()
        }
    }, [canFetchProfile, inputs.userID]); // Depend on canFetchProfile

    const handleInputChange = (field, value) => {
        setInputs(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Edit Car Papers</Text>
                    <View style={styles.column}>
                        {fields.map((field, index) => (
                            <View key={index} style={styles.inputContainer}>
                                <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                                <View style={styles.inputRow}>
                                    <ImageInput patente={patente.route.params.patente} userId={inputs.userID} field={field} onChange={(image) => handleInputChange(field, image) }/>
                                </View>
                            </View>
                        ))}
                    </View>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    columnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    column: {
        flexDirection: 'column',
        width: '50%',
        padding: 25,
    },
    scrollContainer: {
        alignItems: 'center',
    },
    label: {
        alignSelf: 'flex-start',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 2,
    },
    inputContainer: {
        flexDirection: 'column',
        width: '25%',
        alignItems: 'center',
    },
    inputRow: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        color: '#FFFFFF80',
        borderColor: 'gray',
        borderWidth: 1,
        marginRight: 10,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputImage: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginRight: 10,
        paddingHorizontal: 10,
        width: 50,
    }
});


