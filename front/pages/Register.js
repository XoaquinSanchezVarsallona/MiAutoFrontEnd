import {ImageBackground, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {useContext, useState} from "react";
import {NotificationContext} from "../components/notification/NotificationContext";
import ReturnButton from "../components/ReturnButton";
import CustomButton from "../components/CustomButton";
import InputText from "../components/InputText";

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
        if (userType === 'driver' && (username === '' || name === '' || surname === '' || domicilio === '')) {
            showNotification('Please fill in all fields.');
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


    // Dependiendo si es driver o service, solicito información distinta.
    return (
        <ImageBackground source={require('../assets/BackgroundLocked.jpg')} style={styles.container}>
            <ReturnButton navigation={navigation} />
            <Text style={styles.title}>Register as {userType}</Text>
            <View style={styles.inputs}>
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
                            placeholder="Address"
                            value={domicilio}
                            onChangeText={setDomicilio}
                            label={"Address"}
                        />
                    </>
                )}

                {userType === 'service' && (
                    <InputText
                        placeholder="Service Name"
                        value={serviceName}
                        onChangeText={setServiceName}
                        label={"Service Name"}
                    />
                )}
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
            </View>
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
    }
});