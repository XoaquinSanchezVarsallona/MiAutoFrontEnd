import React, {useEffect, useState} from 'react';
import {
    ImageBackground,
    Pressable,
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Button,
    TouchableOpacity
} from 'react-native';
import InputText from "../../../components/InputText";
import {Picker} from "react-native-web";
import StoreMapModal from "../../../components/map/StoreMapModal";
import {haversineDistance} from "../../../components/map/haversineDistance"
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomScrollBar from "../../../components/CustomScrollBar";

export function StoreUnlockedScreen({ navigation, route }) {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');
    const [tipoDeServicio, setServicios] = useState('Type of Service');
    const [modalVisible, setModalVisible] = useState(false);
    const [filteredStores, setFilteredStores] = useState(stores);
    const [centro, setCentro] = useState(null);

    const fetchUserLocation = async () => {
        try {
            const response = await fetch(`http://localhost:9002/user/${route.params.email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log("user data:", data)
                setCentro({ lat: data.domicilioLatitude, lng: data.domicilioLongitude });
            } else {
                console.log(`Failed to fetch user location`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const sortByService = async (service, stores) => {
        if (service === "rating") {
            fetchRating().then()
        }

        if (service === 'distance' && centro) {
            let list = stores.sort((a, b) => {
                const distanceA = haversineDistance(centro, {lat: a.domicilioLatitud, lng: a.domicilioLongitud});
                const distanceB = haversineDistance(centro, {lat: b.domicilioLatitud, lng: b.domicilioLongitud});
                return distanceA - distanceB;
            }); //llega bien las coordenadas, sortea bien, printea bien, pero no se guarda bien.
            console.log("imprimo lista dado distance, antes de savear")
            console.log(list);
            setStores(list);
            setServicios(service);
            setFilteredStores(list);
            console.log("imprimo lista dado distance, despues de savear")
            console.log(stores);
        } else if (service !== 'any') {
            let list = stores.filter(store => store.tipoDeServicio === service)
            setStores(list);
            setServicios(service);
            setFilteredStores(list);
            console.log("imprimo lista dado any")
            console.log(list);
        }
    }

    const handleInputChange = (field, value) => {
        fetchRating().then(r => sortByService(field, r))
        setServicios(prevState => ({
            ...prevState,
            [field]: value
        }));
        sortByService(field).then()
    };

    const fetchRating = async () => {
        try {
            const response = await fetch(`http://localhost:9002/getStoresByRating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json()
                setStores(data)
                return data
            }
            else console.log("There is a problem in fetchRating!")

        } catch (e) {
            console.log("There is a error in fetchRating: " + e.message)
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

    useEffect(() => {
        fetchUserLocation();
    }, []);

    const serviceOptions = [
        { value: 'any', label: 'Any' },
        { value: 'rating', label: 'Rating' },
        { value: 'mecanico', label: 'Mechanic' },
        { value: 'estacion de servicio', label: 'Service Station' },
        { value: 'lavadero', label: 'Car Wash' },
        { value: 'distance', label: 'Distance' }
    ];

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <Text style={styles.title}>Stores</Text>
            <View style={styles.controlContainer}>
                <InputText
                    placeholder="Search for stores"
                    value={search}
                    onChangeText={setSearch}
                />
                <Image
                    style={styles.icon}
                    source={require('../../../assets/lupa.png')}
                />
                <Picker
                    selectedValue={tipoDeServicio}
                    onValueChange={(itemValue) => handleInputChange(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Any" value="any" />
                    <Picker.Item label="Mechanic" value="mecanico" />
                    <Picker.Item label="Service Station" value="estacion de servicio" />
                    <Picker.Item label="Car Wash" value="lavadero" />
                    <Picker.Item label="Rating" value="rating" />
                    <Picker.Item label="Distance" value="distance" />
                </Picker>
                <TouchableOpacity style={styles.mapButton} onPress={() => setModalVisible(true)}>
                    <Icon name="map" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
            <CustomScrollBar>
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
            </CustomScrollBar>
            <StoreMapModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                navigation={navigation}
                stores={stores}
                centro={centro}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    controlContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '90%',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,

    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    contentContainerStyle: {
        alignItems: 'center',
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        overflow: 'visible',
        width: '15%',
        marginBottom: 20,
        alignSelf: 'center',
        zIndex: 9999,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
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
        width: '100%',
        textAlign: 'center',
        padding: 5,
    },
    icon: {
        marginLeft: 10,
        marginBottom: 15,
        width: 50,
        height: 50,
    },
    picker: {
        flex: 1,
        height: 40,
        marginRight: 10,
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
        borderColor: 'gray',
        borderRadius: 5,
        borderWidth: 1,
    },
    mapButton: {
        backgroundColor: '#1e90ff',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default StoreUnlockedScreen;