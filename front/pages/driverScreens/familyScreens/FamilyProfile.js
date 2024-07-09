import React, {useEffect} from 'react';
import {ImageBackground, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CustomScrollBar from "../../../components/CustomScrollBar";
import LoadingScreen from "../../LoadingScreen";
import AddButton from "../../../components/AddButton";
import FamilyButton from "../../../components/FamilyButton";

export function FamilyProfile({ navigation, route }) {
    const [familiesData, setFamilies] = React.useState([]);
    const { families, email, username } = route.params;
    const [loading, setLoading] = React.useState(true);

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
                    const sortedFamilies = fetchedFamilies.sort()
                    setFamilies(sortedFamilies);
                    setLoading(false);
                })
                .catch(error => console.error('Error:', error));
        }, [families])
    );

    useEffect(() => {
        console.log('Families:', familiesData);
    }, [familiesData]);
    const validFamiliesData = familiesData.filter(family => family !== null);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>My Families</Text>
            </View>

            <View style={styles.scrollBarStyle}>
                <CustomScrollBar>
                    {validFamiliesData.length > 0 ? (
                        validFamiliesData.sort((a, b) => b.familyId - a.familyId).map((family, index) => (
                            family && (
                                <FamilyButton
                                    key={index}
                                    family={family}
                                    email={email}
                                    navigation={navigation}
                                    index={index}
                                />
                            )
                        ))
                    ) : (
                        <Text style={styles.noFamiliesText}>No families available</Text>
                    )}
                </CustomScrollBar>
            </View>

            <View style={styles.buttonsContainer}>
                <AddButton onPress={() => navigation.navigate('AddFamilyScreen', { username, email, validFamiliesData })} text={"Add a new family"} />
                <AddButton onPress={() => navigation.navigate('JoinFamilyScreen', { username, email })} text={"Join a family"} />
            </View>
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
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        padding: 10,
    },
    noFamiliesText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
    scrollBarStyle: {
        alignItems: 'center',
        width: '60%',
        flex: 1,
    },
});