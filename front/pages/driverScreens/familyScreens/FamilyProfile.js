import React, {useEffect} from 'react';
import {ImageBackground, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CustomScrollBar from "../../../components/CustomScrollBar";

export function FamilyProfile({ navigation, route }) {
    const [familiesData, setFamilies] = React.useState([]);
    const { families, email, username } = route.params;

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

    useFocusEffect(
        React.useCallback(() => {
            // Create a new array with duplicate family IDs removed
            const uniqueFamilies = [...new Set(families)];

            fetchFamilias(uniqueFamilies)
                .then(fetchedFamilies => {
                    console.log('Fetched families:', fetchedFamilies);
                    setFamilies(fetchedFamilies);
                })
                .catch(error => console.error('Error:', error));
        }, [families])
    );

    useEffect(() => {
        console.log('Families:', familiesData);
    }, [familiesData]);
    const validFamiliesData = familiesData.filter(family => family !== null);

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>My Families</Text>
            </View>

            <CustomScrollBar style={styles.familiesScrollView} contentContainerStyle={styles.familiesContentContainer}>
                {validFamiliesData.length > 0 ? (
                    validFamiliesData.sort((a, b) => b.familyId - a.familyId).map((family, index) => (
                        family && ( // Check if family is not null
                            <Pressable
                                key={index}
                                style={styles.familyContainer}
                                onPress={() => {
                                    console.log(`Pressed: ${family.surname}`);
                                    navigation.navigate('FamilyDetailsScreen', { family: family, email: email });
                                }}
                            >
                                <Text style={styles.familyName}>{family.surname}</Text>
                            </Pressable>
                        )
                    ))
                ) : (
                    <Text style={styles.noFamiliesText}>No families available</Text>
                )}
            </CustomScrollBar>

            <View style={styles.buttonsContainer}>
                <Pressable style={styles.addFamilyButton} onPress={() => navigation.navigate('AddFamilyScreen', { username, email, validFamiliesData })}>
                    <Text style={styles.addFamilyText}>Add a new family</Text>
                </Pressable>
                <Pressable style={styles.addFamilyButton} onPress={() => navigation.navigate('JoinFamilyScreen', { username, email })}>
                    <Text style={styles.addFamilyText}>Join a family</Text>
                </Pressable>
            </View>
        </ImageBackground>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between', // Distribute space between elements
        alignItems: 'center',
        padding: 16,
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    familiesScrollView: {
        width: '80%',
        maxWidth: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    familiesContentContainer: {
        alignItems: 'center',
        width: '80%',
        justifyContent: 'center',
    },
    familyContainer: {
        width: '100%',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 12,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
        alignSelf: 'center',
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        padding: 10,
    },
    addFamilyButton: {
        width: '40%',
        paddingVertical: 12, // Increase padding for a larger touch area
        paddingHorizontal: 20,
        marginVertical: 8,
        backgroundColor: '#32cd32', // A vibrant green color
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    familyName: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
    },
    addFamilyText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
    noFamiliesText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
})