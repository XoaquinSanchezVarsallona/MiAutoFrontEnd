import React from "react";
import {Text, View, TextInput} from "react-native";
import {StyleSheet} from "react-native";

export function Register() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register Screen</Text>
            <TextInput
                style={styles.input}
                value={"Enter your email"}
                editable={true}
                inputMode={"email"}
            />
            <TextInput
                style={styles.input}
                value={"Enter your password"}
                editable={true}
                inputMode={"text"}
            />
            <TextInput
                style={styles.input}
                value={"Enter your name"}
                editable={true}
                inputMode={"text"}
            />
            <TextInput
                style={styles.input}
                value={"Enter your password"}
                editable={true}
                inputMode={"text"}
            />
            <TextInput
                style={styles.input}
                value={"Enter your location"}
                editable={true}
                inputMode={"text"}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, alignContent: "center",
    },
    title: {
        fontSize: 50,
        paddingBottom: 30,
    },
    input: {
        borderColor: "green",
        borderRadius: 10,
        borderBottomWidth: 2,

        marginBottom: 15,
        padding: 15,
        width: "70%"

    }

});