import React, { useState, useEffect } from 'react';
import { View, Image, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import StyledButton2 from "./StyledButton2";

const ImageInput = (requiered) => {
    const [imageData, setImageData] = useState('');

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
                throw new Error('Network response was not ok');
            }

            console.log(`Server status: `, response.status);

            // Update UI or notify user based on success
            alert(`Updated ${requiered.field} successfully!`);
        }
        catch (e) {
            console.log("Error message: "+ e.message)
        }
    }

    return (
        <View style={styles.container}>
            <Button title="Upload an image" onPress={pickImage} style={styles.boton} />
            <StyledButton2
            icon={require('../assets/pencil.png')}
            onPress={() => handleImageSave()}/>
        </View>
    );
};

const styles = StyleSheet.create({
    imagen: { width: 100, height: 100, marginRight: 20},
    container: { flex: 1, alignItems: 'center', flexDirection: 'row', },
    boton: { color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 20},
});

export default ImageInput;
