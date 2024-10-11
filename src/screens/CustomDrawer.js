import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import AsyncStorage from '@react-native-async-storage/async-storage';


const CustomDrawer = (props) => {

  const navigation = useNavigation();

  const signOut = async () => {
  Alert.alert("Logging out", "You have been logged out."); 
  try {
    await AsyncStorage.clear();
    navigation.navigate('LoginScreen'); // Navigate to the login screen
  } catch (error) {
    console.error('Failed to clear async storage:', error);
  }
  };

  return (
    <View style={{flex:1}}>
       <View style={{backgroundColor: "cornflowerblue", height:58,flexDirection:'row' }}>
       <View style={{justifyContent:'center',alignContent:'center',flex:4}}>
              <Text style={{ color: "#fff",
                  fontSize: 18,
                   marginBottom: 5,
                   marginLeft:15
                 }}
              >
              JIVO WELLNESS 
            </Text>
        
          </View>
          <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
              <Image
                alt="Not find"
                source={require("./assets/nav_logo.png")}
                style={styles.image}/>
                </View>            
    </View>
    <View style={{ backgroundColor: "#fff" }}>
    <DrawerItemList {...props} />
     </View>        
         <View style={{ flex: 1, backgroundColor: "#fff" ,marginLeft :13 ,marginTop:10, }}>
     <Pressable
        onPress={signOut}> 
            <Text
                style={{
                  fontSize: 15,
                  marginLeft: 5,
                }}
              >
                Log Out
            </Text>

    </Pressable>
    </View>      
  </View>
  );
};
  
export default CustomDrawer;

const styles = StyleSheet.create({

  image: {
   width:45,
   height:45
  },
  switchTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 7,
    paddingVertical: 5,
  },
  switchTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 7,
    paddingVertical: 5,
  },
  preferences: {
    fontSize: 16,
    color: "#ccc",
    paddingTop: 10,
    fontWeight: "500",
    paddingLeft: 20,
  },
  switchText: {
    fontSize: 17,
    color: "",
    paddingTop: 10,
    fontWeight: "bold",
  },
});
