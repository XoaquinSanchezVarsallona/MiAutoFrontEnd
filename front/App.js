import React from 'react';
import {useFonts} from 'expo-font';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login} from "./pages/Login"
import {Register} from "./pages/Register"
import {Home} from "./pages/Home";
import {UnlockedScreenDriver} from "./pages/driverScreens/UnlockedScreenDriver";
import {ConfigurationScreen} from "./pages/driverScreens/ConfigurationScreen";
import {FamilyProfile} from "./pages/driverScreens/familyScreens/FamilyProfile";
import {VehiclesScreen} from "./pages/driverScreens/vehicleScreens/VehiclesScreen";
import {AddNewVehicle} from "./pages/driverScreens/addEntityScreens/AddNewVehicle";
import {EditProfile} from "./pages/driverScreens/editProfile/EditProfile";
import {AuthProvider} from "./pages/AuthContext";
import {FamilyVehiclesScreen} from "./pages/driverScreens/familyScreens/FamilyVehiclesScreen";
import FamilyDetailsScreen from "./pages/driverScreens/familyScreens/FamilyDetailsScreen";
import AddFamilyScreen from "./pages/driverScreens/addEntityScreens/AddFamilyScreen";
import JoinFamilyScreen from "./pages/driverScreens/familyScreens/JoinFamilyScreen";
import {AlertScreen} from "./pages/alerts/AlertsScreen";
import {AddAlertScreen} from "./pages/alerts/AddAlertScreen";
import {AlertsFromFamilyScreen} from "./pages/alerts/AlertsFromFamilyScreen";
import VehicleProfile from "./pages/driverScreens/vehicleScreens/VehicleProfile";
import {EditCarProfile} from "./pages/driverScreens/editProfile/EditCarProfile";
import {UnlockedScreenService} from "./pages/serviceScreens/UnlockedScreenService";
import {AddNewStore} from "./pages/serviceScreens/AddNewStore";
import StoreProfile from "./pages/serviceScreens/StoreProfile";
import {EditStoreProfile} from "./pages/serviceScreens/EditStoreProfile";
import {PaperProvider} from "react-native-paper";

const Stack = createNativeStackNavigator(); //used to configure the screens

function AppNavigation() {
    //const { userToken } = useContext(AuthContext);
    let [fontsLoaded] = useFonts({
        'Vidaloka-Regular': require('./assets/fonts/Vidaloka-Regular.ttf'),
    });
    if (!fontsLoaded) {
        return null; // or a loading screen
    }
    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen name="Home" component={Home}/>
                    <Stack.Screen name="Login" component={Login}/>
                    <Stack.Screen name="Register" component={Register}/>
                    <Stack.Screen name="UnlockedScreenDriver" component={UnlockedScreenDriver}/>
                    <Stack.Screen name="AlertsScreen" component={AlertScreen}/>
                    <Stack.Screen name="ConfigurationScreen" component={ConfigurationScreen}/>
                    <Stack.Screen name="FamilyProfile" component={FamilyProfile}/>
                    <Stack.Screen name="VehiclesScreen" component={VehiclesScreen}/>
                    <Stack.Screen name="AddNewVehicle" component={AddNewVehicle}/>
                    <Stack.Screen name="FamilyVehiclesScreen" component={FamilyVehiclesScreen}/>
                    <Stack.Screen name="EditProfile" component={EditProfile}/>
                    <Stack.Screen name="FamilyDetailsScreen" component={FamilyDetailsScreen}/>
                    <Stack.Screen name="AddFamilyScreen" component={AddFamilyScreen}/>
                    <Stack.Screen name="JoinFamilyScreen" component={JoinFamilyScreen}/>
                    <Stack.Screen name="AddAlertScreen" component={AddAlertScreen}/>
                    <Stack.Screen name="AlertsFromFamilyScreen" component={AlertsFromFamilyScreen}/>
                    <Stack.Screen name="VehicleProfile" component={VehicleProfile}/>
                    <Stack.Screen name="EditCarProfile" component={EditCarProfile}/>
                    <Stack.Screen name="UnlockedScreenService" component={UnlockedScreenService}/>
                    <Stack.Screen name="AddNewStore" component={AddNewStore}/>
                    <Stack.Screen name="StoreProfile" component={StoreProfile}/>
                    <Stack.Screen name="EditStoreProfile" component={EditStoreProfile}/>
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppNavigation />
        </AuthProvider>
    );
}