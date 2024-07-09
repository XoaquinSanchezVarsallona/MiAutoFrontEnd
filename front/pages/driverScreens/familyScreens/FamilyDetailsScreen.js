import React, {useContext, useEffect, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, ImageBackground, Pressable} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NotificationContext} from "../../../components/notification/NotificationContext";
import AddButton from "../../../components/AddButton";
import InputText from "../../../components/InputText";

function FamilyDetailsScreen({ route, navigation }) {
    const { family: initialFamily, email } = route.params;
    const [family, setFamily] = useState(initialFamily); // Add this line
    const [surname, setSurname] = useState(family.surname);
    const { showNotification, setColor } = useContext(NotificationContext);


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
                setColor('orange')
                showNotification('Surname updated successfully')
                console.log('Surname updated successfully');
                setFamily(prev => ({ ...prev, surname: surname }));
                navigation.goBack();
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
                navigation.goBack()
                setColor('#ff0000')
                showNotification('Family deleted successfully')
            } else {
                console.error('Failed to delete family');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Edit Family: {family.surname}</Text>
            </View>

            <InputText
                value={surname}
                label={"Family Surname"}
                onChangeText={setSurname}
                placeholder={"Enter Family Surname"}
            />

            <View style={styles.buttonsContainer}>
                <AddButton onPress={updateSurname} text={"Update Surname"}/>
                <AddButton color={'red'} onPress={deleteFamily} text={"Delete Family"}/>
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
});

export default FamilyDetailsScreen;