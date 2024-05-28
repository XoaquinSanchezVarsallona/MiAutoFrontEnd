import React, { useRef, useState } from 'react';
import { Animated, ScrollView, View, StyleSheet } from 'react-native';

const CustomScrollBar = ({ children }) => {
    const [completeScrollBarHeight, setCompleteScrollBarHeight] = useState(1);
    const [visibleScrollBarHeight, setVisibleScrollBarHeight] = useState(0);
    const scrollIndicator = useRef(new Animated.Value(0)).current;

    const scrollIndicatorSize =
        completeScrollBarHeight > visibleScrollBarHeight
            ? (visibleScrollBarHeight * visibleScrollBarHeight) / completeScrollBarHeight
            : visibleScrollBarHeight;

    const difference =
        visibleScrollBarHeight > scrollIndicatorSize
            ? visibleScrollBarHeight - scrollIndicatorSize
            : 1;

    const scrollIndicatorPosition = Animated.multiply(
        scrollIndicator,
        visibleScrollBarHeight / completeScrollBarHeight,
    ).interpolate({
        extrapolate: 'clamp',
        inputRange: [0, difference],
        outputRange: [0, difference],
    });

    const onContentSizeChange = (_, contentHeight) =>
        setCompleteScrollBarHeight(contentHeight);

    const onLayout = ({
                          nativeEvent: {
                              layout: { height },
                          },
                      }) => {
        setVisibleScrollBarHeight(height);
    };

    return (
        <View style={styles.scrollContainer}>
            <ScrollView
                contentContainerStyle={{ paddingRight: 14 }}
                onContentSizeChange={onContentSizeChange}
                onLayout={onLayout}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollIndicator } } }],
                    { useNativeDriver: false },
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                style={styles.scrollViewContainer}
            >
                {children}
            </ScrollView>
            <View style={styles.customScrollBarBackground}>
                <Animated.View
                    style={[
                        styles.customScrollBar,
                        {
                            height: scrollIndicatorSize,
                            transform: [{ translateY: scrollIndicatorPosition }],
                        },
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexDirection: 'row',
        flex: 1,
        width: '50%',
    },
    scrollViewContainer: {
        paddingHorizontal: 10,
        width: '80%',
    },
    customScrollBar: {
        backgroundColor: '#33A1F1',
        borderRadius: 50,
        width: 20,
    },
    customScrollBarBackground: {
        backgroundColor: 'white',
        borderRadius: 50,
        height: '100%',
        width: 20,
    },
});

export default CustomScrollBar;
