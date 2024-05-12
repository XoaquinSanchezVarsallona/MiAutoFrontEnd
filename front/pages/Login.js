import React, {useContext, useState, useEffect } from 'react';
import {TextInput, Text, StyleSheet, Pressable, ImageBackground, View} from 'react-native';
import {AuthContext} from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function Login({navigation, route}) {
    const {userType} = route.params;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn, userToken } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const inputStyleEmail = email.length > 0 ? styles.inputNormal : styles.inputItalic;
    const inputStylePassword = password.length > 0 ? styles.inputNormal : styles.inputItalic;

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
                //'token': localStorage.getItem('userToken'),
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
            <Text style={styles.title}>Login</Text>
            <View style={styles.container}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={inputStyleEmail}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#FFFFFF80"
                />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={inputStylePassword}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#FFFFFF80"
                />
            </View>
            <View style={styles.errorContainer}>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : <Text style={styles.errorText}></Text>}
            </View>
            {/*Función que hace login del usuario en la bd*/}
            <View style={styles.buttonContainer}>
                <Pressable
                    style={[styles.button, isHovered ? styles.buttonHover : null]}
                    onPress={handleLogin}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Text style={[styles.buttonText, isHovered ? styles.textHover : null]}>Log In</Text>
                </Pressable>
            </View>
            <View style={{ flexDirection: 'row', paddingBottom: 30 }}>
                <Text style={styles.littletext}>Don't have an account? </Text>
                <Pressable onPress={() => navigation.navigate('Register', { userType })}>
                    <Text style={styles.linkText}>Register here</Text>
                </Pressable>
            </View>
        </ImageBackground>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    label: {
        alignSelf: 'flex-start',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        marginLeft: 2,
        padding: 2,
    },
    title: {
        fontSize: 70,
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
        color: 'blue',
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
    inputNormal: {
        width: 300,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 5,
        color: 'white',
        fontStyle: 'normal',
    },
    inputItalic: {
        width: 300,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 5,
        color: 'white',
        fontStyle: 'italic',
    }
});