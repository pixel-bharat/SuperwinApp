import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../backend/config/config";
import { BackgroundImage } from "react-native-elements/dist/config";

interface UserData {
  uid: string;
}

const AddBankDetails: React.FC = () => {
  const navigation = useNavigation();
  const [showAccountDetails, setShowAccountDetails] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>("UPI");
  const [upiIdText, setUpiIdText] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [ifscCode, setIfscCode] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardHolderName, setCardHolderName] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const accountOptions: string[] = ["UPI", "Account", "Credit Card"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          const response = await fetch(`${BASE_URL}api/users/userdata`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          setUserData(data);
        } else {
          Alert.alert("Login Failed", "Token not found");
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
        Alert.alert("Error", (error as Error).message);
      }
    };

    fetchData();
  }, []);

  const handleUpiIdChange = (text: string) => setUpiIdText(text);
  const handleAccountNumberChange = (text: string) => setAccountNumber(text);
  const handleBankNameChange = (text: string) => setBankName(text);
  const handleIfscCodeChange = (text: string) => setIfscCode(text);
  const handleCardNumberChange = (text: string) => setCardNumber(text);
  const handleCardHolderNameChange = (text: string) => setCardHolderName(text);
  const handleExpiryDateChange = (text: string) => setExpiryDate(text);
  const handleCvvChange = (text: string) => setCvv(text);

  const handleAccountSelection = (item: string) => {
    setSelectedType(item);
    setShowAccountDetails(false);
  };


  const verifyDetails = async () => {
    let url = '';
    let payload = {};

    if (selectedType === 'UPI') {
      url = `${BASE_URL}api/bankdetails/verify/upi`;
      payload = { upiId: upiIdText };
    } else if (selectedType === 'Account') {
      url = `${BASE_URL}api/bankdetails/verify/account`;
      payload = {
        accountNumber,
        bankName,
        ifscCode,
      };
    } else if (selectedType === 'Credit Card') {
      url = `${BASE_URL}api/bankdetails/verify/creditcard`;
      payload = {
        cardNumber,
        cardHolderName,
        expiryDate,
        cvv,
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setIsVerified(true);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Failed to verify details');
    }
  };

  const verifyAndSave = async () => {
    if (!isVerified) {
      alert('Please verify the details before saving.');
      return;
    }

    const payload = {
      type: selectedType,
      upiId: selectedType === 'UPI' ? upiIdText : null,
      accountNumber: selectedType === 'Account' ? accountNumber : null,
      bankName: selectedType === 'Account' ? bankName : null,
      ifscCode: selectedType === 'Account' ? ifscCode : null,
      cardNumber: selectedType === 'Credit Card' ? cardNumber : null,
      cardHolderName: selectedType === 'Credit Card' ? cardHolderName : null,
      expiryDate: selectedType === 'Credit Card' ? expiryDate : null,
      cvv: selectedType === 'Credit Card' ? cvv : null,
      uid: userData ? userData.uid : null,
    };

    try {
      const response = await fetch(`${BASE_URL}api/bankdetails/saveBankDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Failed to save bank details:', error);
      alert('Failed to save bank details');
    }
  };


  return (
    <View style={styles.container}>
      <BackgroundImage
        source={require("../assets/bankbackground.png")}
        style={styles.backgroundImage}
      />
      <ScrollView style={styles.in_cont}>
        <View>
          <View style={styles.headingCnt}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require("../assets/back.png")}
                style={styles.backButton}
              />
            </TouchableOpacity>
            <Text style={styles.mainHeading}>Bank Details</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLable}>Type</Text>
            <TouchableOpacity
              onPress={() => setShowAccountDetails(!showAccountDetails)}
              style={styles.textinputCnt}
            >
              <TextInput
                style={styles.input}
                placeholder="UPI"
                value={selectedType}
                editable={false}
                placeholderTextColor={"rgba(158, 158, 158, 1)"}
              />
              <Image source={require("../assets/downArrow.png")} />
            </TouchableOpacity>
            {showAccountDetails && (
              <View style={styles.dropdownList}>
                {accountOptions.map((item, index) => (
                  <TouchableOpacity
                    key={index.toString()}
                    style={styles.dropdownItem}
                    onPress={() => handleAccountSelection(item)}
                  >
                    <Text style={styles.dropdownText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {selectedType === "UPI" && (
              <>
                <Text style={styles.inputLable}>Enter your UPI ID</Text>
                <View style={styles.textinputCnt}>
                  <Image
                    source={require("../assets/person.png")}
                    style={styles.personicon}
                  />
                  <TextInput
                    style={styles.inputupiid}
                    placeholder="UPI ID"
                    value={upiIdText}
                    onChangeText={handleUpiIdChange}
                    placeholderTextColor={"rgba(158, 158, 158, 1)"}
                  />
                </View>
              </>
            )}

            {selectedType === "Account" && (
              <>
                <Text style={styles.inputLable}>Account Number</Text>
                <View style={styles.textinputCnt}>
                  <Image
                    source={require("../assets/person.png")}
                    style={styles.personicon}
                  />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Account Number"
                    value={accountNumber}
                    onChangeText={handleAccountNumberChange}
                    placeholderTextColor={"rgba(158, 158, 158, 1)"}
                  />
                </View>

                <Text style={styles.inputLable}>Bank Name</Text>
                <View style={styles.textinputCnt}>
                  <Image
                    source={require("../assets/person.png")}
                    style={styles.personicon}
                  />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Bank Name"
                    value={bankName}
                    onChangeText={handleBankNameChange}
                    placeholderTextColor={"rgba(158, 158, 158, 1)"}
                  />
                </View>

                <Text style={styles.inputLable}>IFSC Code</Text>
                <View style={styles.textinputCnt}>
                  <Image
                    source={require("../assets/person.png")}
                    style={styles.personicon}
                  />
                  <TextInput
                    style={styles.inputField}
                    placeholder="IFSC Code"
                    value={ifscCode}
                    onChangeText={handleIfscCodeChange}
                    placeholderTextColor={"rgba(158, 158, 158, 1)"}
                  />
                </View>
              </>
            )}

            {selectedType === "Credit Card" && (
              <>
                <Text style={styles.inputLable}>Credit Card Number</Text>
                <View style={styles.textinputCnt}>
                  <Image
                    source={require("../assets/person.png")}
                    style={styles.personicon}
                  />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Credit Card Number"
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    placeholderTextColor={"rgba(158, 158, 158, 1)"}
                  />
                </View>

                <Text style={styles.inputLable}>Card Holder Name</Text>
                <View style={styles.textinputCnt}>
                  <Image
                    source={require("../assets/person.png")}
                    style={styles.personicon}
                  />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Card Holder Name"
                    value={cardHolderName}
                    onChangeText={handleCardHolderNameChange}
                    placeholderTextColor={"rgba(158, 158, 158, 1)"}
                  />
                </View>

                <Text style={styles.inputLable}>Expiry Date</Text>
                <View style={styles.textinputCnt}>
                  <Image
                    source={require("../assets/person.png")}
                    style={styles.personicon}
                  />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Expiry Date (MM/YY)"
                    value={expiryDate}
                    onChangeText={handleExpiryDateChange}
                    placeholderTextColor={"rgba(158, 158, 158, 1)"}
                  />
                </View>

                <Text style={styles.inputLable}>CVV</Text>
                <View style={styles.textinputCnt}>
                  <Image
                    source={require("../assets/person.png")}
                    style={styles.personicon}
                  />
                  <TextInput
                    style={styles.inputField}
                    placeholder="CVV"
                    value={cvv}
                    onChangeText={handleCvvChange}
                    placeholderTextColor={"rgba(158, 158, 158, 1)"}
                  />
                </View>
              </>
            )}
          </View>
          <TouchableOpacity style={styles.button} onPress={verifyDetails}>
            <Text style={styles.buttonText}>Verify ID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={verifyAndSave}>
            <Text style={styles.buttonText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  in_cont: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  backgroundImage: {
    position: "absolute",
    height: "50%",
    width: "100%",
    resizeMode: "contain",
  },
  headingCnt: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  mainHeading: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
    paddingHorizontal: "30%",
  },
  backButton: {
    height: 24,
    width: 24,
  },
  serachButton: {
    height: 24,
    width: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLable: {
    color: "rgba(255, 255, 255, 0.42)",
    paddingBottom: 10,
  },
  textinputCnt: {
    display: "flex",
    height: 56,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    width: "95%",
    color: "rgba(158, 158, 158, 1)",
  },
  inputupiid: {
    width: "95%",
    paddingLeft: 12,
    color: "rgba(158, 158, 158, 1)",
  },
  inputField: {
    width: "95%",
    paddingLeft: 12,
    color: "rgba(158, 158, 158, 1)",
  },
  personicon: {
    height: 20,
    width: 20,
  },
  dropDown: {},
  dropdownList: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 8,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownText: {
    color: "rgba(158, 158, 158, 1)",
  },
  verifyText: {
    color: "rgba(169, 3, 210, 1)",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    paddingBottom: 15,
  },
  button: {
    backgroundColor: "#800080",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginVertical: 10
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default AddBankDetails;