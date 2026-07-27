import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import useAuthStore from '../../stores/authStore';

export default function ForgotPasswordScreen({ navigation }: any) {
  const { forgotPassword, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email.trim()) return Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
    try {
      await forgotPassword(email);
      Alert.alert('Başarılı', 'Şifre sıfırlama e-postası gönderildi.', [{ text: 'Tamam', onPress: () => navigation.goBack() }]);
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Şifre sıfırlama başarısız.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.formContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backText}>← Geri</Text></TouchableOpacity>
        <Text style={styles.title}>Şifremi Unuttum</Text>
        <TextInput style={styles.input} placeholder="E-posta" keyboardType="email-address" autoCapitalize="none" onChangeText={setEmail} value={email} />
        <TouchableOpacity style={styles.btn} onPress={handleResetPassword} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Sıfırla</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center' },
  formContainer: { paddingHorizontal: 24 },
  backText: { color: '#4f46e5', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 20 },
  btn: { backgroundColor: '#4f46e5', padding: 16, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
