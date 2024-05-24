import React from 'react';
import { Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

function StyledButton({ icon, text, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} style={{ alignItems: 'center' }}>
            <Image source={icon} style={styles.icon} />
            <Text style={styles.textLabel}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 235,
        height: 215,
    },
    textLabel: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
});

export default StyledButton;