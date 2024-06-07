import React, {useEffect, useState} from 'react';
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
import {AlertScreen} from "./pages/driverScreens/alertsScreens/AlertsScreen";
import {AddAlertScreen} from "./pages/driverScreens/addEntityScreens/AddAlertScreen";
import {AlertsFromFamilyScreen} from "./pages/driverScreens/alertsScreens/AlertsFromFamilyScreen";
import VehicleProfile from "./pages/driverScreens/vehicleScreens/VehicleProfile";
import {EditCarProfile} from "./pages/driverScreens/editProfile/EditCarProfile";
import {UnlockedScreenService} from "./pages/serviceScreens/UnlockedScreenService";
import {AddNewStore} from "./pages/serviceScreens/AddNewStore";
import StoreProfile from "./pages/serviceScreens/StoreProfile";
import {EditStoreProfile} from "./pages/serviceScreens/EditStoreProfile";
import {PaperProvider} from "react-native-paper";
import {ViewProfile} from "./pages/driverScreens/ViewProfile";
import {VehicleRoutes} from "./pages/driverScreens/vehicleScreens/VehicleRoutes";
import {StoreUnlockedScreen} from "./pages/driverScreens/storesScreens/StoreUnlockedScreen";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import AddNewRoute from "./pages/driverScreens/addEntityScreens/AddNewRoute";
import {ViewRoutes} from "./pages/driverScreens/routeScreens/ViewRoutes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from './pages/LoadingScreen';
import {EditRoute} from "./pages/driverScreens/routeScreens/EditRoute";
import {EditVisualStoreProfile} from "./pages/serviceScreens/EditVisualStoreProfile";
import {VisualStoreProfile} from "./pages/driverScreens/storesScreens/VisualStoreProfile";
import {EditPapers} from "./pages/driverScreens/editProfile/EditPapers"
import AccidentInformation from "./pages/driverScreens/vehicleScreens/AccidentInformation";
import {NotificationProvider} from "./components/notification/NotificationProvider";
import AppNotification from "./components/notification/AppNotification";
import {ServiceConfigurationScreen} from "./pages/serviceScreens/serviceConfiguration/ServiceConfigurationScreen";
import {ServiceEditProfile} from "./pages/serviceScreens/serviceConfiguration/ServiceEditProfile";
import {ServiceViewProfile} from "./pages/serviceScreens/serviceConfiguration/ServiceViewProfile";
import {DisplayPapers} from "./pages/driverScreens/vehicleScreens/DisplayPapers";
import {VehicleCharts} from "./pages/driverScreens/vehicleScreens/VehicleCharts";


const Stack = createNativeStackNavigator(); //used to configure the screens

function AppNavigation() {
    // const { userToken } = useContext(AuthContext);
    let [fontsLoaded] = useFonts({
        'Vidaloka-Regular': require('./assets/fonts/Vidaloka-Regular.ttf'),
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userType, setUserType] = useState('');

    useEffect(() => {
        async function checkToken() {
            const userToken = await AsyncStorage.getItem('userToken');
            const expirationTime = await AsyncStorage.getItem('expirationTime');
            const email = await AsyncStorage.getItem('userEmail');
            setUserType(await AsyncStorage.getItem('userType'));

            if (!userToken || !expirationTime || new Date().getTime() > Number(expirationTime)) {
                setIsAuthenticated(false);
            } else {
                setIsAuthenticated(true);
                setUserEmail(email);
            }
            setIsLoading(false);
        }

        checkToken().then();
    }, []);

    if (!fontsLoaded || isLoading) {
        return <LoadingScreen />
    }


    return (
        <NotificationProvider>
            <AppNotification />
            <LocalizationProvider datxeAdapter={AdapterDayjs}>
                <PaperProvider>
                    <NavigationContainer>
                        <Stack.Navigator initialRouteName={isAuthenticated ? (userType === 'driver' ? "UnlockedScreenDriver" : "UnlockedScreenService") : "Home"}>
                            {isAuthenticated ? (
                                <>
                                    <Stack.Screen name="Home" component={Home}/>
                                    <Stack.Screen name="Login" component={Login}/>
                                    <Stack.Screen name="Register" component={Register}/>
                                    <Stack.Screen name="UnlockedScreenDriver" component={UnlockedScreenDriver} initialParams={{ email: userEmail }} />
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
                                    <Stack.Screen name="ViewProfile" component={ViewProfile}/>
                                    <Stack.Screen name="UnlockedScreenService" component={UnlockedScreenService}/>
                                    <Stack.Screen name="AddNewStore" component={AddNewStore}/>
                                    <Stack.Screen name="StoreProfile" component={StoreProfile}/>
                                    <Stack.Screen name="EditStoreProfile" component={EditStoreProfile}/>
                                    <Stack.Screen name="EditVisualStoreProfile" component={EditVisualStoreProfile}/>
                                    <Stack.Screen name="StoreUnlockedScreen" component={StoreUnlockedScreen}/>
                                    <Stack.Screen name="VisualStoreProfile" component={VisualStoreProfile}/>
                                    <Stack.Screen name="VehicleRoutes" component={VehicleRoutes}/>
                                    <Stack.Screen name="AddNewRoute" component={AddNewRoute}/>
                                    <Stack.Screen name="ViewRoutes" component={ViewRoutes}/>
                                    <Stack.Screen name="EditRoute" component={EditRoute}/>
                                    <Stack.Screen name="AccidentInformation" component={AccidentInformation}/>
                                    <Stack.Screen name="EditPapers" component={EditPapers}/>
                                    <Stack.Screen name="ServiceConfigurationScreen" component={ServiceConfigurationScreen}/>
                                    <Stack.Screen name="ServiceViewProfile" component={ServiceViewProfile}/>
                                    <Stack.Screen name="ServiceEditProfile" component={ServiceEditProfile}/>
                                    <Stack.Screen name="DisplayPapers" component={DisplayPapers}/>
                                    <Stack.Screen name="VehicleCharts" component={VehicleCharts}/>
                                </>
                            ) : (
                                <>
                                    <Stack.Screen name="Home" component={Home}/>
                                    <Stack.Screen name="Login" component={Login}/>
                                    <Stack.Screen name="Register" component={Register}/>
                                    <Stack.Screen name="UnlockedScreenDriver" component={UnlockedScreenDriver} initialParams={{ email: userEmail }} />
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
                                    <Stack.Screen name="ViewProfile" component={ViewProfile}/>
                                    <Stack.Screen name="UnlockedScreenService" component={UnlockedScreenService}/>
                                    <Stack.Screen name="AddNewStore" component={AddNewStore}/>
                                    <Stack.Screen name="StoreProfile" component={StoreProfile}/>
                                    <Stack.Screen name="EditStoreProfile" component={EditStoreProfile}/>
                                    <Stack.Screen name="EditVisualStoreProfile" component={EditVisualStoreProfile}/>
                                    <Stack.Screen name="StoreUnlockedScreen" component={StoreUnlockedScreen}/>
                                    <Stack.Screen name="VisualStoreProfile" component={VisualStoreProfile}/>
                                    <Stack.Screen name="VehicleRoutes" component={VehicleRoutes}/>
                                    <Stack.Screen name="AddNewRoute" component={AddNewRoute}/>
                                    <Stack.Screen name="ViewRoutes" component={ViewRoutes}/>
                                    <Stack.Screen name="EditRoute" component={EditRoute}/>
                                    <Stack.Screen name="AccidentInformation" component={AccidentInformation}/>
                                    <Stack.Screen name="EditPapers" component={EditPapers}/>
                                    <Stack.Screen name="ServiceConfigurationScreen" component={ServiceConfigurationScreen}/>
                                    <Stack.Screen name="ServiceViewProfile" component={ServiceViewProfile}/>
                                    <Stack.Screen name="ServiceEditProfile" component={ServiceEditProfile}/>
                                    <Stack.Screen name="DisplayPapers" component={DisplayPapers}/>
                                    <Stack.Screen name="VehicleCharts" component={VehicleCharts}/>
                                </>
                            )}
                        </Stack.Navigator>
                    </NavigationContainer>
                </PaperProvider>
            </LocalizationProvider>
        </NotificationProvider>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppNavigation />
        </AuthProvider>
    );
}