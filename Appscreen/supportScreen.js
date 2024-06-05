import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { BackgroundImage } from "react-native-elements/dist/config";
import { useNavigation } from "@react-navigation/native";

export default function SupportScreen() {
  const navigation = useNavigation();
  const [faq1, setFaq1] = useState(false);
  const [faq2, setFaq2] = useState(false);
  const [faq3, setFaq3] = useState(false);
  const [faq4, setFaq4] = useState(false);
  const [faq5, setFaq5] = useState(false);

  const toggleFaq = (faqNum) => {
    switch (faqNum) {
      case 1:
        setFaq1(!faq1);
        break;
      case 2:
        setFaq2(!faq2);
        break;
      case 3:
        setFaq3(!faq3);
        break;
      case 4:
        setFaq4(!faq4);
        break;
      case 5:
        setFaq5(!faq5);
        break;
      default:
        break;
    }
  };

  const getIconSource = (faqNum) => {
    switch (faqNum) {
      case 1:
        return faq1
          ? require("../assets/upArrow.png")
          : require("../assets/downArrow.png");
      case 2:
        return faq2
          ? require("../assets/upArrow.png")
          : require("../assets/downArrow.png");
      case 3:
        return faq3
          ? require("../assets/upArrow.png")
          : require("../assets/downArrow.png");
      case 4:
        return faq4
          ? require("../assets/upArrow.png")
          : require("../assets/downArrow.png");
      case 5:
        return faq5
          ? require("../assets/upArrow.png")
          : require("../assets/downArrow.png");
      default:
        return require("../assets/downArrow.png");
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundImage
        source={require("../assets/bankbackground.png")}
        style={styles.backgroundImage}
      ></BackgroundImage>
      <ScrollView style={styles.content}>
        <View>
          <View style={styles.headingCnt}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require("../assets/back.png")}
                style={styles.backButton}
              />
            </TouchableOpacity>
            <Text style={styles.mainHeading}>Support</Text>
          </View>

          {[1, 2, 3, 4, 5].map((faqNum) => (
            <TouchableOpacity
              key={faqNum}
              style={styles.faqCnt}
              onPress={() => toggleFaq(faqNum)}
            >
              <View style={styles.accountCnt}>
                <Text style={styles.bankDetailsText}>FAQ {faqNum}</Text>
                <Image
                  source={getIconSource(faqNum)}
                  style={styles.upArrowlogo}
                />
              </View>
              {faqNum === 1 && faq1 && (
                <>
                  <View style={styles.line} />
                  <Text style={styles.bankDetailsText}>Answer 1</Text>
                </>
              )}
              {faqNum === 2 && faq2 && (
                <>
                  <View style={styles.line} />
                  <Text style={styles.bankDetailsText}>Answer 2</Text>
                </>
              )}
              {faqNum === 3 && faq3 && (
                <>
                  <View style={styles.line} />
                  <Text style={styles.bankDetailsText}>Answer 3</Text>
                </>
              )}
              {faqNum === 4 && faq4 && (
                <>
                  <View style={styles.line} />
                  <Text style={styles.bankDetailsText}>Answer 4</Text>
                </>
              )}
              {faqNum === 5 && faq5 && (
                <>
                  <View style={styles.line} />
                  <Text style={styles.bankDetailsText}>Answer 5</Text>
                </>
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>CHAT SUPPORT</Text>
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
  content: {
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

  faqCnt: {
    display: "flex",
    padding: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 5,
    alignSelf: "stretch",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(84, 84, 88, 0.36)",
    backgroundColor: "rgba(0, 0, 0, 0.60)",
    marginVertical: 8,
  },
  accountCnt: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
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
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
