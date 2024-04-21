import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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
        <View style={styles.container}>
            <Text>Edit Family: {family.surname}</Text>
            <TextInput value={surname} onChangeText={setSurname} />
            <Button title="Update Surname" onPress={updateSurname} />
            <Button title="Delete Family" onPress={deleteFamily} color="red" />
            {/* Implement add user functionality */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});

export default FamilyDetailsScreen;
