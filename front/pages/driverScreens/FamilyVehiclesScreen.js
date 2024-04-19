import React, {useEffect} from 'react';
import {ImageBackground, Pressable, StyleSheet, Text, View} from 'react-native';

export function FamilyVehiclesScreen({ navigation, route }) {
    const { families } = route.params;
    const [familiesData, setFamilies] = React.useState([]);

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
                <Text style={styles.title}>WELCOME TO FAMILY VEHICLE SCREEN</Text>
                <Text style={styles.headerTitle}>ACA TENDRÍAN QUE APARECER TODAS LAS FAMILIAS Y LUEGO NAVEGAR A LOS AUTOS</Text>{familiesData.map((family, index) => {
                return (
                    <Pressable key={index} style={styles.familyContainer} onPress={() => {
                        // Handle the press event here
                        console.log(`Pressed: ${family.surname}`);
                    }}>
                        <Text style={styles.familyName}>{family.surname}</Text>
                    </Pressable>
                );
            })}
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
});