import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, ImageBackground, StatusBar} from 'react-native';
import StyledButton from "../../components/StyledButton";
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import StyledButton2 from "../../components/StyledButton2";
import StyledButton4 from "../../components/StyledButton4";
import LoadingScreen from "../LoadingScreen";
import * as PropTypes from "prop-types";
import StyledButtonWithAddOn from "../../components/StyledButtonWithAddOn";
import NotificationsPopUp from '../../components/NotificationsPopUp';
import VanishText from "../../components/VanishText";
StyledButtonWithAddOn.propTypes = {
    onPress: PropTypes.func,
    icon: PropTypes.any,
    text: PropTypes.string
};

export function UnlockedScreenDriver({ navigation, route, children }) {
    const { email } = route.params;
    const [username, setUsername] = useState('');
    const [familias, setFamilies] = useState([]);
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [AllUnreadAlertsCount, setAllUnreadAlertsCount] = useState(0);
    const isFocused = useIsFocused();

    // UseEffect tiene el objetivo de obtener el username en base al email
    useFocusEffect(
        React.useCallback(() => {
            const fetchAndSetUser = async () => {
                try {
                    const response = await fetch(`http://localhost:9002/user/${email}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    setUsername(data.username);
                    console.log('Fetched user:', data.username);
                    setFamilies(data.familias);
                    console.log('Fetched families:', data.familias);
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAndSetUser().then();
        }, [])
    );

    const countUnreadAlerts = async (familyId) => {
        try {
            const response = await fetch(`http://localhost:9002/alerts/unreadAlertsWithId/${familyId}`, {
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

    const fetchUnreadAlertsCount = async () => {
        const counts = await Promise.all(familias.map(family => countUnreadAlerts(family)));
        const totalUnreadAlertsCount = counts.reduce((a, b) => a + b, 0);
        setAllUnreadAlertsCount(totalUnreadAlertsCount);
    };

    useEffect(() => {
        fetchUnreadAlertsCount().then();
    }, [isFocused, familias])

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.header}>
                <StyledButton2 style={styles.configurationButton}
                               icon={require('../../assets/configuration.png')}
                               onPress={() => navigation.navigate('ConfigurationScreen')}
                />
                <StyledButton2 style={styles.notificationButton}
                               icon={require('../../assets/notification.png')}
                               onPress={() => setIsNotificationVisible(true)}
                />
                <Text style={styles.headerTitle}>MIAUTO</Text>
                <View style={styles.subTitle}>
                    <VanishText username={username} />
                </View>
                <View style={styles.buttonRow}>
                    <StyledButtonWithAddOn
                        unreadAlertsCount={AllUnreadAlertsCount}
                        icon={require('../../assets/alert.png')}
                        onPress={() => navigation.navigate('AlertsScreen', { families: familias, email: email, username: username } )}
                        text={'Alerts'}
                    />

                    <StyledButton
                        icon={require('../../assets/hammer.png')}
                        onPress={() => navigation.navigate('StoreUnlockedScreen', { email: email, username: username } )}
                        text={'Stores'}
                    />

                    <StyledButton4
                        icon={require('../../assets/family.png')}
                        onPress={() => navigation.navigate('FamilyProfile', { families: familias, email: email, username: username } )}
                        text={'Families'}
                    />

                    <StyledButton
                        icon={require('../../assets/car.png')}
                        onPress={() => {
                            if (familias.length === 0) {
                                navigation.navigate('VehiclesScreen', { username: username });
                            } else {
                                navigation.navigate('FamilyVehiclesScreen', { families: familias });
                            }
                        }}
                        text={'Vehicles'}
                    />
                </View>
            </View>
                {children}
            <NotificationsPopUp
                isVisible={isNotificationVisible}
                onClose={() => setIsNotificationVisible(false)}
                email={email}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        paddingTop: 5,
        alignItems: 'center',
        width: '100%',
    },
    headerTitle: {
        marginLeft: 36,
        fontFamily: 'Vidaloka-Regular',
        fontSize: 125,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 10,
    },
    configurationButton: {
        position: 'absolute',
        right: 10,
        top: 0,
        paddingRight: 15,
        padding: 30,
    },
    notificationButton: {
        position: 'absolute',
        right: 110,
        top: 0,
        padding: 30,
    },
    subTitle: {
        width: '40%',
        padding: 25,
    },
    icon: {
        width: 100,
        height: 100,
        marginVertical: 30,
    },
    buttonRow: {
        width: '80%',
        paddingTop: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
