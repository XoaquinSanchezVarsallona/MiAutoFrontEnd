import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';

function StyledButton1({ icon, onPress }) {
    return (
        <Pressable onPress={onPress} style={styles.button}>
            <Image source={icon} style={styles.icon} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        //padding: 10, // Padding inside the button
        //margin: 5, // Margin around the button
        flex: 1,
        alignItems: 'center', // Center the icon inside the button
    },
    icon: {
        width: 100,
        height: 100,
        resizeMode: 'contain' // Keep the icon's aspect ratio
    },
});

export default StyledButton1;