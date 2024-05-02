import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, ImageBackground, Image } from "react-native";

import LinearGradient from 'react-native-linear-gradient';
// import { LinearGradient } from 'expo-linear-gradient';

const OtpInput = ({ value, onChangeText }) => {
  return (
    <TextInput
      style={styles.input}
      maxLength={1}
      keyboardType="numeric"
      value={value}
      onChangeText={onChangeText}
    />
  );
};

const OtpScreen = ({ myauth, callback, subject, email }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    try {
      const response = await fetch("http://192.168.1.2:3000/api/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("OTP is verified");
        callback();
      } else {
        Alert.alert(data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Failed to verify OTP");
    }
  };

  return (
    <ScrollView  
      style = {{
        backgroundColor: "#000000",
      }}>
      <View 
        style = {{
          marginBottom: 36,
        }}>
        <ImageBackground 
          source={{uri:'https://i.imgur.com/1tMFzp8.png'}} 
          resizeMode = {'stretch'}
          style = {{
            paddingBottom: 130,
          }}
          >
          <View 
            style = {{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#00000080",
              paddingVertical: 17,
              paddingLeft: 17,
              paddingRight: 6,
              marginBottom: 16,
            }}>
            <Text 
              style = {{
                color: "#FFFFFF",
                fontSize: 17,
                marginRight: 4,
                flex: 1,
              }}>
              {"9:41"}
            </Text>
            <Image
              source = {{uri:"https://i.imgur.com/1tMFzp8.png"}} 
              resizeMode = {"stretch"}
              style = {{
                width: 18,
                height: 12,
                marginRight: 8,
              }}
            />
            <Image
              source = {{uri:"https://i.imgur.com/1tMFzp8.png"}} 
              resizeMode = {"stretch"}
              style = {{
                width: 17,
                height: 12,
                marginRight: 7,
              }}
            />
            <Image
              source = {{uri:"https://i.imgur.com/1tMFzp8.png"}} 
              resizeMode = {"stretch"}
              style = {{
                width: 27,
                height: 13,
              }}
            />
          </View>
          <View 
            style = {{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 41,
              marginHorizontal: 16,
            }}>
            <Image
              source = {{uri:"https://i.imgur.com/1tMFzp8.png"}} 
              resizeMode = {"stretch"}
              style = {{
                width: 21,
                height: 18,
              }}
            />
            <View 
              style = {{
                width: 51,
              }}>
              <Image
                source = {{uri:"https://i.imgur.com/1tMFzp8.png"}} 
                resizeMode = {"stretch"}
                style = {{
                  height: 19,
                }}
              />
              <Image
                source = {{uri:"https://i.imgur.com/1tMFzp8.png"}} 
                resizeMode = {"stretch"}
                style = {{
                  position: "absolute",
                  bottom: -11,
                  right: 7,
                  width: 37,
                  height: 21,
                }}
              />
            </View>
          </View>
          <Text 
            style = {{
              color: "#EBEBF5",
              fontSize: 24,
              marginBottom: 20,
              marginHorizontal: 16,
            }}>
            {"Check your inbox"}
          </Text>
          <Text 
            style = {{
              color: "#FFFFFF",
              fontSize: 15,
              marginBottom: 42,
              marginHorizontal: 16,
            }}>
            {"we have sent you a verification code by email"}
          </Text>
          <View 
            style = {{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginHorizontal: 87,
            }}>
            <Text 
              style = {{
                color: "#FFFFFF",
                fontSize: 20,
              }}>
              {"Ismail@gmail.com"}
            </Text>
            <Image
              source = {{uri:"https://i.imgur.com/1tMFzp8.png"}} 
              resizeMode = {"stretch"}
              style = {{
                width: 38,
                height: 28,
              }}
            />
          </View>
        </ImageBackground>
        <View 
          style = {{
            position: "absolute",
            bottom: -2,
            left: 15,
            width: 78,
            height: 90,
            backgroundColor: "#FFFFFF1A",
            borderRadius: 10,
            paddingHorizontal: 19,
            shadowColor: "#00000040",
            shadowOpacity: 0.3,
            shadowOffset: {
                width: 0,
                height: 4
            },
            shadowRadius: 33,
            elevation: 33,
          }}>
          <View 
            style = {{
              height: 1,
              backgroundColor: "#FFFFFF57",
              marginTop: 69,
            }}>
          </View>
        </View>
        <View 
          style = {{
            position: "absolute",
            bottom: -2,
            left: 109,
            width: 78,
            height: 90,
            backgroundColor: "#FFFFFF1A",
            borderRadius: 10,
            paddingHorizontal: 19,
            shadowColor: "#00000040",
            shadowOpacity: 0.3,
            shadowOffset: {
                width: 0,
                height: 4
            },
            shadowRadius: 33,
            elevation: 33,
          }}>
          <View 
            style = {{
              height: 1,
              backgroundColor: "#FFFFFF57",
              marginTop: 69,
            }}>
          </View>
        </View>
        <View 
          style = {{
            position: "absolute",
            bottom: -2,
            right: 113,
            width: 78,
            height: 90,
            backgroundColor: "#FFFFFF1A",
            borderRadius: 10,
            paddingHorizontal: 19,
            shadowColor: "#00000040",
            shadowOpacity: 0.3,
            shadowOffset: {
                width: 0,
                height: 4
            },
            shadowRadius: 33,
            elevation: 33,
          }}>
          <View 
            style = {{
              height: 1,
              backgroundColor: "#FFFFFF57",
              marginTop: 69,
            }}>
          </View>
        </View>
        <View 
          style = {{
            position: "absolute",
            bottom: -2,
            right: 19,
            width: 78,
            height: 90,
            backgroundColor: "#FFFFFF1A",
            borderRadius: 10,
            paddingHorizontal: 19,
            shadowColor: "#00000040",
            shadowOpacity: 0.3,
            shadowOffset: {
                width: 0,
                height: 4
            },
            shadowRadius: 33,
            elevation: 33,
          }}>
          <View 
            style = {{
              height: 1,
              backgroundColor: "#FFFFFF57",
              marginTop: 69,
            }}>
          </View>
        </View>
      </View>
      <Text 
        style = {{
          color: "#FFFFFF",
          fontSize: 15,
          marginBottom: 33,
          marginHorizontal: 147,
        }}>
        {"Resend again"}
      </Text>
      <LinearGradient 
        start={{x:0, y:0}}
        end={{x:0, y:1}}
        colors={["#A903D2", "#410095"]}
        style = {{
          alignItems: "center",
          borderRadius: 10,
          paddingVertical: 26,
          marginBottom: 284,
          marginHorizontal: 15,
        }}>
        <Text 
          style = {{
            color: "#FFFFFF",
            fontSize: 16,
          }}>
          {"Verify email"}
        </Text>
      </LinearGradient>
      <View 
        style = {{
          backgroundColor: "#00000099",
          paddingHorizontal: 129,
        }}>
        <View 
          style = {{
            height: 5,
            backgroundColor: "#FFFFFF",
            borderRadius: 100,
            marginTop: 20,
          }}>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
    marginHorizontal: 5,
  },
});

export default OtpScreen;
