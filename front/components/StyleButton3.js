// Inside your StyledButton2.js file
import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const StyledButton3 = ({ icon, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[{ alignItems: 'center' }]}>
            <Image source={icon} style={styles.icon} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    icon: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
});

export default StyledButton3;
