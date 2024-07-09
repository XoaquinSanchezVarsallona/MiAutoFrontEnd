import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const BoxButton = ({ text, onPress, color = '#1E90FF' }) => {
    return (
        <TouchableOpacity style={[styles.customButton, { backgroundColor: color }]} onPress={onPress}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    customButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        margin: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default BoxButton;
