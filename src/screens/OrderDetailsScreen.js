import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, Pressable, Alert, TextInput, ActivityIndicator, ScrollView } from "react-native";
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingDialog from './LoadingDialog'; 
import { useFocusEffect } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';

const windowHeight = Dimensions.get('window').height;

const OrderDetailsScreen = ({ route, navigation }) => {

    const [itemQuantities, setItemQuantities] = useState({});
    const { saleId, id ,orderstatus } = route.params;
    const [isVisible, setIsVisible] = useState(false);
    const [orderDetailsArray, setOrderDetails] = useState([]);
    const [orderItemArray, setItemDetails] = useState([]);
    const [showProgress, setShowProgress] = useState(false);
    const [editable, setEditable] = useState(false);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            GetDistributorDetails();
        }, [])
    );

    const increaseProgress = () => {
        setShowProgress(true);
    };

    const GetDistributorDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://192.168.1.249:90/Accounts/GetDistributorDetails?salesId=${saleId}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const json = await response.json();
            setOrderDetails(json);
            setItemDetails(json.items);
            const initialQuantities = json.items.reduce((acc, item, index) => ({
                ...acc,
                [index]: item.pieces || 0
            }), {});
            setItemQuantities(initialQuantities);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const showAlert = () => {
        Alert.alert(
            "Status",
            "Do you want to accept this order?",
            [
                { text: "Cancel", onPress: () => {}, style: "cancel" },
                { text: "Reject", onPress: () => updatestatus("R") },
                { text: "Accept", onPress: () => updatestatus("C") }
            ],
            { cancelable: false }
        );
    };


    const updatestatus = async (statuss) => {

        increaseProgress();
        
        return fetch('http://192.168.1.249:90/Accounts/OrderStatus?status='+statuss+'&salesId='+saleId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
             },
            })
            .then(response => response.json())
            .then(json => {
                setShowProgress(false); 
                navigation.navigate("OrderScreen");
                console.log(JSON.stringify(json));

                // Snackbar.show({
                //     text:  JSON.stringify(json),
                //     duration: Snackbar.LENGTH_SHORT,
                //   });
            })
            .catch(error => {
                // Snackbar.show({
                //     text:  JSON.stringify(json),
                //     duration: Snackbar.LENGTH_SHORT,
                //   });
                console.error(error);
            });

    };

    const updatestock = async () => {

        setLoading(true);
        const stockUpdates = orderItemArray.map((item, index) => ({
            itemid: item.salesProductId, 
            pieces: itemQuantities[index] || 0,
        }));
            
        try {
            // console.log("salesid"+saleId);
            // console.log("stock"+JSON.stringify(stockUpdates));
            const response = await fetch(`http://192.168.1.249:90/Accounts/updatestock?salesId=${saleId}&data=${JSON.stringify(stockUpdates)}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const json = await response.json();
            console.log(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    };

    const handleQuantityChange = (index, value) => {
        const numericValue = parseInt(value, 10);
        setItemQuantities(prev => ({ ...prev, [index]: isNaN(numericValue) ? '' : numericValue }));
    };

    const toggleEditable = () => {
        setEditable(!editable);
    };

    const deliveredAlert = () => {

        Alert.alert(
            "Status",
            "Are you sure?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log(),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => updatestatus("D")
                }
            ],
            { cancelable: false }
        );
    };  

    const updateAlert = () => {

        Alert.alert(
            "Status",
            "Are you sure?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log(),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => updatestock()
                }
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <LoadingDialog visible={loading} />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Dispatch Date</Text>
                    <Text style={styles.text}>10/01/2024</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Address</Text>
                    <Text style={styles.text}>{orderDetailsArray.address}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Contact</Text>
                    <Text style={styles.text}>{orderDetailsArray.contactNo}</Text>
                </View>

                {orderItemArray.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                        <Text style={styles.itemText}>{item.product}</Text>
                        <TextInput
                            value={itemQuantities[index] ? itemQuantities[index].toString() : ''}
                            style={styles.textInput}
                            keyboardType="numeric"
                            editable={editable}
                            onChangeText={(value) => handleQuantityChange(index, value)}
                        />
                        <Pressable onPress={toggleEditable}>
                            <Text style={styles.editText}>{editable ? 'Done' : 'Edit'}</Text>
                        </Pressable>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.buttonContainer}>
                {orderstatus !== "C" && (
                    <Pressable style={styles.button} onPress={showAlert}>
                        <Text style={styles.buttonText}>Accept/Reject</Text>
                    </Pressable>
                )}
                 {orderstatus !== "" && (
            <Pressable style={styles.button} onPress={updateAlert}>
                <Text style={styles.buttonText}>Update</Text>
            </Pressable>
             )}
            {orderstatus !== "" && (
            <Pressable style={styles.button} onPress={deliveredAlert}>
                <Text style={styles.buttonText}>Delivered</Text>
            </Pressable>
            )}
            </View>

            {loading && <ActivityIndicator size="large" style={styles.loadingIndicator} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 20,
    },
    scrollView: {
        paddingBottom: 100,
    },
    infoContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: 'grey',
    },
    text: {
        fontSize: 16,
        color: 'black',
        fontWeight: '600',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    itemText: {
        flex: 3,
        color: 'black',
    },
    textInput: {
        flex: 1,
        height: 40,
        borderColor: 'cornflowerblue',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginLeft: 10,
    },
    editText: {
        flex: 1,
        color: 'cornflowerblue',
        textAlign: 'center',
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: 'cornflowerblue',
        flex: 1,
        height: 45,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingIndicator: {
        position: 'absolute',
        top: windowHeight / 2,
        left: windowHeight / 2,
    },
});

export default OrderDetailsScreen;
