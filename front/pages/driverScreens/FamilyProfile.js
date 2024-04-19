import React from 'react';
import {StyleSheet, View, Text, ImageBackground} from 'react-native';
import StyledButton from "../../components/StyledButton";

export function FamilyProfile({ navigation, route }) {
    const { families } = route.params;
    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>MIAUTO</Text>
                <Text style={styles.title}>WELCOME TO FAMILIES</Text>
                {families.map((family, index) => (
                    <Text key={index} style={styles.familyName}>{family.surname}</Text>
                ))}
                <StyledButton
                    icon={require('../../assets/add.png')}
                    onPress={() => navigation.navigate('AddNewFamily' )}
                />
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
    familyName: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
    },
});