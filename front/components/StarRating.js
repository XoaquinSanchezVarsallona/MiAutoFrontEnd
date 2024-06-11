import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StarRating = ({ rating }) => {
    const stars = [1, 2, 3, 4, 5].map((value) => {
        let starStyle = styles.emptyStar;
        if (value <= rating) {
            starStyle = styles.filledStar;
        }
        return <Text key={value} style={starStyle}>★</Text>;
    });

    return (
        <View style={styles.starContainer}>
            {stars}
        </View>
    );
}

const styles = StyleSheet.create({
    starContainer: {
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 5,
    },
    filledStar: {
        color: 'gold',
        fontSize: 20,
    },
    emptyStar: {
        color: 'gray',
        fontSize: 20,
    },
});

export default StarRating;
