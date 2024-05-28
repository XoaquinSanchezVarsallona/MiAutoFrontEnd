import React from 'react';
import { Text, Image, TouchableOpacity, View, StyleSheet } from 'react-native';

function StyledButtonWithAddOn({ icon, text, onPress, unreadAlertsCount }) {
    return (
        <TouchableOpacity onPress={onPress} style={{ alignItems: 'center' }}>
            <Image source={icon} style={styles.icon} />
            {unreadAlertsCount !== 0 && (
                <View style={styles.alertCountContainer}>
                    <Text style={styles.alertCountText}>{unreadAlertsCount}</Text>
                </View>
            )}
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
    alertCountContainer: {
        position: 'absolute',
        bottom: 42,
        right: -7,
        backgroundColor: '#0470bd',
        borderRadius: 50,
        width: 50, // Adjust as needed
        height: 50, // Adjust as needed
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    alertCountText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 22,
    },
});

export default StyledButtonWithAddOn;