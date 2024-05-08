import React, { useState } from "react";
import {
  View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const UserProfileScreen = ({ userId }) => {
  const [avatar, setAvatar] = useState(null);
  const [memberName, setMemberName] = useState("");

  // Function to select avatar with 1:1 aspect ratio
  const selectAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Gallery permission is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Ensures the aspect ratio is 1:1
    });

    if (!pickerResult.cancelled) {
      setAvatar(pickerResult.uri);
    }
  };

  const saveProfile = async () => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('memberName', memberName);

    // Append the avatar file to the FormData if it exists
    if (avatar) {
      const uriParts = avatar.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append('avatar', {
        uri: avatar,
        name: `avatar.${fileType}`, // Construct the file name
        type: `image/${fileType}`, // Construct the MIME type
      });
    }

    try {
      const response = await axios.post("http://192.168.1.26:3000/api/profile/avatar", formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Correct header for file upload
        },
      });

      console.log(response.data);
      alert('Profile saved successfully');
    } catch (error) {
      console.error("Error saving profile:", error);
      alert('Failed to save profile');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Setup Your Profile</Text>
      <TouchableOpacity onPress={selectAvatar} style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Text>Select Avatar</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Enter Member Name"
        value={memberName}
        onChangeText={setMemberName}
      />
      <Button title="Save Profile" onPress={saveProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    margin: 20,
    height: 200,
    width: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dedede',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '80%',
    padding: 10,
    marginVertical: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 10,
  },
});

export default UserProfileScreen;
