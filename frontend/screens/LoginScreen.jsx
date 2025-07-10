import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation();
  const [registered, setRegistered] = useState(false);
  const { control, handleSubmit, formState: { errors }, reset } = useForm();

  const { login } = useContext(AuthContext);

  const onSubmitLogin = async (data) => {
    try {
      const response = await axios.post('http://192.168.1.20:5000/login',data);
      login(response.data.token,response.data.userId);
      Alert.alert("Başarılı", "Giriş yapıldı.");
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert("Hata", error.response?.data?.message || "Sunucu hatası");
    }
  };

  const onSubmitRegister = async (data) => {
    try {
      await axios.post('http://192.168.1.20:5000/register', data);
      Alert.alert("Başarılı", "Kayıt tamamlandı.");
      setRegistered(false);
      reset();
    } catch (error) {
      Alert.alert("Hata", error.response?.data?.message || "Sunucu hatası");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/images/konser-bileti.jpg')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>{registered ? 'Kayıt Ol' : 'Giriş Yap'}</Text>

      {registered && (
        <>
          <Controller
            control={control}
            name="username"
            rules={{ required: 'Kullanıcı Adı Gerekli' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Kullanıcı Adı"
                value={value}
                onChangeText={onChange}
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
          required: 'Email Gerekli',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Geçersiz email'
          }
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        rules={{
          required: 'Şifre Gerekli',
          minLength: { value: 6, message: 'Minimum 6 karakter' }
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleSubmit(registered ? onSubmitRegister : onSubmitLogin)}
      >
        <Text style={styles.buttonText}>{registered ? 'Sign Up' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        setRegistered(!registered);
        reset();
      }}>
        <Text style={styles.switchText}>
          {registered ? 'Zaten bir hesabınız var mı? Giriş Yap' : "Hesabınız yok mu? Kayıt Ol"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 30,
    backgroundColor: '#EEF1FA',
    flexGrow: 1,
    alignItems: 'center',

  },
  image: {
    marginTop:90,
    width: width * 0.6,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3C3C3C',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  error: {
    color: '#D32F2F',
    fontSize: 13,
    marginBottom: 5,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#5C6BC0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchText: {
    marginTop: 16,
    fontSize: 14,
    color: '#5C6BC0',
    textAlign: 'center',
  },
});
