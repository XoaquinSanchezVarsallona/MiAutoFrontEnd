import React, {useEffect} from 'react';
import {Button, ImageBackground, Pressable, StyleSheet, Text, View} from 'react-native';

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
            <View style={styles.container}>
                <Text style={styles.title}>WELCOME TO FAMILIES CAR'S SCREEN</Text>

                {familiesData.length > 0 ? (
                    familiesData.map((family, index) => (
                        family && ( // Check if family is not null
                            <Pressable
                                key={index}
                                style={styles.addFamilyButton}
                                onPress={() => {
                                    console.log(`Pressed: ${family.surname}`);
                                    navigation.navigate('VehiclesScreen', { familySurname: family.surname, familyId: families[index]});
                                }}
                            >
                                <Text style={styles.familyName}>{family.surname}</Text>
                            </Pressable>
                        )
                    ))
                ) : (
                    <Text>No families available</Text>
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
    familyName: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addFamilyButton: {
        width: '30%',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 12,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        alignItems: 'center',
    },
})