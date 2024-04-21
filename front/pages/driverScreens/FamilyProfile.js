import React, {useCallback, useEffect} from 'react';
import {ImageBackground, Pressable, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from "@react-navigation/native";

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
                <Text style={styles.title}>Mis Familias</Text>

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
            <Pressable style={styles.addFamilyButton} onPress={() => navigation.navigate('AddFamilyScreen', { username, email })}>
                <Text style={styles.addFamilyText}>Add a new family</Text>
            </Pressable>
            <Pressable style={styles.addFamilyButton} onPress={() => navigation.navigate('JoinFamilyScreen', { username, email })}>
                <Text style={styles.addFamilyText}>Join a family</Text>
            </Pressable>
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
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 12,
        backgroundColor: '#1e90ff', // A nice blue color
        borderRadius: 10,
        elevation: 3, // Adds a subtle shadow effect on Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
        shadowOpacity: 0.25, // Shadow for iOS
        shadowRadius: 3.84, // Shadow for iOS
        alignItems: 'center', // Centers the text inside the button
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
    addFamilyButton: {
        width: '40%',
        paddingVertical: 12, // Increase padding for a larger touch area
        paddingHorizontal: 20,
        marginVertical: 8,
        backgroundColor: '#32cd32', // A vibrant green color
        borderRadius: 20,
        elevation: 4, // Adds a subtle shadow effect on Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
        shadowOpacity: 0.25, // Shadow for iOS
        shadowRadius: 3.84, // Shadow for iOS
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

})