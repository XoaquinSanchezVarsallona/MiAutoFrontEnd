import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

const CustomButton = ({ onPress, text, color = 'transparent' }) => {
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
        marginVertical: 10,
        width: '10%',
        borderColor: 'gray',
        borderWidth: 3,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        transition: 'transform 0.25s ease-in-out',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonHovered: {
        transform: 'scale(1.035)',
    },
    buttonInner: {
        paddingVertical: 12,
        width: '100%',
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default CustomButton;