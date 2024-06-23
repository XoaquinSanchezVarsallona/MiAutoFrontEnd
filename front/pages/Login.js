import React, {useContext, useState, useEffect } from 'react';
import {Text, StyleSheet, Pressable, ImageBackground, View} from 'react-native';
import {AuthContext} from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputText from "../components/InputText";
import CustomButton from "../components/CustomButton";
import ReturnButton from "../components/ReturnButton";

export function Login({navigation, route}) {
    const {userType} = route.params;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn, userToken } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState('');

    // Función que se ejecuta cuando se presiona el botón de "Log In"
    // Agarra el mail y password y manda un HTTP POST request al backend.
    const handleLogin = () => {
        console.log("Attempting to login with email:", email);

        const requestBody = {
            email: email,
            password: password,
            userType: userType,
        };

        fetch('http://localhost:9002/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => {
                if (!response.ok) {
                    console.log("Response not ok, throwing error.")
                    return response.text().then(text => { throw new Error(text); });
                }
                return response.json();
            })
            .then(async data => {
                if (data.token) {

                    console.log('Login successful with token:', data.token);
                    signIn(data.token);
                    console.log('Sign in complete, waiting for userToken update');

                    const expirationTime = new Date().getTime() + 2 * 60 * 60 * 1000; // 2 hours from now
                    await AsyncStorage.setItem('userToken', data.token);
                    await AsyncStorage.setItem('expirationTime', expirationTime.toString());
                    await AsyncStorage.setItem('userEmail', email);
                    await AsyncStorage.setItem('userType', userType);
                    //crea una nueva ruta que comienza en la página unlockedScreen, para que no pueda volver al login.
                    if (userType === 'driver') {
                        navigation.reset({
                            index: 0,
                            routes: [{name: 'UnlockedScreenDriver', params: {email: email}}],
                        });
                    } else if (userType === 'service') {
                        navigation.reset({
                            index: 0,
                            routes: [{name: 'UnlockedScreenService', params: {email: email}}],
                        });
                    }
                } else {
                    throw new Error('Token not found in response');
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
                setErrorMessage(error.message || 'Login error. Please try again.')
            });
    };

// useEffect to navigate after signIn
    useEffect(() => {
        console.log('Effect userToken:', userToken);
        if (userToken) {
            console.log('userToken has changed:', userToken);
            if (userType === 'driver') {
                navigation.navigate('UnlockedScreenDriver');
            } else if (userType === 'service') {
                navigation.navigate('UnlockedScreenService');
            }
        }
    }, [userToken, navigation]);

    // New useEffect added to log the current userToken state
    useEffect(() => {
        console.log('Current userToken state:', userToken);
    }, [userToken]);



    return (
        <ImageBackground source={require('../assets/BackgroundLocked.jpg')} style={styles.container}>
            <ReturnButton navigation={navigation} />
            <Text style={styles.title}>Login</Text>
            <View style={styles.inputs}>
                <InputText
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                />
                <InputText
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry={true}
                />
            </View>
            <View style={styles.errorContainer}>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : <Text style={styles.errorText}></Text>}
            </View>
            <CustomButton onPress={handleLogin} text="Log In" />
            <View style={{ flexDirection: 'row', paddingBottom: 30 }}>
                <Text style={styles.littletext}>Don't have an account? </Text>
                <Pressable onPress={() => navigation.navigate('Register', { userType })}>
                    <View>
                        <Text style={styles.linkText}>Register here</Text>
                        <View style={styles.underlineStyle} />
                    </View>
                </Pressable>
            </View>
        </ImageBackground>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    inputs: {
        width: '100%',
    },
    title: {
        fontSize: 90,
        color: 'white',
        paddingTop: 30,
    },
    littletext: {
        fontSize: 20,
        margin: 20,
        color: 'white',
    },
    input: {
        width: 300,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 5,
        color: 'white',
    },
    button: {
        width: '100%',
        borderColor: 'gray',
        borderWidth: 3,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
    },
    linkText: {
        fontSize: 20,
        margin: 20,
        color: 'lightblue',
    },
    underlineStyle: {
        borderBottomWidth: 1,
        borderBottomColor: 'lightblue',
        marginTop: -18,
        width: '77%',
        alignSelf: 'center',
    },
    errorContainer: {
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    buttonContainer: {
        marginBottom: 20,
        width: '8%',
    },
    buttonHover: {
        backgroundColor: 'rgba(128, 128, 128, 0.5)',
        borderColor: 'lightgray',
        fontWeight: 'bold',
    },
    textHover: {
        color: 'white',
        fontWeight: 'bold',
    },
});