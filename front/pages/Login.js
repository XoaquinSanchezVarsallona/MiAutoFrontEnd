import React, {useContext, useState, useEffect } from 'react';
import {TextInput, Text, StyleSheet, Pressable, ImageBackground, View} from 'react-native';
import {AuthContext} from "./AuthContext";

export function Login({navigation, route}) {
    const {userType} = route.params;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn, userToken } = useContext(AuthContext);

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
                    return response.text().then(text => { throw new Error(text); });
                }
                return response.json();
            })
            .then(data => {
                if (data.token) {

                    console.log('Login successful with token:', data.token);
                    signIn(data.token);
                    console.log('Sign in complete, waiting for userToken update');

                    //crea una nueva ruta que comienza en la página unlockedScreen, para que no pueda volver al login.
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'UnlockedScreenDriver', params: { email: email }}],
                    });

                } else {
                    throw new Error('Token not found in response');
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
                alert('Login error: ' + error.message);
            });
    };

// useEffect to navigate after signIn
    useEffect(() => {
        console.log('Effect userToken:', userToken);
        if (userToken) {
            console.log('userToken has changed:', userToken);
            navigation.navigate('UnlockedScreenDriver');
        }
    }, [userToken, navigation]);

    // New useEffect added to log the current userToken state
    useEffect(() => {
        console.log('Current userToken state:', userToken);
    }, [userToken]);



    return (
        <ImageBackground source={require('../assets/BackgroundLocked.jpg')} style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry //se ven puntitos
                value={password}
                onChangeText={setPassword}
            />
            {/*Función que hace login del usuario en la bd*/}
            <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </Pressable>
            <View style={{ flexDirection: 'row' }}>
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
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: 'white',
    },
    littletext: {
        fontSize: 20,
        margin: 20,
        color: 'white',
    },
    input: {
        width: '25%',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        color: 'white',
    },
    button: {
        width: '10%',
        borderColor: 'gray',
        borderWidth: 3,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
    },
    linkText: {
        fontSize: 20,
        margin: 20,
        color: 'blue',
    },
});