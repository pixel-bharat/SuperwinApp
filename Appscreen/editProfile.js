import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

export default function EditProfile({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [userData, setUserData] = useState({
    phoneNumber: '',
    uid: '',
    avatar: null,
    memberName: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const decoded = jwtDecode(token);
        console.log('Decoded JWT:', decoded);
        const phoneNumber = decoded.phoneNumber ? decoded.phoneNumber.replace(/^91/, '') : '';
        setUserData({
          phoneNumber: phoneNumber,
          uid: decoded.userId || '',
          avatar: decoded.avatar || null,
          memberName: decoded.name || '',
        });
      } else {
        console.log('No token found');
        Alert.alert('Error', 'Token not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data.');
    }
  };

  const saveProfile = async () => {
    setNameError('');
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = userData.uid; // Ensure this is a valid ObjectId or convert it

      if (!token) {
        setIsLoading(false);
        Alert.alert('Error', 'Token not found');
        return;
      }

      const updatedUser = {
        memberName: userData.memberName,
        avatar: selectedAvatar,
      };

      const response = await fetch(`http://192.168.1.17:3000/api/profile/${userId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      console.log('Profile updated successfully:', data);

      Alert.alert('Success', 'Profile updated successfully!');
      // Navigate to profile screen or any other screen
      // Replace 'ProfileScreen' with your actual screen name
      navigation.navigate('ProfileScreen');
    } catch (error) {
      console.error('Save profile error:', error);
      Alert.alert('Error', 'Failed to save profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const avatars = {
    avatar1: require('../assets/avatar/avatar_1.png'),
    avatar2: require('../assets/avatar/avatar_2.png'),
    avatar3: require('../assets/avatar/avatar_3.png'),
    avatar4: require('../assets/avatar/avatar_4.png'),
    avatar5: require('../assets/avatar/avatar_5.png'),
    uploadAvatar: require('../assets/avatar/upload_avatar.png'),
  };

  const selectAvatar = (key) => {
    setSelectedAvatar(key);
    console.log('Avatar selected:', key);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView style={styles.container}>
        <View style={styles.scrollViewContent}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number:</Text>
            <View style={styles.input_disabled}>
              <Text style={styles.centerText}>{userData.phoneNumber}</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>UID:</Text>
            <View style={styles.input_disabled}>
              <Text style={styles.centerText}>{userData.uid}</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#aaa"
              onChangeText={(text) => setUserData({ ...userData, memberName: text })}
              value={userData.memberName}
              style={styles.input}
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>

          <Text style={styles.label}>Select an Avatar:</Text>
          <View style={styles.avatarContainer}>
            {Object.keys(avatars).map((key) => (
              <TouchableOpacity key={key} onPress={() => selectAvatar(key)}>
                <Image
                  source={avatars[key]}
                  style={[
                    styles.avatar,
                    selectedAvatar === key ? styles.selectedAvatar : null,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isLoading ? styles.disabledButton : null]}
            onPress={saveProfile}
            disabled={isLoading}
          >
            <LinearGradient colors={['#A903D2', '#410095']} style={styles.gradient}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Save Profile</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff2',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    height: 60,
    width: '100%',
  },
  input_disabled: {
    backgroundColor: '#fff2',
    color: '#fff5',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    height: 60,
    justifyContent: 'center',
    width: '100%',
  },
  centerText: {
    color: 'rgba(158, 158, 158, 1)',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatar: {
    borderColor: '#A903D2',
    borderWidth: 4,
  },
  saveButton: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 20,
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
