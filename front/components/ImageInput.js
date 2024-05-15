import React, { useState, useEffect } from 'react';
import { View, Image, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


const ImageInput = () => {
    let {imageData} = useState('')

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission denied for accessing media library');
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            console.log(result.assets[0].base64)
            imageData = result.assets[0].base64
        }
    };

    return (
        <View style={styles.container}>
            {imageData && (
                <Image
                    source={{ uri: `data:image/png;base64,${imageData}` }}
                    style={styles.imagen}
                />
            )}
            <Button title="Upload an image" onPress={pickImage} style={styles.boton}/>
        </View>
    );
};

const styles = StyleSheet.create({
    imagen : { width: 200, height: 200, marginTop: 20 },
    container : { flex: 1, alignItems: 'center', justifyContent: 'center', width: 30, height: 100,},
    boton : { color: 'white', fontSize: 20, fontWeight: 'bold' }

})

export default ImageInput;
