import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'danger' | 'outline';
  isLoading?: boolean;
}

export default function CustomButton({ title, variant = 'primary', isLoading = false, ...props }: CustomButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'danger': return styles.buttonDanger;
      case 'outline': return styles.buttonOutline;
      default: return styles.buttonPrimary;
    }
  };

  const getTextStyle = () => {
    if (variant === 'outline') return styles.textOutline;
    return styles.textLight;
  };

  return (
    <TouchableOpacity 
      style={[styles.button, getButtonStyle(), isLoading && styles.buttonDisabled]} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? '#007BFF' : '#fff'} />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 8 },
  buttonPrimary: { backgroundColor: '#007BFF' },
  buttonDanger: { backgroundColor: '#DC3545' },
  buttonOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#007BFF' },
  text: { fontSize: 16, fontWeight: 'bold' },
  textLight: { color: '#fff' },
  textOutline: { color: '#007BFF' },
  buttonDisabled: { opacity: 0.7 },
});