import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import { StyleSheet} from 'react-native';
import Routes from "./src/routes/Routes";

function App(){
  return (
    <Routes/>
  );
}

// const Stack = createStackNavigator();

// function App(): React.JSX.Element {
//   return (

//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="LoginScreen" component={LoginScreen} />
//         <Stack.Screen name='LoginScreen' component={LoginScreen} />
//         <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }} />
//       </Stack.Navigator>
//     </NavigationContainer>

//   );       
// }

export default App;





