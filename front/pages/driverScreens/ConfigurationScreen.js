import React from 'react';
import {StyleSheet, View, Text, ImageBackground, TouchableOpacity} from 'react-native';
import StyledButton from "../../components/StyledButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function ConfigurationScreen({ navigation }) {
    const logout = async () => {
        try {
            //
            //elimino el token del storage local
            await AsyncStorage.removeItem('userToken');

            //chequeo
            console.log('Token eliminado', AsyncStorage.getItem('userToken'));

            // This resets the stack navigator to the initial route
            navigation.reset({index: 0, routes: [{ name: 'Home' }],});
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Configuration</Text>
                <TouchableOpacity style={styles.buttonContainer} onPress={logout}>
                    <StyledButton
                        icon={require('../../assets/logout.png')}
                    />
                    <Text style={styles.subtitle}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('EditProfile')}>
                    <StyledButton
                        icon={require('../../assets/pencil.png')}
                    />
                    <Text style={styles.subtitle}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
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
    headerContainer: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold', // Make the title bold
        marginBottom: 10, // Space below the title
    },
    buttonContainer: {
        width: '25%',
        flexDirection: 'row',
        padding: 10,
        paddingRight: 55,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
});
