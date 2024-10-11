import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import React, { useState, useEffect, useCallback } from "react";
import { Dimensions } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingDialog from './LoadingDialog';
import Snackbar from 'react-native-snackbar';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; 

const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('window').height;

const PrimaryStockScreen = ({ navigation }) => {

    const [items, setItems] = useState([]);
    const [distitems, setDistItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [visibleRows, setVisibleRows] = useState([]);
    const [distId, setDistId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        setItems([]);
        getuserdata();
    }, []);

    useFocusEffect(
        useCallback(() => {
            setItems([]);
            getuserdata();
        }, [])
    );

    useEffect(() => {
        if (distId !== null) {
            getallitems();
        }
    }, [distId]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={addItem} style={styles.iconButton}>
                  <Icon name="plus" size={20} color="#007BFF" />
                </Pressable>
                // <Pressable onPress={addItem} style={styles.iconButton}>
                //     <Icon name="plus" size={20} color="#007BFF" />
                // </Pressable>
            ),
        });
    }, [navigation]);

    const addItem = () => {
        setItems(prevItems => {
            const newItems = [...prevItems, `Item ${prevItems.length + 1}`];
            setSelectedItems(prevSelectedItems => [...prevSelectedItems, null]);
            setQuantities(prevQuantities => [...prevQuantities, '']);
            setVisibleRows(prevVisibleRows => [...prevVisibleRows, false]);
            return newItems;
        });
    };

    const getuserdata = async () => {
        try {
            const id = await AsyncStorage.getItem("distId");
            setDistId(id);
        } catch (error) {
            console.log(error);
        }
    };

    const getallitems = () => {
        setLoading(true);
        return fetch('http://192.168.1.249:90/Accounts/GetAllItems?distId=' + distId, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(json => {
                setDistItems(json);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    };

    const handleDropdownSelect = (item, index) => {
        setSelectedItems(prevSelectedItems => {
            const newSelectedItems = [...prevSelectedItems];
            newSelectedItems[index] = item;
            return newSelectedItems;
        });

        setStocks(prevStocks => {
            const newStocks = [...prevStocks];
            newStocks[index] = item.stock;
            return newStocks;
        });

        setVisibleRows(prevVisibleRows => {
            const newVisibleRows = [...prevVisibleRows];
            newVisibleRows[index] = true;
            return newVisibleRows;
        });
    };

    const handleQuantityChange = (text, index) => {
        setQuantities(prevQuantities => {
            const newQuantities = [...prevQuantities];
            newQuantities[index] = text;
            return newQuantities;
        });
    };

    const handleSubmit = () => {
        setLoading(true);
        const dataToSend = items.map((_, index) => ({
            distId: distId,
            item: selectedItems[index]?.itemID, // Use optional chaining
            quantity: quantities[index]
        }));

        fetch('http://192.168.1.249:90/Accounts/SavePrimarySales?data=' + JSON.stringify(dataToSend), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(json => {
                if (json === "done") {
                    Snackbar.show({
                        text: 'Stock saved successfully',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }
                navigation.navigate("Dashboard");
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                console.error(error);
            });
    };
    
    return (
        <View style={styles.container}>
            <LoadingDialog visible={loading} />
            <View style={styles.heading}>
                <Text style={styles.headingText}>SKU</Text>
                <Text style={styles.headingText}>Stock</Text>
                <Text style={styles.headingText}>Quantity</Text>
            </View>

            {items.map((_, index) => (
                <View key={index} style={styles.itemRow}>
                    <SelectDropdown
                        data={distitems}
                        onSelect={(item) => handleDropdownSelect(item, index)}
                        defaultValue={selectedItems[index]}
                        renderButton={(selectedItem) => (
                            <View style={styles.dropdownButtonStyle}>
                                <Text style={styles.dropdownButtonTxtStyle}>
                                    {(selectedItem && selectedItem.itemName) || "Select Item"}
                                </Text>
                            </View>
                        )}
                        renderItem={(item, index, isSelected) => (
                            <View style={[
                                styles.dropdownItemStyle,
                                isSelected && styles.selectedDropdownItemStyle
                            ]}>
                                <Text style={styles.dropdownItemTxtStyle}>{item.itemName}</Text>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={styles.dropdownMenuStyle}
                    />

                    {visibleRows[index] && (
                        <View style={styles.inputContainer}>
                            <Text style={styles.stockText}>{stocks[index]}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Quantity"
                                placeholderTextColor="#000000"
                                keyboardType="numeric"
                                onChangeText={(text) => handleQuantityChange(text, index)}
                                value={quantities[index]}
                            />
                        </View>
                    )}
                </View>
            ))}

            <View style={styles.buttonView}>
              
                <Pressable style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    iconButton: {
        padding: 10,
    },
    container: {
        margin: 10,
        height: windowHeight,
        backgroundColor: '#F8F9FA',
    },
    heading: {
        flexDirection: 'row',
        marginTop: 20,
        paddingVertical: 10,
        backgroundColor: 'cornflowerblue',
        borderRadius: 5,
    },
    headingText: {
        flex: 1,
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemRow: {
        flexDirection: 'row',
        marginTop: 10,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dropdownButtonStyle: {
        flex: 2,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    dropdownButtonTxtStyle: {
        fontSize: 16,
        color: '#151E26',
        textAlign: 'center',
    },
    dropdownMenuStyle: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginTop: 10,
        elevation: 5,
    },
    inputContainer: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
    },
    stockText: {
        fontSize: 16,
        color: '#151E26',
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    buttonView: {
        width: "100%",
        position: 'absolute',
        bottom: 100,
        left: 0,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: "cornflowerblue",
        height: 45,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    dropdownItemStyle: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    dropdownItemTxtStyle: {
        fontSize: 16,
        color: '#151E26',
    },
    selectedDropdownItemStyle: {
        backgroundColor: '#D3E3FF',
    },
    iconButton: {
        marginRight: 10,
    },
});

export default PrimaryStockScreen;
