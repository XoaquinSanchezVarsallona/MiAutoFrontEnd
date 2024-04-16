import {StyleSheet, View, Text, Button, ImageBackground} from 'react-native';
import StyledButton from "../../components/StyledButton";

export function AddNewVehicle({ navigation }) {
    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>MIAUTO</Text>
                <Text style={styles.title}>WELCOME TO ADD NEW VEHICLE</Text>
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
    title: {
        fontSize: 24,
            marginBottom: 30,
    },
});