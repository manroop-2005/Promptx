// components/TypingIndicator.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TypingIndicator = () => (
  <View style={styles.container}>
    <Text style={styles.dot}>▋</Text>
    <Text style={[styles.dot, { opacity: 0.6 }]}>▋</Text>
    <Text style={[styles.dot, { opacity: 0.3 }]}>▋</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 8 },
  dot: { fontSize: 16, marginHorizontal: 2 },
});

export default TypingIndicator;