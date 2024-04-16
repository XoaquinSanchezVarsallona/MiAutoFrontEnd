import React from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import StyledButton from "../../components/StyledButton";

export function ConfigurationScreen({ navigation }) {
    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Configuration</Text>
                <View style={styles.buttonContainer}>
                    <StyledButton
                        icon={require('../../assets/pencil.png')}
                        onPress={() => navigation.navigate('EditProfile')}
                    />
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </View>
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
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',  // Ensures that the button and text are in a row
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginRight: 20, // Space between the title and the button
    },
    buttonText: {
        fontSize: 16, // Font size for the text next to the button
        marginLeft: 10, // Space between the button and the text
    },
});
