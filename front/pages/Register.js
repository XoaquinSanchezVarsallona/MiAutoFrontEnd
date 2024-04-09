import {ImageBackground, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {useState} from "react";

export function Register( {navigation, route}) {
    // Declaro las variables que voy a pedir luego para registrar al usuario.
    const { userType } = route.params;
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const handleRegister = () => {
        console.log("Attempting to register:", email, password);

        // Dependiendo del userType, se guarda info distinta
        const requestBody = userType === 'driver' ? {
            username: username,
            email: email,
            name: name,
            surname: surname,
            password: password,
            domicilio: domicilio,
            usertype: userType,
        } : {
            username: serviceName,
            email: email,
            name: "",
            surname: "",
            password: password,
            domicilio: "",
            usertype: userType,
        };

        fetch('http://localhost:9002/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => {
                if (response.ok) { // Si se guarda bien en la base de datos, se desbloquea la pantalla
                    console.log('Registration successful');

                    if (userType === 'driver') {
                        navigation.navigate('UnlockedScreen', { userType });
                    } else if (userType === 'service') {
                        navigation.navigate('UnlockedScreen', { userType });
                    }

                } else { // Si no se guarda bien, no se desbloquea la pantalla y se muestra un mensaje de error
                    //console.log('Registration failed');
                    // Show an error message to the user
                    //alert('Registration failed. Please try again.');
                    return response.text().then(text => { throw new Error(text); });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert(error.message);
            });
    };


    // Dependiendo si es driver o service, solicito información distinta.
    return (
        <ImageBackground source={require('../assets/BackgroundLocked.jpg')} style={styles.container}>
            <Text style={styles.title}>Register as {userType}</Text>
            {userType === 'driver' && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="userName"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Surname"
                        value={surname}
                        onChangeText={setSurname}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="address"
                        value={domicilio}
                        onChangeText={setDomicilio}
                    />
                </>
            )}

            {userType === 'service' && (
                <TextInput
                    style={styles.input}
                    placeholder="Service Name"
                    value={serviceName}
                    onChangeText={setServiceName}
                />
            )}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
            />
            {/*ACA IRIA FUNCIÓN QUE REGISTRE AL USUARIO EN BASE DE DATOS */}
            <Pressable style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </Pressable>
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
    },input: {
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
});