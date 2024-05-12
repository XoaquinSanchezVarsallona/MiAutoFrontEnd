import React from 'react';
import { View, ImageBackground } from 'react-native';
import { waveform } from 'ldrs';

const LoadingScreen = () => {
    // Register the waveform component
    waveform.register();

    return (
        <ImageBackground source={require('../assets/BackgroundUnlocked.jpg')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <l-waveform size="60" stroke="3.5" speed="1" color="white" />
        </ImageBackground>
    );
};

export default LoadingScreen;