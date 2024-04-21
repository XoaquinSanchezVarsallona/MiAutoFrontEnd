import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login} from "./pages/Login"
import {Register} from "./pages/Register"
import {Home} from "./pages/Home";
import {UnlockedScreenDriver} from "./pages/driverScreens/UnlockedScreenDriver";
import {AlertsScreen} from "./pages/alerts/AlertsScreen";
import {ConfigurationScreen} from "./pages/driverScreens/ConfigurationScreen";
import {FamilyProfile} from "./pages/driverScreens/FamilyProfile";
import {VehiclesScreen} from "./pages/driverScreens/VehiclesScreen";
import {AddNewVehicle} from "./pages/driverScreens/AddNewVehicle";
import {EditProfile} from "./pages/driverScreens/editProfile/EditProfile";
import {AuthContext, AuthProvider} from "./pages/AuthContext";
import {FamilyVehiclesScreen} from "./pages/driverScreens/FamilyVehiclesScreen";
import FamilyDetailsScreen from "./pages/driverScreens/FamilyDetailsScreen";
import AddFamilyScreen from "./pages/driverScreens/AddFamilyScreen";
import JoinFamilyScreen from "./pages/driverScreens/JoinFamilyScreen";

const Stack = createNativeStackNavigator(); //used to configure the screens

function AppNavigation() {
    //const { userToken } = useContext(AuthContext);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Home}/>
                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Register" component={Register}/>
                <Stack.Screen name="UnlockedScreenDriver" component={UnlockedScreenDriver}/>
                <Stack.Screen name="AlertsScreen" component={AlertsScreen}/>
                <Stack.Screen name="ConfigurationScreen" component={ConfigurationScreen}/>
                <Stack.Screen name="FamilyProfile" component={FamilyProfile}/>
                <Stack.Screen name="VehiclesScreen" component={VehiclesScreen}/>
                <Stack.Screen name="AddNewVehicle" component={AddNewVehicle}/>
                <Stack.Screen name="FamilyVehiclesScreen" component={FamilyVehiclesScreen}/>
                <Stack.Screen name="EditProfile" component={EditProfile}/>
                <Stack.Screen name="FamilyDetailsScreen" component={FamilyDetailsScreen}/>
                <Stack.Screen name="AddFamilyScreen" component={AddFamilyScreen}/>
                <Stack.Screen name="JoinFamilyScreen" component={JoinFamilyScreen}/>

            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppNavigation />
        </AuthProvider>
    );
}