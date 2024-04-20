import React, {useEffect} from 'react';
import {Button, ImageBackground, Pressable, StyleSheet, Text, View} from 'react-native';

export function FamilyProfile({ navigation, route }) {
    const [familiesData, setFamilies] = React.useState([]);
    const { families, email } = route.params;


    // FetchFamilias busca en base a unos ID una familia
    const fetchFamilias = async (familias) => {
        try {
            // Filter out any null values in case some fetches failed
            return await Promise.all(familias.map(async (familyId) => {
                const response = await fetch(`http://localhost:9002/family/${familyId}`);
                if (response.ok) {
                    return await response.json();
                } else {
                    console.log(`Failed to fetch family with ID: ${familyId}`);
                    return null;
                }
            }))
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchFamilias(families)
            .then(fetchedFamilies => {
                console.log('Fetched families:', fetchedFamilies);
                setFamilies(fetchedFamilies);
            })
            .catch(error => console.error('Error:', error));
    }, [families]);

    useEffect(() => { }, [familiesData]);

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>MIAUTO</Text>
                <Text style={styles.title}>WELCOME TO FAMILIES SCREEN</Text>

                <Pressable style={styles.addFamilyButton} onPress={() => navigation.navigate('AddFamilyScreen')}>
                    <Text style={styles.addFamilyText}>Add a new family</Text>
                </Pressable>

                {familiesData.length > 0 ? (
                    familiesData.map((family, index) => (
                        family && ( // Check if family is not null
                            <Pressable
                                key={index}
                                style={styles.familyContainer}
                                onPress={() => {
                                    console.log(`Pressed: ${family.surname}`);
                                    navigation.navigate('FamilyDetailsScreen', { family: family, email: email  });
                                }}
                            >
                                <Text style={styles.familyName}>{family.surname}</Text>
                            </Pressable>
                        )
                    ))
                ) : (
                    <Text style={styles.noFamiliesText}>No families available</Text>
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    familyContainer: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
    },
    familyName: {
        fontSize: 20,
        color: 'black',
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    addFamilyButton: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
    },
    addFamilyText: {
        fontSize: 18,
        color: '#FFFFFF', // White color for the text
        fontWeight: 'bold', // Bold text to make it stand out
        textAlign: 'center', // Center the text within the button
        padding: 10, // Add padding for better touch area and visual spacing
    },
})