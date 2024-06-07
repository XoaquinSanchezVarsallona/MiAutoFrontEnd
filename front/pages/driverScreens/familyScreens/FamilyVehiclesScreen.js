import React, { useEffect, useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import LoadingScreen from "../../LoadingScreen";
import FamilyButtonToCar from "../../../components/FamilyButtonToCar";
import CustomScrollBar from "../../../components/CustomScrollBar";

export function FamilyVehiclesScreen({ navigation, route }) {
    const [familiesData, setFamilies] = useState([]);
    const { families, email } = route.params;
    const [loading, setLoading] = useState(true);

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
            }));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchFamilias(families)
            .then(fetchedFamilies => {
                console.log('Fetched families:', fetchedFamilies);
                setFamilies(fetchedFamilies.filter(family => family !== null));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
            });
    }, [families]);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Families with Vehicles</Text>
            </View>
            <View style={styles.scrollBarContainer}>
                <CustomScrollBar>
                    {familiesData.length > 0 ? (
                        familiesData.sort((a, b) => b.familyId - a.familyId).map((family, index) => (
                            family && (
                                <FamilyButtonToCar
                                    key={index}
                                    family={family}
                                    navigation={navigation}
                                    familyId={families[index]}
                                    index={index}
                                />
                            )
                        ))
                    ) : (
                        <Text style={styles.noFamiliesText}>No families available</Text>
                    )}
                </CustomScrollBar>
            </View>
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
    scrollBarContainer: {
        flex: 1,
        width: '60%',
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
    noFamiliesText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
});
