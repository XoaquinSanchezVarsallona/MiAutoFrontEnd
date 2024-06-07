import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

const FamilyButtonToCar = ({ family, navigation, familyId, index }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <View
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={[styles.familyContainer, hovered && styles.familyContainerHovered]}
        >
            <Pressable
                key={index}
                style={styles.innerContainer}
                onPress={() => {
                    console.log(`Pressed: ${family.surname}`);
                    navigation.navigate('VehiclesScreen', { familySurname: family.surname, familyId: familyId });
                }}
            >
                <Text style={styles.familyName}>{family.surname}</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    familyContainer: {
        width: '90%',
        marginVertical: 8,
        marginHorizontal: 12,
        alignSelf: 'center',
        transition: 'transform 0.09s ease-in-out',
    },
    familyContainerHovered: {
        transform: 'scale(1.038)',
    },
    innerContainer: {
        width: '100%',
        padding: 15,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
    },
    familyName: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
    },
});

export default FamilyButtonToCar;
