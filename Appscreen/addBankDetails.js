import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import { BackgroundImage } from "react-native-elements/dist/config";
import { useNavigation } from "@react-navigation/native";
import BASE_URL from "../backend/config/config";
export default function AddBankDetails() {
  const navigation = useNavigation();
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [selectedType, setSelectedType] = useState("UPI");
  const [upiIdText, setUpiIdText] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const accountOptions = ["UPI", "Account", "Credit Card"];

  const handleUpiIdChange = (text) => setUpiIdText(text);
  const handleAccountNumberChange = (text) => setAccountNumber(text);
  const handleBankNameChange = (text) => setBankName(text);
  const handleIfscCodeChange = (text) => setIfscCode(text);
  const handleCardNumberChange = (text) => setCardNumber(text);
  const handleCardHolderNameChange = (text) => setCardHolderName(text);
  const handleExpiryDateChange = (text) => setExpiryDate(text);
  const handleCvvChange = (text) => setCvv(text);

  const handleAccountSelection = (item) => {
    setSelectedType(item);
    setShowAccountDetails(false);
  };

  const verifyDetails = async () => {
    let url = "";
    let payload = {};

    if (selectedType === "UPI") {
      url =`${BASE_URL}api/verify/upi`;
      payload = { upiId: upiIdText };
    } else if (selectedType === "Account") {
      url =`${BASE_URL}api/verify/account`;
      payload = {
        accountNumber,
        bankName,
        ifscCode,
      };
    } else if (selectedType === "Credit Card") {
      url = `${BASE_URL}api/verify/creditcard`;
      payload = {
        cardNumber,
        cardHolderName,
        expiryDate,
        cvv,
      };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      console.error(error);
      alert("Failed to verify details");
    }
  };

  const verifyAndSave = async () => {
    if (!isVerified) {
      alert("Please verify the details before saving.");
      return;
    }

    const payload = {
      type: selectedType,
      upiId: upiIdText,
      accountNumber: accountNumber,
      bankName: bankName,
      ifscCode: ifscCode,
      cardNumber: cardNumber,
      cardHolderName: cardHolderName,
      expiryDate: expiryDate,
      cvv: cvv,
    };

    try {
        const response = await fetch(`${BASE_URL}api/saveBankDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      console.error(error);
      alert("Failed to save bank details");
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundImage
        source={require("../assets/bankbackground.png")}
        style={styles.backgroundImage}
      ></BackgroundImage>
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
}

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
    marginVertical: 10, // Added margin for spacing between buttons
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
