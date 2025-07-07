import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [registered, setRegistered] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmitLogin = async (data) => {
    try {
      const response = await axios.post('http://192.168.1.20:5000/login', data);
      await AsyncStorage.setItem('token', response.data.token);
      Alert.alert("Giriş Başarılı", "Giriş işleminiz başarılı.");
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert("Giriş başarısız", error.response?.data?.message || "Sunucu hatası");
    }
  };

  const onSubmitRegister = async (data) => {
    try {
      const response = await axios.post('http://192.168.1.20:5000/register', data);
      Alert.alert("Kayıt Başarılı", "Kayıt işleminiz başarılı.");
      setRegistered(false);
    } catch (error) {
      Alert.alert("Kayıt Başarısız", error.response?.data?.message || "Sunucu hatası");
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>{registered ? 'Kayıt Ol' : 'Giriş Yap'}</Text>

      {registered && (
        <>
          <Controller
            control={control}
            name="username"
            rules={{ required: 'Kullanıcı adı zorunludur.' }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={styles.input}
                placeholder="Kullanıcı Adı"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
              />
            )}
          />
          {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
        </>
      )}

      <Controller
        control={control}
        name="email"
        rules={{
          required: 'E-posta zorunludur.',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Geçerli bir e-posta adresi girin.'
          }
        }}
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            style={styles.input}
            placeholder="E-posta"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        rules={{
          required: 'Şifre zorunludur.',
          minLength: { value: 6, message: 'Şifre en az 6 karakter olmalıdır.' }
        }}
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            onChangeText={onChange}
            value={value}
            secureTextEntry
            onBlur={onBlur}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: registered ? '#4CAF50' : '#2196F3' }]}
        onPress={handleSubmit(registered ? onSubmitRegister : onSubmitLogin)}
      >
        <Text style={styles.buttonText}>{registered ? "Kayıt Ol" : "Giriş Yap"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => setRegistered(!registered)}
      >
        <Text style={styles.buttonText}>
          {registered ? "Zaten hesabım var" : "Kayıt Ol"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  error: {
    color: '#E53935',
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
