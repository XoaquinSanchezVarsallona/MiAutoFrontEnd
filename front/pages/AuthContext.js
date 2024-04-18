import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        // Check the token on app start and set it if one exists
        const bootstrapAsync = async () => {
            let token;
            try {
                //si todavia no pasaron las dos horas, lo va a encontrar y el usuario no tendrá q loggearse de nuevo
                token = await AsyncStorage.getItem('userToken');
            } catch (e) {
                console.error('Failed to load token', e);
            }
            if (token) {
                setUserToken(token);
            }
        };

        bootstrapAsync().then(r => console.log('Token loaded:', r));
    }, []);

    const authContext = {
        signIn: (token) => {
            return new Promise((resolve) => {
                setUserToken(token); // This will asynchronously update the userToken
                AsyncStorage.setItem('userToken', token).then(() => {
                    console.log('Token stored in AsyncStorage:', token);
                    // Setup timeout to clean up the token later
                    setTimeout(async () => {
                        console.log('Token expired, user signed out.');
                        setUserToken(null);
                        await AsyncStorage.removeItem('userToken');
                    }, 1000 * 60 * 60 * 2); // 2 hours
                    resolve(); // Resolve the promise after setting the token
                });
            });
        },
        // ... other context methods
    };


    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
};
