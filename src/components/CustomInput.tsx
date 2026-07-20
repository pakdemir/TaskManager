import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTasks } from '../context/TaskContext';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function CustomInput({ label, error, ...props }: CustomInputProps) {
  const { isDarkMode } = useTasks();
  
  const textColor = isDarkMode ? '#fff' : '#333';
  const bgColor = isDarkMode ? '#1e1e1e' : '#fff';
  const borderColor = isDarkMode ? '#444' : '#ccc';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          { backgroundColor: bgColor, color: textColor, borderColor: borderColor },
          error ? styles.inputError : null
        ]}
        placeholderTextColor={isDarkMode ? '#888' : '#999'}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});