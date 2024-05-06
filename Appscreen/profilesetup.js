import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import Expo's image picker
import axios from "axios";

const UserProfileScreen = ({ userId }) => {
  const [avatar, setAvatar] = useState(null);
  const [images, setImages] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [uid, setUid] = useState("");

  const selectAvatar = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Gallery permission is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.cancelled) {
      setAvatar(pickerResult.uri);
    }
  };
  const uploadImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Gallery permission is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });
    if (!pickerResult.cancelled) {
      setImages([...images, ...pickerResult.uris]);
    }
  };
  const saveProfile = async () => {
    try {
      // Prepare data to send in the request body
      const data = {
        userId: userId,
        avatar: avatar,
        images: images,
        memberName: memberName,
        uid: uid,
      };

      // Make API request to save profile
      const response = await axios.post(
        "http://192.168.1.2:3000/api/profile/avatar",
        data
      );

      // Handle response
      console.log(response.data); // Log response data

      // You can add additional logic here based on the response
    } catch (error) {
      console.error("Error saving profile:", error);
      // Handle error
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>Setup your Profile</Text>
        <View style={styles.divider}></View>
        <Text style={styles.label}>Select your Avatar</Text>
        <Text style={styles.sublabel}>
          this will display as your Profile Picture
        </Text>
      </View>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={selectAvatar}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </TouchableOpacity>
        {/* Repeat TouchableOpacity for additional avatar images */}
      </View>
      <Button title="Upload Images" onPress={uploadImage} />
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter Member Name"
        value={memberName}
        onChangeText={(text) => setMemberName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter UID"
        value={uid}
        onChangeText={(text) => setUid(text)}
      />
      <Button title="Save Profile" onPress={saveProfile} />
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: "10%",
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "black",
  },
  section: {
    height: 92,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 10,
  },
  heading: {
    alignSelf: "stretch",
    textAlign: "center",
    color: "white",
    fontSize: 24,
    fontFamily: "SF Pro",
    fontWeight: "590",
    lineHeight: 22,
  },
  divider: {
    alignSelf: "stretch",
    height: 0,
    border: "2px #191B23 solid",
  },
  label: {
    alignSelf: "stretch",
    color: "rgba(235, 235, 245, 0.60)",
    fontSize: 18,
    fontFamily: "SF Pro",
    fontWeight: "590",
    lineHeight: 22,
  },
  sublabel: {
    alignSelf: "stretch",
    color: "rgba(255, 255, 255, 0.42)",
    fontSize: 15,
    fontFamily: "SF Pro",
    fontWeight: "400",
    lineHeight: 18,
  },
  avatarContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 10,
    flexDirection: "row",
    display: "inline-flex",
  },
  avatar: {
    width: 114,
    height: 114,
    background: "linear-gradient(0deg, black 0%, black 100%)",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: 16,
    border: "2px #E158E1 solid",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: "3%",
  },
  image: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.05,
    margin: "1%",
  },
  input: {
    height: width * 0.1,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: "3%",
    paddingHorizontal: "2%",
  },
});

export default UserProfileScreen;
