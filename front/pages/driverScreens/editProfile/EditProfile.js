import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Text, ImageBackground, Modal} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageInput from "../../../components/ImageInput";
import InputText from "../../../components/InputText";
import AddButton from "../../../components/AddButton";
import {NotificationContext} from "../../../components/notification/NotificationContext";
import LocationPicker from "../../../components/map/LocationPicker";
import BoxButton from "../../../components/BoxButton";

export function EditProfile({ navigation }) {
    const { showNotification, setColor } = useContext(NotificationContext);
    const [fields, setFields] = useState([]);
    const [inputs, setInputs] = useState({
        userID: '',
        username: '',
        domicilio: '',
        name: '',
        surname: '',
        email: '',
        dniFront: null,
        dniBack: null,
        domicilioLatitude: 0,
        domicilioLongitude: 0,
    });
    const [canFetchProfile, setCanFetchProfile] = useState(false);
    const [locationPickerVisible, setLocationPickerVisible] = useState(false);

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
                const data = await response.json();
                if (response.ok) {
                    setInputs(prevInputs => ({
                        ...prevInputs,
                        userID: data.userId,
                        username: data.username,
                    }));
                    setCanFetchProfile(true); // Enable fetching more details
                } else {
                    console.error('Token validation failed:', data.message);
                    setCanFetchProfile(false);
                }
            }
        }
        loadUserProfile().then();
    }, []);

    // This effect runs only when canFetchProfile is set to true
    useEffect(() => {
        if (canFetchProfile) {
            async function fetchAndSetUser() {
                try {
                    const response = await fetch(`http://localhost:9002/user/${inputs.userID}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    setInputs(prevInputs => ({
                        ...prevInputs,
                        name: data.name,
                        surname: data.surname,
                        email: data.email,
                        domicilioLatitude: data.domicilioLatitude,
                        domicilioLongitude: data.domicilioLongitude,
                    }));
                } catch (error) {
                    console.error('Error:', error);
                }
            }
            fetchAndSetUser().then(r => console.log(r));
        }
    }, [canFetchProfile, inputs.userID]); // Depend on canFetchProfile

    // Función que elimina el usuario
    const deleteUser = () => {
        fetch(`http://localhost:9002/user/${inputs.userID}/deleteUser`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(r => {
            if (r.ok) {
                console.log("User deleted")
                setColor('#32cd32')
                showNotification("User deleted successfully.")
                logout().then()
            } else {
                console.log("Failed to delete user")
                setColor('red')
                showNotification("Failed to delete user. Please try again.")
            }
        }).catch(e => {
            console.log("Failed to delete user")
            setColor('red')
            showNotification("Failed to delete user. Please try again.")
        })
    }

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            console.log('Token eliminado', AsyncStorage.getItem('userToken'));
            navigation.reset({index: 0, routes: [{ name: 'Home' }],});
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Función que se encarga de cambiar el valor de los inputs en tiempo real
    const handleInputChange = (field, value) => {
        setFields(prevFields => Array.from(new Set([...prevFields, field])));
        console.log(fields)
        setInputs(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    // Función que se encarga de guardar los cambios en cada campo
    const handleEachSave = async () => {
        for (const field of fields) {
            await handleSave(field);
        }
    };

    // Función que se encarga de enviar los datos al backend, y muestra un mensaje de éxito o error
    const handleSave = async (field) => {
        const newValue = inputs[field];
        const {userID, username, name, surname, password, email, domicilioLatitude, domicilioLongitude} = inputs;

        if (field === 'email' && !newValue.includes('@')) {
            setColor('red')
            showNotification('Please enter a valid email address.');
            return;
        }
        if (field === 'password' && newValue.length < 8) {
            setColor('red')
            showNotification('Password must be at least 8 characters.');
            return;
        }
        if (field === 'username' && (username === '' || name === '' || surname === '' || domicilio === '')) {
            setColor('red')
            showNotification('Please fill in all fields.');
            return;
        }

        console.log(`Attempting to save ${field} with value: ${newValue}`);
        console.log(field + ": " + newValue)
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch('http://localhost:9002/editProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Include the JWT
                },
                body: JSON.stringify({
                    userId: userID,
                    field: field,
                    value: newValue,
                }),
            });


            if (!response.ok) {
                console.error('Network response was not ok');
                setColor('red')
                showNotification('Failed to update profile. Please try again.');
            } else {
                setColor('#32cd32')
                showNotification(`Updated profile successfully!`);
            }

            if (response.status === 409) {
                setColor('red');
                showNotification('Username or email already in use.');
            }

        } catch (error) {
            console.error('Error updating profile:', error);
            setColor('red')
            showNotification('Failed to update profile. Please try again.');
        }
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
            <View style={styles.formContainer}>

                <View style={styles.row}>
                    <InputText
                        label={"Name"}
                        onChangeText={(text) => handleInputChange("name", text)}
                        value={inputs["name"]}
                        placeholder={inputs["name"]}
                    />
                    <InputText
                        label={"Surname"}
                        onChangeText={(text) => handleInputChange("surname", text)}
                        value={inputs["surname"]}
                        placeholder={inputs["surname"]}
                    />
                </View>
                <View style={styles.row}>
                    <InputText
                        label={"Email"}
                        onChangeText={(text) => handleInputChange("email", text)}
                        value={inputs["email"]}
                        placeholder={inputs["email"]}
                    />
                    <InputText
                        label={"Username"}
                        onChangeText={(text) => handleInputChange("username", text)}
                        value={inputs["username"]}
                        placeholder={inputs["username"]}
                    />
                </View>
                <View style={styles.row}>
                    <InputText
                        label={"Password"}
                        onChangeText={(text) => handleInputChange("password", text)}
                        value={inputs["password"]}
                        placeholder={inputs["password"]}
                    />
                    <BoxButton text={"Pick Address"} onPress={() => setLocationPickerVisible(true)} />
                </View>
                <View style={styles.row}>
                    <ImageInput buttonText="Upload Front DNI" userId={inputs.userID} patente={null} field={"front of DNI"} onChange={(image) => handleInputChange("front of DNI", image) }/>
                    <ImageInput buttonText="Upload Back DNI" userId={inputs.userID} patente={null} field={"back of DNI"} onChange={(image) => handleInputChange("back of DNI", image) }/>
                </View>
            </View>

            {locationPickerVisible && (
                <Modal
                    visible={locationPickerVisible}
                    animationType="slide"
                    onRequestClose={() => setLocationPickerVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <LocationPicker
                            onLocationSelect={(lat, lng) => {
                                setInputs(prevState => ({
                                    ...prevState,
                                    domicilioLatitude: lat,
                                    domicilioLongitude: lng
                                }));
                            }}
                            defaultCenter={{ lat: inputs.domicilioLatitude || -34.6037, lng: inputs.domicilioLongitude || -58.3816 }}
                        />
                        <AddButton
                            text={"Done"}
                            onPress={() => {
                                handleInputChange("domicilioLatitude", inputs.domicilioLatitude);
                                handleInputChange("domicilioLongitude", inputs.domicilioLongitude);
                                setLocationPickerVisible(false);
                            }}
                        />
                    </View>
                </Modal>
            )}

            <View style={styles.row}>
                <AddButton text={"Save"} onPress={() => handleEachSave()} />
                <AddButton text={"Delete User"} color={"red"} onPress={() => deleteUser()} />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: "space-between"
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
        width: '80%',
        alignItems: 'center',
    },
    label: {
        alignSelf: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
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
    },
    formContainer: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});


