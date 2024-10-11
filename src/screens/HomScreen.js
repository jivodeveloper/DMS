import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingDialog from './LoadingDialog';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [distId, setDistId] = useState(null);
  const [distName, setDistName] = useState(null);
  const [allSku, setAllSku] = useState([]);
  const [orderCount, setOrderCount] = useState({});

  // useFocusEffect(
  //   useCallback(() => {
  //     setLoading(true);
  //     getUser();
  //     GetAllSku();
  //   }, [])
  // );

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        await getUser();
        if (distId) {
          await GetAllSku();
        }
        setLoading(false);
      };
      loadData();
    }, [distId]) // Dependency array includes distId
  );

  const signOut = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Failed to clear async storage:', error);
    }
  };
  
  const GetAllSku = async () => {
    try {
      const response = await fetch(`http://192.168.1.249:90/Accounts/GetAllSku?distId=${distId}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      if (Array.isArray(json)) {
        setAllSku(json);
      } else {
        console.error('API response is not an array:', json);
        setAllSku([]);
      }
      GetOrderCount();
    } catch (error) {
      console.error(error);
    }
  };

  const GetOrderCount = async () => {
    try {
      const response = await fetch(`http://192.168.1.249:90/Accounts/GetCount?distId=${distId}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      setOrderCount(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    try {
      const name = await AsyncStorage.getItem("distName");
      const id = await AsyncStorage.getItem("distId");
      setDistId(id);
      setDistName(name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LoadingDialog visible={loading} />

      <Text style={styles.welcomeText}>WELCOME {distName ? distName.replace(/"/g, '') : ''}</Text>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Delivery Status</Text>
        <View style={styles.row}>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Status</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Count</Text>
          </View>
        </View>

        {['confirm', 'rejected', 'delivered'].map((status) => (
          <View style={styles.row} key={status}>
            <View style={styles.cell}>
              <Text style={styles.cellText}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>{orderCount[status]}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.sectionContainer}>
         <Text style={styles.sectionTitle}>SKU List</Text>
         <View style={styles.row}>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>SKU</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Quantity</Text>
          </View>
      </View>

        {Array.isArray(allSku) && allSku.map((item, index) => (
          <View style={styles.row} key={index}>
            <View style={styles.cell}>
              <Text style={styles.cellText}>{item.productName}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>{item.productQuantity}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 15,
  },
  welcomeText: {
    fontSize: 24,
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionContainer: {
    marginVertical: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'cornflowerblue',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    backgroundColor: 'cornflowerblue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ABCDEF',
    borderRadius: 5,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  cellText: {
    fontSize: 16,
    color: 'black',
  },
});

export default HomeScreen;
