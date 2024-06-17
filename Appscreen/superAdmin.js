import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

export const SuperAdmin = () => {
  return (
    <View style={styles.adminWallet}>
      <View style={styles.container}>
        <View style={styles.overlapGroup}>
          <Image style={styles.maskGroup} source={require('../assets/Maskbackround.png')} />
          <ScrollView contentContainerStyle={styles.frame}>
            <View style={styles.frame2}>
              <View style={styles.headlineWrapper}>
                <Text style={styles.headline}>Hello, Admin</Text>
              </View>
              <View style={styles.balanceWrapper}>
                <View style={styles.balance}>
                  <Text style={styles.textWrapper2}>Available Balance</Text>
                  <Text style={styles.textWrapper3}>3450,784.89*</Text>
                </View>
              </View>
            </View>
            <View style={styles.frameWrapper}>
              <View style={styles.frame3}>
                <TouchableOpacity style={styles.topUp}>
                  <Image style={styles.img} source={require('../assets/money-bag.png')} />
                  <Text style={styles.textWrapper4}>Deposit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.topUp}>
                  <Image style={styles.img} source={require('../assets/money-dynamic-color.png')} />
                  <Text style={styles.textWrapper4}>Withdraw</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.topUp}>
                  <Image style={styles.img} source={require('../assets/explorer.png')} />
                  <Text style={styles.textWrapper4}>History</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  adminWallet: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  container: {
    backgroundColor: '#000000',
    height: 852,
    position: 'relative',
    width: 394,
  },
  overlapGroup: {
    height: 738,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 394,
  },
  maskGroup: {
    height: 188,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 393,
  },
  frame: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: 16,
    height: 689,
    left: 0,
    padding: 40,
    paddingTop: 0,
    position: 'absolute',
    top: 49,
    width: 393,
  },
  frame2: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    height: 206,
    justifyContent: 'center',
    padding: 16,
    position: 'relative',
    width: '100%',
  },
  headlineWrapper: {
    alignItems: 'center',
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    gap: 59,
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  headline: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '600',
    marginTop: -1,
    position: 'relative',
    whiteSpace: 'nowrap',
    width: 'fit-content',
  },
  balanceWrapper: {
    alignItems: 'center',
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  balance: {
    alignItems: 'center',
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  textWrapper2: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: -1,
    position: 'relative',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    width: 'fit-content',
  },
  textWrapper3: {
    color: '#ffffff',
    fontSize: 34,
    fontStyle: 'italic',
    fontWeight: '900',
    position: 'relative',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    width: 'fit-content',
  },
  frameWrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 26,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
    marginLeft: -16,
    marginRight: -16,
    padding: 16,
    position: 'relative',
    width: 393,
  },
  frame3: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#00000099',
    borderColor: '#5454585c',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    padding: 26,
    paddingHorizontal: 16,
    position: 'relative',
    width: '100%',
  },
  topUp: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    gap: 7,
    position: 'relative',
  },
  img: {
    height: 32,
    objectFit: 'cover',
    position: 'relative',
    width: 32,
  },
  textWrapper4: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '400',
    position: 'relative',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    width: 'fit-content',
  },
  topNavBarInstance: {
    left: 0,
    position: 'absolute',
    top: 0,
  },
  fiveToolBar: {
    left: 0,
    position: 'absolute',
    top: 819,
    width: 393,
  },
  elementToolBarInstance: {
    left: 129,
  },
});
