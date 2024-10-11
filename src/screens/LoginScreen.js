import React, { useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Alert,TextInput,SafeAreaView,BackHandler,Pressable,ActivityIndicator } from 'react-native';
import { useState } from "react";
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
  
const LoginScreen= ({navigation})=>{

  const [username,setUsername]=  useState("");
  const [password,setPassword]=  useState("");
  const [showProgress, setShowProgress] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const refreshLoginState = async () => {
        await AsyncStorage.clear(); 
      };
      refreshLoginState();
      setUsername("");
      setPassword("");
      return () => {
        // Clean-up function if needed
      };
    }, [])
  );

  useEffect(()=>{
   
    const handleBackPress = () => {
      Alert.alert(
        'Exit App',
        'Do you really want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              BackHandler.exitApp(); // Exit the app
            },
          },
        ],
        { cancelable: false }
      );
      return true; 
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };

  },[]);

  const increaseProgress = () => {
    setShowProgress(true);
  };

  const checkTextInput = () => {
    
    if (!username?.trim()) {
      Snackbar.show({
        text: 'Please enter name',
        duration: Snackbar.LENGTH_SHORT,
      });
      return; 
    }
     
    if (!password.trim()) {
      Snackbar.show({
        text: 'Please enter password',
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }else{
      increaseProgress(); 
      login()
    }
    
  };

  const login = () => {
        
    return fetch('http://192.168.1.249:90/Accounts/DistributorLogin?username='+username+'&password='+password,{
      method: 'POST',
      headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
     },
    })  
    .then(response => response.json())
      .then(json => {
       // console.log(json.userName===(username));
        if(json.distId!=0){
          setShowProgress(false);
          return storeUser(json);
        }else{
          setShowProgress(false);
          Snackbar.show({
            text: 'Please check username and password',
            duration: Snackbar.LENGTH_SHORT,
          });
          
        }
      })
      .catch(error => {
        console.error(error);
    });

  };

  const storeUser = async (json) => {

    try {
      await AsyncStorage.setItem("distId", JSON.stringify(json['distId']));
      await AsyncStorage.setItem("distName", JSON.stringify(json['distName']));
      navigation.navigate("Nav");
     } catch (error) {
      console.log(error);
     }
     
  };

  return (
          
      <SafeAreaView style={styles.container}>

          <Text style={styles.title}>Login</Text>

            <View style={styles.inputView}>
               <TextInput style={styles.input} maxLength={10} keyboardType="numeric" placeholder='MOBILE' value={username} onChangeText={(value) => setUsername(value)} autoCorrect={false} autoCapitalize='none' placeholderTextColor="#000000" />
               <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry value={password} onChangeText={(value) => setPassword(value)} autoCorrect={false} autoCapitalize='none' placeholderTextColor="#000000"/>
            </View>
             
            <View style={styles.rememberView}>
              {/* <View style={styles.switch}>
                <Switch  value={click} onValueChange={setClick} trackColor={{true : "green" , false : "gray"}} />
                <Text style={styles.rememberText}>Remember Me</Text>
               </View> */}
             <View>
                {/* <Pressable onPress={() => Alert.alert("Forget Password!")}>
                    <Text style={styles.forgetText}>Forgot Password?</Text>
                </Pressable> */}
             </View>
            </View>

            <View style={styles.buttonView}> 
             
              <Pressable style={styles.button} onPress={()=> checkTextInput()} >
                <Text style={styles.buttonText}>LOGIN</Text>
              </Pressable>   
                   
            </View>

          {/* <Text style={styles.footerText}>Don't Have Account?<Text style={styles.signup}>  Sign Up</Text></Text> */}
      
          {showProgress && (
       <ActivityIndicator size="large" />
      )}
      </SafeAreaView>
  
  );
  
} 
    
const styles = StyleSheet.create({

    container : {
      flex: 1,
      flexDirection: 'column',
      alignItems : "center",
      justifyContent:"center",
    },
    image : {
      height : 160,
      width : 170
    },
    title : {
      fontSize : 30,
      fontWeight : "bold",
      textTransform : "uppercase",
      textAlign: "center",
      paddingVertical : 40,
      color : "cornflowerblue"
    },
    inputView : {
      gap : 15,
      width : "100%",
      paddingHorizontal : 40,
      marginBottom  :5
    },
    input : {
      height : 50,
      color : "cornflowerblue",
      paddingHorizontal : 20,
      borderColor : "cornflowerblue",
      borderWidth : 1,
      borderRadius: 7
    },
    rememberView : {
      width : "100%",
      paddingHorizontal : 50,
      justifyContent: "space-between",
      alignItems : "center",
      flexDirection : "row",
      marginBottom : 8
    },
    rememberText : {
      fontSize: 13
    },
    forgetText : {
      fontSize : 11,
      color : "red"
    },
    button : {
      backgroundColor : "cornflowerblue",
      height : 45,
      borderColor : "gray",
      borderWidth  : 1,
      borderRadius : 5,
      alignItems : "center",
      justifyContent : "center"
    },
    buttonText : {
      color : "white"  ,
      fontSize: 18,
      fontWeight : "bold"
    }, 
    buttonView :{
      width :"100%",
      paddingHorizontal : 50
    },
    optionsText : {
      textAlign : "center",
      paddingVertical : 10,
      color : "gray",
      fontSize : 13,
      marginBottom : 6
    },
    mediaIcons : {
      flexDirection : "row",
      gap : 15,
      alignItems: "center",
      justifyContent : "center",
      marginBottom : 23
    },
    icons : {
      width : 40,
      height: 40,
    },
    footerText : {
      marginTop:30,
      textAlign: "center",
      color : "gray",
    },
    signup : {
      color : "red",
      fontSize : 13
    }

})

export default LoginScreen;
  