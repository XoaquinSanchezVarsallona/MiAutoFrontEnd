import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);


    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    setUserToken(token);
                    console.log('Token loaded from AsyncStorage:', token);
                }
            } catch (e) {
                console.error('Failed to load token:', e);
            }
        };

        bootstrapAsync();
    }, [userToken]);

    const authContext = {
        signIn: async (token) => {
            await AsyncStorage.setItem('userToken', token); // Use await to ensure this completes.
            setUserToken(token); // This updates the state asynchronously.
            console.log('Token stored in AsyncStorage:', token);

            // Set a timer for automatic sign-out (Consider moving this to a more centralized location)
            setTimeout(async () => {
                console.log('Token expired, user signed out.');
                setUserToken(null);
                await AsyncStorage.removeItem('userToken');
            }, 1000 * 60 * 60 * 2); // 2 hours
        }
        // ... other context methods
    };


    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
};
