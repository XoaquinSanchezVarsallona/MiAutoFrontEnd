import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { NotificationContext } from './NotificationContext';

function AppNotification() {
    const { notification } = useContext(NotificationContext);
    const [isVisible, setIsVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(1000)).current; // Initial value for right: 1000 (off screen)
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0 (transparent)

    useEffect(() => {
        if (notification) {
            setIsVisible(true);
            // Will change slideAnim value to 0 and fadeAnim value to 1 in 0.5 seconds
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: false
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: false
                })
            ]).start();

            // Wait for 3 seconds, then slide out and fade away
            setTimeout(() => {
                Animated.parallel([
                    Animated.timing(slideAnim, {
                        toValue: 1000,
                        duration: 1000,
                        useNativeDriver: false
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: false
                    })
                ]).start(() => setIsVisible(false)); // Set isVisible to false when the animation completes
            }, 2500);
        }
    }, [notification]);

    if (!isVisible) {

        return null;
    }

    return (
        <Animated.View style={[
            styles.notificationContainer,
            { transform: [{ translateX: slideAnim }] },
            { opacity: fadeAnim }
        ]}>
            <Text style={styles.notificationText}>{notification}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    notificationContainer: {
        position: 'absolute',
        top: 10, // Adjust as needed
        right: 0,
        padding: 10,
        backgroundColor: '#32cd32', // Change as needed
        borderRadius: 5,
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    notificationText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AppNotification;
