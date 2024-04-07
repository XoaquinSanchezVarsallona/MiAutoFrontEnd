import {StyleSheet, View, Text, Button, Pressable} from 'react-native';
import StyledButton from "../component/StyledButton";
import StyledButton1 from "../component/StyledButton1";

export function Home({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login as</Text>
            <View style={styles.buttonContainer}>
                <StyledButton1
                    icon={require('../assets/car.png')} // Make sure the icon path is correct
                    onPress={() => navigation.navigate('Login', { userType: 'driver' })}
                />
                <StyledButton1

                    icon={require('../assets/hammer.png')} // Make sure the icon path is correct
                    onPress={() => navigation.navigate('Login', { userType: 'service' })}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 40,
        color: 'white',
        marginBottom: 60,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        color: 'black',
        marginBottom: 30,
    },
    button: {
        marginVertical: 10, //espacio entre botones
    },
    buttonContainer: {
        flexDirection: 'row', // Align children in a row
        justifyContent: 'space-evenly', // Evenly distribute children across container's main axis
        alignItems: 'center', // Align children along the cross axis (in this case, vertically center)
        width: '100%', // Take up full width to allow even spacing
    },
});