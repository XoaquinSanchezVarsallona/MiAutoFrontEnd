import React from 'react';
import {StyleSheet, View, Text, ImageBackground} from 'react-native';
import StyledButton from "../../components/StyledButton";

export function FamilyProfile({ navigation }) {

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>MIAUTO</Text>
                <Text style={styles.title}>WELCOME TO FAMILIES</Text>
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
    title: {
        fontSize: 24,
        marginBottom: 30,
    },
});