import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Text, Pressable, ScrollView, BackHandler } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingDialog from './LoadingDialog'; 
import { useFocusEffect } from '@react-navigation/native';

const OrderScreen = ({ navigation }) => {
  const [distId, setDistId] = useState(null);
  const [distdataArray, setDistDataArray] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getuserdata();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Dashboard'); 
        return true; 
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [navigation])
  );

  const orderdetailsdata = (id) => {
    setLoading(true);
    fetch(`http://192.168.1.249:90/Accounts/DistributorData?distId=` + id, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(json => {
      setDistDataArray(json?.salesReport || []);
      setLoading(false);
    })
    .catch(error => {
      console.error(error);
      setLoading(false);
    });
  };

  const getuserdata = async () => {
    try {
      const id = await AsyncStorage.getItem("distId");
      setDistId(id);
      if (id) {
        orderdetailsdata(id);
      } else {
        setDistDataArray([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigatetoanotherscreen = (item, salesId, status) => {
    navigation.navigate('Order Details', { shopName: item, saleId: salesId, orderstatus: status });
  };

  return (
    <View style={styles.container}>
      <LoadingDialog visible={loading} />
      <View style={styles.headingView}>
        <Text style={styles.headingText}>Pending Orders</Text>
        <Text style={styles.headingText}>Qty</Text>
      </View>
      
      <ScrollView>
        {distdataArray.length > 0 ? (
          distdataArray.map((jsonData, index) => (
            <Pressable key={index} onPress={() => navigatetoanotherscreen(jsonData.retailerName, jsonData.salesId, jsonData.status)}>
              <View style={styles.row}>
                <Text style={styles.retailerName}>{jsonData.retailerName}</Text>
                <Text style={styles.quantity}>{jsonData.totalPieces}</Text>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.noDataView}>
            <Text style={styles.noDataText}>No data available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  headingView: {
    backgroundColor: 'cornflowerblue',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  headingText: {
    fontFamily: 'Quicksand-Bold',
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  retailerName: {
    flex: 3,
    color: 'black',
    fontSize: 16,
  },
  quantity: {
    flex: 1,
    color: 'grey',
    fontSize: 16,
    textAlign: 'right',
  },
  noDataView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  noDataText: {
    fontSize: 18,
    color: 'grey',
  },
});

export default OrderScreen;
