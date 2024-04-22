import {StyleSheet, View, Text, ImageBackground, TextInput, Button} from 'react-native';
import {useState} from "react";

export function AddNewVehicle({ navigation, route }) {
    const { familySurname, familyId } = route.params;
    const [patente, setPatente] = useState('');
    const [ano, setAno] = useState('');
    const [fechaVencimientoSeguro, setFechaVencimientoSeguro] = useState('');
    const [fechaVencimientoVTV, setFechaVencimientoVTV] = useState('');
    const [kilometraje, setKilometraje] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');

    const addVehicle = async () => {
        try {
            const response = await fetch(`http://localhost:9002/car/${familyId}/addVehicle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ patente, ano, fechaVencimientoSeguro, fechaVencimientoVTV, kilometraje, marca, modelo }),
            });
            if (response.ok) {
                alert('Vehicle added successfully');
                navigation.navigate('VehiclesScreen', { familySurname: familySurname, familyId: familyId });
            } else if (response.status === 400) {
                const errorMessage = await response.text();
                alert(errorMessage);
            } else {
                console.error('Failed to add vehicle');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Agregue un nuevo Vehiculo a la familia {familySurname}</Text>
                </View>
            <TextInput
                style={styles.input}
                value={patente}
                onChangeText={setPatente}
                placeholder="License Plate"
            />
            <TextInput
                style={styles.input}
                value={ano}
                onChangeText={setAno}
                placeholder="Year"
            />
            <TextInput
                style={styles.input}
                value={fechaVencimientoSeguro}
                keyboardType="numbers-and-punctuation"
                onChangeText={(text) => {
                    if (/^(\d{0,2})(\/(\d{0,2})?)?(\/(\d{0,4})?)?$/.test(text) || text === '') {
                        setFechaVencimientoSeguro(text);
                    }
                }}
                placeholder="Insurance Expiry (DD/MM/YYYY)"
            />
            <TextInput
                style={styles.input}
                value={fechaVencimientoVTV}
                keyboardType="numbers-and-punctuation"
                onChangeText={(text) => {
                    if (/^(\d{0,2})(\/(\d{0,2})?)?(\/(\d{0,4})?)?$/.test(text) || text === '') {
                        setFechaVencimientoVTV(text);
                    }
                }}
                placeholder="VTV Expiry (DD/MM/YYYY)"
            />
            <TextInput
                style={styles.input}
                value={kilometraje}
                onChangeText={setKilometraje}
                placeholder="Mileage"
            />
            <TextInput
                style={styles.input}
                value={marca}
                onChangeText={setMarca}
                placeholder="Brand"
            />
            <TextInput
                style={styles.input}
                value={modelo}
                onChangeText={setModelo}
                placeholder="Model"
            />
            <Button style={styles.addVehicleButton} title="Add Vehicle" onPress={ addVehicle }></Button>
        </ImageBackground>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 5,
    },
    addVehicleButton: {
        width: '40%',
        paddingVertical: 12, // Increase padding for a larger touch area
        paddingHorizontal: 20,
        marginVertical: 8,
        backgroundColor: '#32cd32', // A vibrant green color
        borderRadius: 20,
        elevation: 4, // Adds a subtle shadow effect on Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
        shadowOpacity: 0.25, // Shadow for iOS
        shadowRadius: 3.84, // Shadow for iOS
    },
});