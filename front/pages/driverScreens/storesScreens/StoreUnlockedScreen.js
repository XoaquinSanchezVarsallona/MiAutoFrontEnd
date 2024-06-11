import React, {useEffect, useState} from 'react';
import {ImageBackground, Pressable, StyleSheet, Text, View, ScrollView, TextInput, Button} from 'react-native';

export function StoreUnlockedScreen({ navigation, route }) {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');

    const fetchByRating = async () => {
        try {
            const response = await fetch('http://localhost:9002/getStoresByRating' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response
                setStores(await data.json())
            }
            else {
                console.log("There was a problem in fetchByRating, status " + response.status)
            }
        }
        catch (e) {
            console.log("There was an error in fetchByRating: " + e.message)
        }
    }

    const fetchStores = async () => {
        try {
            const response = await fetch(`http://localhost:9002/fetchAllStores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: route.params.email}),
            });
            if (response.ok) {
                return await response.json();
            } else {
                console.log(`Failed to fetch stores`);
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchStores()
            .then(fetchedStores => {
                console.log('Fetched stores:', fetchedStores);
                setStores(fetchedStores);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => { }, [stores]);

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Stores</Text>
            </View>
            <TextInput
                style={styles.input}
                onChangeText={setSearch}
                value={search}
                placeholder="Search for stores"
            />
            <Button title={"Stores by rating"} onPress={fetchByRating}/>
            <ScrollView style={styles.storesList}>
                {stores != null && stores.length > 0 ? (
                    stores.filter(store => store.storeName.startsWith(search)).map((store, index) => (
                        <Pressable
                            key={index}
                            style={styles.storeButton}
                            onPress={() => {
                                navigation.navigate('VisualStoreProfile', { store: store });
                            }}
                        >
                            <Text style={styles.storeName}>{store.storeName}</Text>
                        </Pressable>
                    ))
                ) : (
                    <Text style={styles.noStoresText}>No stores available</Text>
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 20,
        padding: 10,
        color: 'white',
        width: '80%',
    },
    storesList: {
        flex: 1,
        width: '80%',
        marginBottom: 20,
    },
    storeButton: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
        alignSelf: 'center',
    },
    storeName: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
    },
    noStoresText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
});