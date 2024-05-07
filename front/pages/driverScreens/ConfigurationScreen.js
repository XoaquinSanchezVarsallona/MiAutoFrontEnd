import React from 'react';
import {StyleSheet, View, Text, ImageBackground, TouchableOpacity} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import StyledButton2 from "../../components/StyledButton2";

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
            <Text style={styles.title}>Configuration</Text>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.buttonContainer} onPress={logout}>
                    <StyledButton2
                        onPress={logout}
                        icon={require('../../assets/logout.png')}
                    />
                    <Text style={styles.subtitle}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('EditProfile')}>
                    <StyledButton2
                        onPress={() => navigation.navigate('EditProfile')}
                        icon={require('../../assets/pencil.png')}
                    />
                    <Text style={styles.subtitle}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('ViewProfile')}>
                    <StyledButton2
                        onPress={() => navigation.navigate('ViewProfile')}
                        icon={require('../../assets/user.png')}
                    />
                    <Text style={styles.subtitle}>View Profile</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('ViewRoutes')}>
                    <StyledButton2
                        onPress={() => navigation.navigate('ViewRoutes')}
                        icon={require('../../assets/route.png')}
                    />
                    <Text style={styles.subtitle}>View Profile</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 16,
        width: '85%',
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        paddingBottom: 20,
    },
    subtitle: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold', // Make the title bold
        marginRight: 35,
    },
    buttonContainer: {
        height: 100,
        width: '30%',
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-around',
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
