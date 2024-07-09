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
    title: {
        fontSize: 90,
        position: 'absolute',
        top: 50,
        color: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: 100,
    },
});