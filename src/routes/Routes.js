import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import LoginScreen from "../screens/LoginScreen";
import { StyleSheet } from 'react-native';
import NavDrawer from "../screens/NavigationDrawer";
import OrderScreen from '../screens/OrderScreen';
import OrderDetailScreen from '../screens/OrderDetailsScreen';
import PrimaryStockScreen from '../screens/PrimaryStockScreen';
import StockScreen from '../screens/StockScreen';

const Stack = createNativeStackNavigator();

function App(){
  
  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName='LoginScreen'>
        <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Nav" component={NavDrawer} headerLeft={null} gestureEnabled={false}options={{ headerShown: false }}/>
        <Stack.Screen name='PrimaryScreen' component={PrimaryStockScreen} options={{ headerShown: true }} />
        <Stack.Screen name='OrderScreen' component={OrderScreen} options={{ headerShown: true }} />
        <Stack.Screen name='Order Details' component={OrderDetailScreen} options={{ headerShown: true }} />
        <Stack.Screen name='StockList' component={StockScreen} options={{ headerShown: true }} />
      </Stack.Navigator>
    </NavigationContainer>

  );
  
}
  
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
    
export default App;


