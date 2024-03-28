import React from "react";
import {Text, View} from "react-native";
import {StyleSheet} from "react-native";
import {ButtonStyled} from './components/Button.js'

export function Home({navigation}) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido!</Text>
            <ButtonStyled({navigation}, "LoginScreen")/>
            <ButtonStyled({navigation}, "RegisterScreen")/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignContent: "center",
        padding: "auto",

    },
    title: {
        fontSize: 30,
        fontWeight: "bold",

        color: "black",

        alignContent: "center",
        paddingBottom: 20,
        paddingTop: 10,
        flex: 1,

    },
    button: {
        color: "#000",
        fontSize: 10,
        width: "50%",
        height: 50
    }

});

export class Home {
}