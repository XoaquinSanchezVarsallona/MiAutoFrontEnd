import React, { useState, useEffect } from 'react';
import { View, Image, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImageInput = () => {
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

    return (
        <View style={styles.container}>
            {imageData ? (
                <Image
                    source={{ uri: `data:image/png;base64,${imageData}` }}
                    style={styles.imagen}
                />
            ) : null}
            <Button title="Upload an image" onPress={pickImage} style={styles.boton} />
        </View>
    );
};

const styles = StyleSheet.create({
    imagen: { width: 100, height: 100, marginTop: 20 },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    boton: { color: 'white', fontSize: 20, fontWeight: 'bold' },
});

export default ImageInput;
