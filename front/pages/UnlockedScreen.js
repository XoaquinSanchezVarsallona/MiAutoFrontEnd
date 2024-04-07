import {StyleSheet, View, Text, Button, Pressable} from 'react-native';

export function UnlockedScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>MIAUTO</Text>
            <Text style={styles.title}>WELCOME</Text>
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
},);