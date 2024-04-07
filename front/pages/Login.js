import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';

export function Login({navigation, route}) {
    const {userType} = route.params;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Función que se ejecuta cuando se presiona el botón de "Log In"
    const handleLogin = () => {
        console.log("Intento de inicio de sesión con:", email, password);
        // Llamo a la función que verifica el inicio de sesión
        // passwordValidation(email, password);
    };
    return (
        <View style={styles.container}>
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
            {/*ACA IRIA FUNCIÓN QUE LOGINEE AL USUARIO EN LA BDD HSQLDB*/}
            <Pressable style={styles.button} onPress={() => navigation.navigate('Login', { userType })}>
                <Text style={styles.buttonText}>Log In</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => navigation.navigate('Register', { userType })}>
                <Text style={styles.buttonText}>Register</Text>
            </Pressable>
        </View>
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
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
    },
    button: {
        width: '100%',
        backgroundColor: '#507cca',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
    },
});