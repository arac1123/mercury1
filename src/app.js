import { StatusBar } from 'expo-status-bar';
import React, { createElement } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import HomeRoute from "../src/routes/component/home";
import DriverchooseRoute from './routes/component/driverchoose';
import { styles } from './Allstyles';
import { createStackNavigator } from '@react-navigation/stack';
import ManagerchooseRoute from './routes/component/managerchoose';
import { useState } from 'react';
import { Provider } from 'react-redux';
import drivermodel from '../src/models/drivermodel';
import DriconnectRoute from "../src/routes/component/driconnect";
import ManagerficRoute from './routes/component/managerfic';
import { create } from 'dva-core';
import managermodel from './models/managermodel';
import LicensechooseRoute from './routes/component/licensechoose';
import licensemodel from './models/licensemodel';
import LicenseaddRoute from './routes/component/licenseadd';
import Situationlicchoose from './routes/component/situationlicchoose';
import Recordchoose from './routes/component/recordchoose';
import managerownmodel from './models/managerownmodel';
import recordmodel from './models/recordmodel';
import violationRoute from './routes/component/violation';
const Stack = createStackNavigator();

const app = create();
app.model(drivermodel);
app.model(managermodel);
app.model(licensemodel);
app.model(managerownmodel);
app.model(recordmodel);
app.start();

const store=app._store;
export default function App() {
    return(
      <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeRoute} options={{headerShown:false}} />
          <Stack.Screen name="Driverchoose" component={DriverchooseRoute} options={{headerShown:false}}/>
          <Stack.Screen name="Managerchoose" component={ManagerchooseRoute} options={{headerShown:false}}/>
          <Stack.Screen name="Driconnect" component={DriconnectRoute} options={{headerShown:false}} />
          <Stack.Screen name="Managerfic" component={ManagerficRoute} options={{headerShown:false}} />
          <Stack.Screen name="Licensechoose" component={LicensechooseRoute} options={{headerShown:false}} />
          <Stack.Screen name="Licenseadd" component={LicenseaddRoute} options={{headerShown:false}} />
          <Stack.Screen name="Situationlicchoose" component={Situationlicchoose} options={{headerShown:false}} />
          <Stack.Screen name="Recordchoose" component={Recordchoose} options={{headerShown:false}}/>
          <Stack.Screen name="Violation" component={violationRoute} options={{headerShown:false}}/>

        </Stack.Navigator>


      </NavigationContainer>      
      </Provider>
    )
    };
