// LoadingDialog.js
import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const LoadingDialog = ({ visible }) => {
  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.container}>
        <View style={styles.dialog}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.text}>Loading...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dialog: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default LoadingDialog;
