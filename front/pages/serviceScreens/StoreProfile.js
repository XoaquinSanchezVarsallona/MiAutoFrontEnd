import React from 'react';
import {View, Text, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';

export function StoreProfile({ navigation, route }) {
    const { store } = route.params;

    const deleteStore = async () => {
        try {
            const response = await fetch(`http://localhost:9002/store/${store.storeEmail}/deleteStore`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Store deleted successfully');
                navigation.goBack();
            } else {
                console.error('Failed to delete store');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{store.storeName}</Text>
                <Text style={styles.detail}>Store Email: {store.storeEmail}</Text>
                <Text style={styles.detail}>Store Address: {store.domicilio}</Text>
                <Text style={styles.detail}>Store Service type: {store.tipoDeServicio}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.deleteButton} onPress={deleteStore}>
                        <Text style={styles.buttonText}>Delete Store</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modifyButton} onPress={() => { navigation.navigate("EditVisualStoreProfile", {email : store.storeEmail} ) }}>
                        <Text style={styles.buttonText}>Modify Store Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
        margin: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        width: '80%',
        alignSelf: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        width: '45%',
    },
    modifyButton: {
        backgroundColor: 'orange',
        padding: 10,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        width: '45%',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    detail: {
        fontSize: 16,
    },
});

export default StoreProfile;