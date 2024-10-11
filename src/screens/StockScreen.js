import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Dimensions } from 'react-native';
import React, { useEffect, useState } from "react";
import LoadingDialog from './LoadingDialog'; 

const { width } = Dimensions.get('window');
const windowHeight = Dimensions.get('window').height;

const StockScreen = () => {
    const [stockarray, setStockArray] = useState([]);    
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
        GetAllStockDetails();
    }, []);

    const GetAllStockDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://192.168.1.249:90/Accounts/GetAllStock?distId=9755`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const json = await response.json();
            setStockArray(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
      <View style={styles.card}>
          <Text style={styles.cell}>{item.productname}</Text>
          <Text style={styles.cell}>{item.stock}</Text>
          <Text style={styles.cell}>{item.orders}</Text>
          <Text style={styles.cell}>{item.primaries}</Text>
      </View>
    );

    return (
      <View style={styles.container}>
        <LoadingDialog visible={loading} />
        <FlatList
            data={stockarray}
            renderItem={renderItem}
            keyExtractor={(item) => item.productname.toString()}
            ListHeaderComponent={() => (
                <View style={styles.header}>
                    <Text style={styles.headerText}>Item</Text>
                    <Text style={styles.headerText}>Stk in hand</Text>
                    <Text style={styles.headerText}>Odr in hand</Text>
                    <Text style={styles.headerText}>Primary</Text>
                </View>
            )}
            contentContainerStyle={styles.list}
        />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: windowHeight,
        backgroundColor: '#f8f9fa', 
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        backgroundColor: 'cornflowerblue',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white', 
    },
    card: {
        flexDirection: 'row',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#ffffff', 
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cell: {
        flex: 1,
        fontSize: 16,
        color: '#333', 
    },
    list: {
        paddingVertical: 10,
    },
});

export default StockScreen;
