import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Snake = () => {

  return (
    <View style={styles.container}>
      <Text style={styles.countText}>Smth</Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 30,
    marginBottom: 20,
  },
});

export default Snake;