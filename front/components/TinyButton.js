import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

const TinyButton = ({ onPress, text, color = '#32cd32', width = '30%', bottom = -5 }) => {
    const [hovered, setHovered] = useState(false);

    const tinyStyle = {
        ...styles.button,
        width: width,
        marginBottom: bottom,
    };

    return (
        <View
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={[tinyStyle, hovered && styles.buttonHovered]}
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
        marginTop: 8,
        marginBottom: -5,
        alignSelf: 'center',
        transition: 'transform 0.25s ease-in-out',
    },
    buttonHovered: {
        transform: 'scale(1.035)',
    },
    buttonInner: {
        paddingVertical: 7,
        paddingHorizontal: 2,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    text: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default TinyButton;