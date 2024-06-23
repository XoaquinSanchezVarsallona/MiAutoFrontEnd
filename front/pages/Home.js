import {StyleSheet, View, Text, ImageBackground} from 'react-native';
import StyledButton from "../components/StyledButton";

export function Home({ navigation }) {
    return (
        <ImageBackground source={require('../assets/BackgroundLocked.jpg')} style={styles.container}>
            <Text style={styles.title}>Login as</Text>
            <View style={styles.buttonContainer}>
                <StyledButton
                    icon={require('../assets/car.png')}
                    text="Driver"
                    onPress={() => navigation.navigate('Login', { userType: 'driver' })}
                />
                <StyledButton
                    icon={require('../assets/hammer.png')}
                    text="Service"
                    onPress={() => navigation.navigate('Login', { userType: 'service' })}
                />
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
    header: {
        fontSize: 40,
        color: 'white',
        marginBottom: 60,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 90,
        position: 'absolute',
        top: 50,
        color: 'white',
        marginBottom: 60,
    },
    gradient: {
        flex: 1,
    },
    button: {
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row', // Align children in a row
        justifyContent: 'space-evenly', // Evenly distribute children across container's main axis
        alignItems: 'center', // Align children along the cross axis (in this case, vertically center)
        width: '100%', // Take up full width to allow even spacing
    },
});