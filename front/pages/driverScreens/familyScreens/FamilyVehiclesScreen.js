import React, {useEffect} from 'react';
import {ImageBackground, Pressable, StyleSheet, Text, View, ScrollView} from 'react-native';

export function FamilyVehiclesScreen({ navigation, route }) {
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
        // Create a new array with duplicate family IDs removed
        const uniqueFamilies = [...new Set(families)];

        fetchFamilias(uniqueFamilies)
            .then(fetchedFamilies => {
                console.log('Fetched families:', fetchedFamilies);
                setFamilies(fetchedFamilies);
            })
            .catch(error => console.error('Error:', error));
    }, [families]);

    useEffect(() => { }, [familiesData, families]);

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Familias con Autos</Text>
            </View>

            <ScrollView style={styles.familiesList} contentContainerStyle={styles.contentContainerStyle}>
                {familiesData.length > 0 ? (
                    familiesData.sort((a, b) => b.familyId - a.familyId).map((family, index) => (
                        family && (
                            <Pressable
                                key={index}
                                style={styles.familyButton}
                                onPress={() => {
                                    console.log(`Pressed: ${family.surname}`);
                                    navigation.navigate('VehiclesScreen', { familySurname: family.surname, familyId: families[index] });
                                }}
                            >
                                <Text style={styles.familyName}>{family.surname}</Text>
                            </Pressable>
                        )
                    ))
                ) : (
                    <Text style={styles.noFamiliesText}>No families available</Text>
                )}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainerStyle: {
        alignItems: 'center',
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        paddingTop: 40,
        width: '100%',
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    familiesList: {
        flex: 1,
        width: '100%',
        marginBottom: 20,
    },
    familyButton: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
        alignItems: 'center',
        width: '50%',
        alignSelf: 'center',
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
    noFamiliesText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
})