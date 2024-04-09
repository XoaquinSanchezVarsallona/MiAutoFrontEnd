import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, Alert } from 'react-native';

export function Login({navigation, route}) {
    const {userType} = route.params;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Función que se ejecuta cuando se presiona el botón de "Log In"
    // Agarra el mail y password y manda un HTTP POST request al backend.
    const handleLogin = () => {
        console.log("Attempting to login with email:", email);

        const requestBody = {
            email: email,  // Assuming you're using email and password to log in
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
                console.log(response);
                if (response.ok) {
                    console.log('Login successful');
                    navigation.navigate('UnlockedScreen');
                } else {
                    //console.log('Login failed');
                    // Show an error message to the user
                    //alert('Login failed. Please check your credentials and try again.');
                    return response.text().then(text => { throw new Error(text); });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert(error.message);
            });
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
            <Pressable style={styles.button} onPress={handleLogin}>
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






/*import {Pressable, Text, TextInput, View} from "react-native";
import {StyleSheet} from "react-native";
import touchableOpacity from "react-native-web/src/exports/TouchableOpacity";
export function Login({navigation}) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log in</Text>
            <TextInput
                style={styles.textInput}
                placeholderTextColor={'#fff'}
                placeholder={'Enter your email'}
            />
            <TextInput
                style={styles.textInput}
                placeholder={'Enter your password'}
                placeholderTextColor={'#fff'}
                secureTextEntry={true}
            />
            {/* Esto se tiene que cambiar despues para que se consiga mandar un mail, etc}
            <Text >Forgot your password?</Text>
            <Pressable
                title={"Submit"}
                style={styles.button}
                onPress={ () => {/*Se tiene que hacer la conexion a base para validar ese mail con esa contraseña}}
            >
                <Text style={styles.buttonText}>Submit</Text>
            </Pressable>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: "center",
        alignItems: "center"
    },
    textInput: {
        borderRadius: 20,
        borderBottomWidth: 2,
        width: "80%",

        borderColor: 'grey' ,
        backgroundColor: "#722471",

        padding: 10,
        marginTop: 15,

    },
    title:{
        fontSize: 30,
        fontWeight: "bold"
    },
    button: {
        alignItems: "center",
        justifyContent: "center",

        padding: 10,
        marginTop: 7 ,

        borderRadius: 20,
        backgroundColor: "#722471",
        width: "10%"
    },
    buttonText: {
        fontSize: 15,
        color: "#fff"
    }

})*/