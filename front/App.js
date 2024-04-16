import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login} from "./pages/Login"
import {Register} from "./pages/Register"
import {Home} from "./pages/Home";
import {UnlockedScreenDriver} from "./pages/driverScreens/UnlockedScreenDriver";
import {AlertsScreen} from "./pages/driverScreens/AlertsScreen";
import {ConfigurationScreen} from "./pages/driverScreens/ConfigurationScreen";
import {FamilyProfile} from "./pages/driverScreens/FamilyProfile";
import {VehiclesScreen} from "./pages/driverScreens/VehiclesScreen";
import {AddNewVehicle} from "./pages/driverScreens/AddNewVehicle";
import {AddNewFamily} from "./pages/driverScreens/AddNewFamily";
import {EditProfile} from "./pages/driverScreens/editProfile/EditProfile";

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
                <Stack.Screen name="FamilyProfile" component={FamilyProfile}/>
                <Stack.Screen name="VehiclesScreen" component={VehiclesScreen}/>
                <Stack.Screen name="AddNewVehicle" component={AddNewVehicle}/>
                <Stack.Screen name="AddNewFamily" component={AddNewFamily}/>
                <Stack.Screen name="EditProfile" component={EditProfile}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}