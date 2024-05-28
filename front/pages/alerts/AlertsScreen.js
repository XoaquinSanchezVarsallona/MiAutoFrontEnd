import React, {useEffect} from 'react';
import {ImageBackground, Pressable, StyleSheet, Text, View} from 'react-native';
import CustomScrollBar from "../../components/CustomScrollBar";

export function AlertScreen({ navigation, route }) {
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
        // Create a new array with duplicate family IDs removed
        const uniqueFamilies = [...new Set(families)];
        fetchFamilias(uniqueFamilies)
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
                <Text style={styles.title}>My Alerts</Text>

                <CustomScrollBar style={styles.familiesScrollView} contentContainerStyle={styles.familiesContentContainer}>
                    {familiesData.length > 0 ? (
                        familiesData.sort((a, b) => b.familyId - a.familyId).map((family, index) => (
                            family && (
                                <Pressable
                                    key={index}
                                    style={styles.familyButton}
                                    onPress={() => {
                                        console.log(`Pressed: ${family.surname}`);
                                        navigation.navigate('AlertsFromFamilyScreen', { family: family, email: email  });
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
            </View>
            <Pressable style={styles.addAlertButton} onPress={() => navigation.navigate('AddAlertScreen', { username, email })}>
                <Text style={styles.addAlertText}>Add a new alert</Text>
            </Pressable>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        width: '40%',
    },
    familyName: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
    },
    familyButton: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addAlertButton: {
        width: '40%',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 8,
        backgroundColor: '#32cd32',
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    alertMessage: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
    },
    addAlertText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
    noAlertsText: {
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
