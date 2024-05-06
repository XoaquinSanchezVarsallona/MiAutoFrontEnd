import { StyleSheet, View} from 'react-native';
import React from "react";

const RouteCard = ({ route }) => {
    return (
        <View style={styles.routeCard}>
            <Text>User: {route.user}</Text>
            <Text>Kilometre: {route.kilometre}</Text>
            <Text>Date: {route.date}</Text>
            <Text>Duration: {route.duration}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    routeCard: {
        backgroundColor: 'white',
        padding: 10,
        margin: 10,
        borderRadius: 10,
    },
});
export default RouteCard;