import {StyleSheet, View, Text, Button, ImageBackground, TextInput, Pressable} from 'react-native';
import StyledButton from "../../components/StyledButton";
import {useState} from "react";

export function AddNewFamily({ navigation }) {
    const [surname, setSurname] = useState('');
    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>MIAUTO</Text>
                <Text style={styles.title}>WELCOME TO ADD NEW FAMILY</Text>
                <Text style={styles.title}>Register a new Family</Text>
                <TextInput
                    style={styles.input}
                    placeholder="familyName"
                    value={username}
                    onChangeText={setSurname}
                />
                {/*ACA IRIA FUNCIÓN QUE REGISTRE AL USUARIO EN BASE DE DATOS */}
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