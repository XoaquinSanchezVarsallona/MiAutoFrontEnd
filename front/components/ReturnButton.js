import {Image, Pressable, StyleSheet, View} from 'react-native';

const ReturnButton = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()}>
                <Image source={require('../assets/arrow.png')} style={styles.arrowStyle} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    arrowStyle: {
        width: 50,
        height: 35,
    },
    container: {
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 20,
    },
});
export default ReturnButton;