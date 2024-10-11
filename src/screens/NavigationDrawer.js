import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Button } from 'react-native';
import HomeScreen from "./HomScreen";
import OrderScreen from "./OrderScreen";
import CustomDrawer from "./CustomDrawer";
import PrimaryStockScreen from "./PrimaryStockScreen";
import StockScreen from "./StockScreen";
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import Grivences from "./Grivences";


const Drawer = createDrawerNavigator();

export default function NavDrawer() {
  
  return (

    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />} options={{
        drawerIcon: ({ color, size }) => (
          <Icon name="menu" color={color} size={size} /> // Set your custom icon here
        ),}}>
      <Drawer.Screen name="Dashboard" component={HomeScreen} headert />
      <Drawer.Screen name="Orders" component={OrderScreen} />
      <Drawer.Screen name="Primary Stock" component={PrimaryStockScreen} />
      <Drawer.Screen name="Stock List" component={StockScreen} />
      <Drawer.Screen name="Grivences" component={Grivences} />
    </Drawer.Navigator>

  );
}

