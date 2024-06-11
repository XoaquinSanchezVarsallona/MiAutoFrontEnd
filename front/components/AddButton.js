import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

const AddButton = ({ onPress, text, color = '#32cd32' }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <View
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={[styles.button, hovered && styles.buttonHovered]}
        >
            <Pressable style={[styles.buttonInner, { backgroundColor: color }]} onPress={onPress}>
                <Text style={styles.text}>{text}</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '30%',
        marginVertical: 10,
        alignSelf: 'center',
        transition: 'transform 0.25s ease-in-out',
    },
    buttonHovered: {
        transform: 'scale(1.035)',
    },
    buttonInner: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    text: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default AddButton;