import React from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView } from 'react-native';
import StyledButton from "../../components/StyledButton";

const icons = {
    'Edit Profile': require('../../assets/pencil.png'),
    'Edit Domicilio': require('../../assets/pencil.png'),
    'Edit Name': require('../../assets/pencil.png'),
    'Edit Password': require('../../assets/pencil.png'),
    'Edit Email': require('../../assets/pencil.png'),
    'Edit Surname': require('../../assets/pencil.png'),
    'Edit Username': require('../../assets/pencil.png')
};

const buttons = [
    { label: 'Edit Profile', navigateTo: 'editProfile' },
    { label: 'Edit Domicilio', navigateTo: 'editDomicilio' },
    { label: 'Edit Name', navigateTo: 'editName' },
    { label: 'Edit Password', navigateTo: 'editPassword' },
    { label: 'Edit Email', navigateTo: 'editEmail' },
    { label: 'Edit Surname', navigateTo: 'editSurname' },
    { label: 'Edit Username', navigateTo: 'editUsername' }
];

export function AlertsScreen({ navigation }) {
    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Alertas</Text>
                {buttons.map((button, index) => (
                    <View key={index} style={styles.buttonContainer}>
                        <StyledButton
                            icon={icons[button.label]}
                            onPress={() => navigation.navigate(button.navigateTo)}
                        />
                        <Text style={styles.buttonText}>{button.label}</Text>
                    </View>
                ))}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    scrollContainer: {
        alignItems: 'center',
        paddingTop: 20,
    },
    headerContainer: {
        width: '100%',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 16,
        marginLeft: 10,
    },
});

