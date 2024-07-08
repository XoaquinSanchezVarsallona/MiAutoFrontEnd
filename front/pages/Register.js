import {ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {useContext, useState} from "react";
import {NotificationContext} from "../components/notification/NotificationContext";
import ReturnButton from "../components/ReturnButton";
import CustomButton from "../components/CustomButton";
import InputText from "../components/InputText";
import LocationPicker from "../components/map/LocationPicker";


export function Register( {navigation, route}) {
    // Declaro las variables que voy a pedir luego para registrar al usuario.
    const { userType } = route.params;
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [latitud, setLatitud] = useState(null);
    const [longitud, setLongitud] = useState(null);
    const { showNotification, setColor } = useContext(NotificationContext);


    const handleRegister = () => {
        setColor('red')
        if (!email.includes('@')) {
            showNotification('Please enter a valid email address.');
            return;
        }
        if (password.length < 8) {
            showNotification('Password must be at least 8 characters.');
            return;
        }
        if (userType === 'driver' && (username === '' || name === '' || surname === '')) {
            showNotification('Please fill in all fields.');
            return;
        }
        if (userType === 'driver' && (latitud === null || longitud === null)) {
            showNotification('Please pick your address.');
            return;
        }
        if (userType === 'service' && serviceName === '') {
            showNotification('Please fill in all fields.');
            return;
        }

        console.log("Attempting to register:", email, password);

        // Dependiendo del userType, se guarda info distinta
        const requestBody = userType === 'driver' ? {
            username: username,
            email: email,
            name: name,
            surname: surname,
            password: password,
            latitud: latitud,
            longitud: longitud,
            usertype: userType,
        } : {
            username: serviceName,
            email: email,
            name: "",
            surname: "",
            password: password,
            latitud: 0,
            longitud:0,
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
                    setColor('#32cd32');
                    showNotification('Registration successful');

                    if (userType === 'driver') {
                        navigation.navigate('Login', { userType });
                    } else if (userType === 'service') {
                        navigation.navigate('Login', { userType });
                    }

                } else { // Si falla, se muestra un mensaje de error
                    console.log(response.text().then(text => { throw new Error(text); }));
                    setColor('red');
                    showNotification('Registration failed')
                }
            })
            .catch((error) => {
                console.error('Caught error:', error);
                setColor('red');
                showNotification('Registration failed');
            });
    };

    const handleLocationSelect = (lat, lng) => {
        setLatitud(lat);
        setLongitud(lng);
    };


    // Dependiendo si es driver o service, solicito información distinta.
    return (
        <ImageBackground source={require('../assets/BackgroundLocked.jpg')} style={styles.container}>
            <ReturnButton navigation={navigation} />
            <Text style={styles.title}>Register as {userType}</Text>
            <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollview}>
                {userType === 'driver' && (
                    <>
                        <InputText
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            label={"Username"}
                        />
                        <InputText
                            placeholder={"Name"}
                            value={name}
                            onChangeText={setName}
                            label={"Name"}
                        />
                        <InputText
                            placeholder="Surname"
                            value={surname}
                            onChangeText={setSurname}
                            label={"Surname"}
                        />
                        <InputText
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            label={"Email"}
                        />
                        <InputText
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            label={"Password"}
                        />
                        <View style={styles.mapContainer}>
                            <Text style={styles.mapLabel}>Select Your Location</Text>
                            <LocationPicker onLocationSelect={handleLocationSelect} />
                        </View>
                    </>
                )}

                {userType === 'service' && (
                    <>
                        <InputText
                            placeholder="Service Name"
                            value={serviceName}
                            onChangeText={setServiceName}
                            label={"Service Name"}
                        />
                        <InputText
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            label={"Email"}
                        />
                        <InputText
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            label={"Password"}
                        />
                    </>
                )}
            </ScrollView>
            <CustomButton onPress={handleRegister} text="Register" />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 70,
        color: 'white',
        paddingTop: 30,
    },
    inputs: {
        width: '100%'
    },
    scrollContent: {
        alignItems: 'center',
        width: '100%',
        paddingBottom: 20,
    },
    mapContainer: {
        width: '100%',
        height: 400,
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    mapLabel: {
        fontSize: 18,
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    scrollview: {
        width: '90%',
    },
});