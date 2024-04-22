import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

function StyledButton({ icon, text, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} style={{ alignItems: 'center' }}>
            <Image source={icon} />
            <Text style={styles.textLabel}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 100,
        height: 100,
        resizeMode: 'contain' // Keep the icon's aspect ratio
    },
    textLabel: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    }

});

export default StyledButton;