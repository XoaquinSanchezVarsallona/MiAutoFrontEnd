import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, ImageBackground, Pressable} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

function FamilyDetailsScreen({ route, navigation }) {
    const { family: initialFamily, email } = route.params;
    const [family, setFamily] = useState(initialFamily); // Add this line
    const [surname, setSurname] = useState(family.surname);
    const [userID, setUserID] = useState(null);



    const updateSurname = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`http://localhost:9002/family/${family.surname}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ surname: surname }), // Send the new surname in the request body
            });
            if (response.ok) {
                console.log('Surname updated successfully');
                setFamily(prev => ({ ...prev, surname: surname }));
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'UnlockedScreenDriver', params: { email: email }}],
                });
            } else {
                console.error('Failed to update surname');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteFamily = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            console.log('Delete family:', family.surname);
            const response = await fetch(`http://localhost:9002/family/${family.surname}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                console.log('Family deleted successfully');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'UnlockedScreenDriver', params: { email: email }}],
                });
            } else {
                console.error('Failed to delete family');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const addUserToFamily = async (username) => {
        // API call to add user to family
        console.log('Add user to family:', username);
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Edit Family: {family.surname}</Text>
            </View>

            <TextInput
                value={surname}
                onChangeText={setSurname}
                placeholder="Enter Family Surname"
                placeholderTextColor="#A9A9A9" // placeholder text color
                style={styles.input}
            />

            <View style={styles.buttonsContainer}>
                <Pressable style={styles.addFamilyButton} onPress={updateSurname}>
                    <Text style={styles.addFamilyText}>Update Surname</Text>
                </Pressable>
                <Pressable style={styles.deleteFamilyButton} onPress={deleteFamily}>
                    <Text style={styles.addFamilyText}>Delete Family</Text>
                </Pressable>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        padding: 10,
    },
    input: {
        height: 50, // Increase the height for a better touch area
        backgroundColor: '#1e90ff', // a white background for the input field
        borderRadius: 25, // circular edges
        borderWidth: 1,
        borderColor: '#1e90ff', // light grey border
        paddingLeft: 20, // space before text starts
        paddingRight: 20, // space after text ends
        fontSize: 18, // slightly larger text
        color: '#D3D3D3', // text color
        marginTop: 20, // space from the top element
        marginBottom: 20, // space from the bottom element
        shadowOffset: { width: 0, height: 2 }, // shadow positioning
        shadowOpacity: 0.1, // shadow visibility
        shadowRadius: 8, // shadow blurriness
        elevation: 2, // shadow depth for Android
    },
    addFamilyButton: {
        width: '40%',
        paddingVertical: 12, // Increase padding for a larger touch area
        paddingHorizontal: 20,
        marginVertical: 8,
        backgroundColor: '#32cd32', // A vibrant green color
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
        shadowOpacity: 0.25, // Shadow for iOS
        shadowRadius: 3.84, // Shadow for iOS
    },
    deleteFamilyButton: {
        width: '40%',
        paddingVertical: 12, // Increase padding for a larger touch area
        paddingHorizontal: 20,
        marginVertical: 8,
        backgroundColor: 'red',
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
        shadowOpacity: 0.25, // Shadow for iOS
        shadowRadius: 3.84, // Shadow for iOS
    },
    addFamilyText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default FamilyDetailsScreen;