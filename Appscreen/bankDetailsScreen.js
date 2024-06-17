import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { BackgroundImage } from "react-native-elements/dist/config";
import { useNavigation, useIsFocused } from "@react-navigation/native";
export default function BankDetailsScreen() {
  const navigation = useNavigation();
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [showUPIDetails, setShowUPIDetails] = useState(false);
  const [accountIconUp, setAccountIconUp] = useState(true);
  const [upiIconUp, setUpiIconUp] = useState(true);

  const toggleAccountDetails = () => {
    setShowAccountDetails(!showAccountDetails);
    setAccountIconUp(!accountIconUp);
  };

  const toggleUPIDetails = () => {
    setShowUPIDetails(!showUPIDetails);
    setUpiIconUp(!upiIconUp);
  };

  return (
    <View style={styles.container}>
      <BackgroundImage
        source={require("../assets/bankbackground.png")}
        style={styles.backgroundImage}
      >
        <View style={styles.in_cont}>
          <View style={styles.headingCnt}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require("../assets/back.png")}
                style={styles.backButton}
              />
            </TouchableOpacity>

            <Text style={styles.mainHeading}>Bank Details</Text>
          </View>
          <View style={styles.bankDetailsCnt}>
            <TouchableOpacity onPress={toggleAccountDetails}>
              <View style={styles.accountCnt}>
                <Text style={styles.bankDetailsText}>Bank Account</Text>

                <Image
                  source={
                    accountIconUp
                      ? require("../assets/upArrow.png")
                      : require("../assets/downArrow.png")
                  }
                  style={styles.upArrowlogo}
                />
              </View>
              {showAccountDetails && (
                <>
                  <View style={styles.line} />
                  <Text style={styles.bankDetailsText}>Hdfc Bank</Text>
                  <Text style={styles.bankDetailsText}>
                    Account No: 343***********34234
                  </Text>
                  <Text style={styles.bankDetailsText}>
                    IFSC Code: HDFC45674
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.bankDetailsCnt}>
            <TouchableOpacity onPress={toggleUPIDetails}>
              <View style={styles.accountCnt}>
                <Text style={styles.bankDetailsText}>UPI</Text>

                <Image
                  source={
                    upiIconUp
                      ? require("../assets/upArrow.png")
                      : require("../assets/downArrow.png")
                  }
                  style={styles.upArrowlogo}
                />
              </View>
              {showUPIDetails && (
                <>
                  <View style={styles.line} />
                  <Text style={styles.bankDetailsText}>Hdfc Bank</Text>
                  <Text style={styles.bankDetailsText}>
                    UPI ID: dgjies@okhdfc
                  </Text>
                  <Text style={styles.bankDetailsText}>Name: John Cena</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("addBankDetails")}
          >
            <Text style={styles.buttonText}>ADD BANK DETAILS</Text>
          </TouchableOpacity>
        </View>
      </BackgroundImage>
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
    marginBottom: 16,
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
  bankDetailsCnt: {
    display: "flex",
    padding: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 10,
    alignSelf: "stretch",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(84, 84, 88, 0.36)",
    backgroundColor: "rgba(0, 0, 0, 0.60)",
    marginVertical: 10,
  },
  accountCnt: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  line: {
    height: 1,
    backgroundColor: "#434343",
    marginVertical: 10,
  },
  bankDetailsText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 10,
  },
  dropDownButton: {
    height: 32,
    width: 32,
  },
  button: {
    backgroundColor: "#800080",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
