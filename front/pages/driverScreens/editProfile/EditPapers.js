import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, TextInput } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageInput from "../../../components/ImageInput";

const fields = [
    'front of DNI', 'back of DNI', 'registration'
];

export function EditPapers(patente) {

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
            fetchGetImages().then()
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
                <Text style={styles.title}>Edit Car Papers</Text>
                <View style={styles.column}>
                    {fields.map((field, index) => (
                        <View key={index} style={styles.inputContainer}>
                            <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                            <View style={styles.row}>
                                <ImageInput patente={patente.route.params.patente} userId={inputs.userID} field={field} onChange={(image) => handleInputChange(field, image) }/>
                            </View>
                        </View>
                    ))}
                </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    column: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 25,
    },
    label: {
        alignSelf: 'center',
        color: 'white',
        padding: 8,
        fontSize: 22,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'column',
        width: '45%',
        alignItems: 'center',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        paddingTop: 10,
    },
});
