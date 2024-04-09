import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login} from "./pages/Login"
import {Register} from "./pages/Register"
import {Home} from "./pages/Home";
import {UnlockedScreenDriver} from "./pages/driverScreens/UnlockedScreenDriver";
import {AlertsScreen} from "./pages/driverScreens/AlertsScreen";
import {ConfigurationScreen} from "./pages/driverScreens/ConfigurationScreen";
import {ProfileScreen} from "./pages/driverScreens/ProfileScreen";
import {VehiclesScreen} from "./pages/driverScreens/VehiclesScreen";
export default function App() {
    const Stack = createNativeStackNavigator(); //used to configure the screens

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Home}/>
                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Register" component={Register}/>
                <Stack.Screen name="UnlockedScreen" component={UnlockedScreenDriver}/>
                <Stack.Screen name="AlertsScreen" component={AlertsScreen}/>
                <Stack.Screen name="ConfigurationScreen" component={ConfigurationScreen}/>
                <Stack.Screen name="ProfileScreen" component={ProfileScreen}/>
                <Stack.Screen name="VehiclesScreen" component={VehiclesScreen}/>

            </Stack.Navigator>
        </NavigationContainer>
    );
}