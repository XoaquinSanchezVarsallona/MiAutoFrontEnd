import React, {useEffect} from 'react';
import {ImageBackground, Pressable, StyleSheet, Text, View} from 'react-native';
import CustomScrollBar from "../../../components/CustomScrollBar";
import { useIsFocused } from '@react-navigation/native';
import LoadingScreen from "../../LoadingScreen";

export function AlertScreen({ navigation, route }) {
    const [familiesData, setFamilies] = React.useState([]);
    const { families, email, username } = route.params;
    const [unreadAlertsCount, setUnreadAlertsCount] = React.useState([]);
    const isFocused = useIsFocused();
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

    const countUnreadAlerts = async (familyId) => {
        try {
            const response = await fetch(`http://localhost:9002/alerts/unreadAlerts/${familyId}`, {
                method: 'POST',
            });
            if (response.ok) {
                return await response.json();
            } else {
                console.log(`Failed to count unread alerts for family with ID: ${familyId}`);
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        // Create a new array with duplicate family IDs removed
        fetchFamilias(families)
            .then(fetchedFamilies => {
                console.log('Fetched families:', fetchedFamilies);
                setFamilies(fetchedFamilies);
            })
            .catch(error => console.error('Error:', error));
    }, [families]);

    useEffect(() => {
    }, [familiesData]);

    useEffect(() => {
        const fetchUnreadAlertsCount = async () => {
            const counts = await Promise.all(familiesData.map(family => countUnreadAlerts(family.surname)));
            setUnreadAlertsCount(counts);
        };

        fetchUnreadAlertsCount().then();
    }, [familiesData, isFocused]);

    useEffect(() => {
        if (familiesData.length > 0 && unreadAlertsCount.length > 0) {
            setLoading(false);
        }
    })

    if (loading) {
        return <LoadingScreen />;
    }
    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>My Alerts</Text>
            </View>
            <View style={styles.scrollBarStyle}>
                <CustomScrollBar>
                    {familiesData.length > 0 ? (
                        familiesData
                            .map((family, index) => ({ family, unreadAlertsCount: unreadAlertsCount[index] }))
                            .sort((a, b) => b.unreadAlertsCount - a.unreadAlertsCount)
                            .map(({ family, unreadAlertsCount }, index) => (
                                family && (
                                    <Pressable
                                        key={index}
                                        style={styles.familyButton}
                                        onPress={() => {
                                            console.log(`Pressed: ${family.surname}`);
                                            navigation.navigate('AlertsFromFamilyScreen', { family: family, email: email, username: username });
                                        }}
                                    >
                                        <Text style={styles.familyName}>{family.surname}</Text>
                                        {unreadAlertsCount !== 0 && (
                                            <View style={styles.alertCountContainer}>
                                                <Text style={styles.alertCountText}>{unreadAlertsCount}</Text>
                                            </View>
                                        )}
                                    </Pressable>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    headerContainer: {
        alignItems: 'center',
        padding: 16,
        width: '70%',
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
    alertMessage: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
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
    scrollBarStyle: {
        alignItems: 'center',
        height: '75%',
        width: '60%',
        padding: 16,
    },
    alertCountContainer: {
        position: 'absolute',
        bottom: -3,
        right: -8,
        backgroundColor: '#0470bd',
        borderRadius: 50,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    alertCountText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
});