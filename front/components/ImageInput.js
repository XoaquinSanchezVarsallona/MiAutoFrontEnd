import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import StyledButton2 from "./StyledButton2";
import {NotificationContext} from "./notification/NotificationContext";

const ImageInput = (requiered) => {
    const [imageData, setImageData] = useState('');
    const { showNotification, setColor } = useContext(NotificationContext);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission denied for accessing media library');
            }
        })();
    }, []);

    useEffect(() => {
        // Verificar imageData actualizado
        if (imageData) {
            console.log('Image picked:', imageData); // Verificar imageData en la consola
        }
    }, [imageData]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: true, // Asegurarse de habilitar la codificación base64
        });

        if (!result.canceled) {
            setImageData(result.assets[0].base64);
        }
    };

    async function handleImageSave (){
        try {
            const response = await fetch('http://localhost:9002/saveImage', {
                method: 'POST',
                body: JSON.stringify({
                    userId: requiered.userId,
                    field: requiered.field,
                    patente : requiered.patente,
                    value: imageData,

                }),
            });
            if (!response.ok) {
                console.error('Network response was not ok');
            }

            console.log(`Server status: `, response.status);

            setColor('#32cd32')
            showNotification(`Updated ${requiered.field} successfully!`);
        }
        catch (e) {
            console.log("Error message: "+ e.message)
            setColor('red')
            showNotification(`Failed to update ${requiered.field}`);
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage} style={styles.button}>
                <Text style={styles.buttonText}>Upload image</Text>
            </TouchableOpacity>
            <StyledButton2
                icon={require('../assets/pencil.png')}
                onPress={handleImageSave}
                style={styles.pencilButton}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pencilButton: {
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
});

export default ImageInput;
