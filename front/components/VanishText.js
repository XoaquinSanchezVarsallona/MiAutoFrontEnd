import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';

const VanishText = ({ username }) => {
    const [isVisible, setIsVisible] = useState(true);
    const slideAnim = useRef(new Animated.Value(0)).current; // Initial value for slide animation

    const opacityAnim = slideAnim.interpolate({
        inputRange: [0, 500],
        outputRange: [1, 0]
    });

    useEffect(() => {

        const timer = setTimeout(() => {
            Animated.timing(
                slideAnim,
                {
                    toValue: 500,
                    duration: 2000,
                    useNativeDriver: true
                }
            ).start(() => setIsVisible(false));
        }, 5000); // 5000 milliseconds = 5 seconds

        return () => clearTimeout(timer);
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <View style={styles.container}>
            {isVisible &&
                <Animated.View style={{...styles.subTitle, position: 'absolute',transform: [{ translateX: slideAnim }], opacity: opacityAnim}}>
                    <Text style={styles.subTitle}>Welcome {username}!</Text>
                </Animated.View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subTitle: {
        fontSize: 30,
        color: '#FFFFFF',
    },
});

export default VanishText;