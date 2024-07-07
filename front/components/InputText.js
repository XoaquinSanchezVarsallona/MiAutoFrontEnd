import React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';

const InputText = ({ label, value, onChangeText, placeholder, multiline, secureTextEntry, backcolor= 'transparent' }) => {
    const [hovered, setHovered] = React.useState(false);

    const inputTextStyle = {
        ...styles.inputTextholder,
        backgroundColor: backcolor,
        color: backcolor === 'white' ? 'black' : 'white',
    };

    if (secureTextEntry) {
        return (
            <View
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={[styles.inputContainer, hovered && styles.inputContainerHovered]}
            >
                <Text style={styles.label}>{label}</Text>
                <TextInput
                    style={inputTextStyle}
                    onChangeText={onChangeText}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#FFFFFF80"
                    secureTextEntry={true}
                />
            </View>
        );
    }
    if (multiline) {
        return (
            <View
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={[styles.inputContainer, hovered && styles.inputContainerHovered]}
            >
                <Text style={styles.label}>{label}</Text>
                <TextInput
                    style={inputTextStyle}
                    onChangeText={onChangeText}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#FFFFFF80"
                    multiline={true}
                />
            </View>
        );
    }
    return (
        <View
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={[styles.inputContainer, hovered && styles.inputContainerHovered]}
        >
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={inputTextStyle}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#FFFFFF80"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        width: '20%',
        marginBottom: 20,
        alignSelf: 'center',
        transition: 'width 0.3s ease-in-out',
    },
    inputContainerHovered: {
        width: '21%',
    },
    label: {
        alignSelf: 'flex-start',
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    inputTextholder: {
        width: '100%',
        color: 'white',
        backgroundColor: 'transparent',
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
    },
});

export default InputText;
