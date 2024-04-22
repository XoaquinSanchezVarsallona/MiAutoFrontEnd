import React from 'react';
import { Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

function StyledButton2({ icon, text, onPress, style }) { // Add style prop here
    return (
        <TouchableOpacity onPress={onPress} style={[{ alignItems: 'center' }, style]}> {/* Apply the style here */}
            <Image source={icon} style={styles.icon} />
            <Text style={styles.textLabel}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 70,
        height: 70,
    },
    textLabel: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default StyledButton2;