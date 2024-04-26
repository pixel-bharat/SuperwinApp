import React from "react";
 import {SafeAreaView,TouchableOpacity,View,Image,StyleSheet,FlatList,Text ,ScrollView} from "react-native";


 const ImageComponent1 = ({navigation}) => (
  <TouchableOpacity   onPress={() => navigation.navigate("movieDetailScreen")}>
    <View style={styles.item}>
      <Image source={require("../assets/saber.png")} />
    </View>
  </TouchableOpacity>
  
);
const ImageComponent2 = () => (
  <View style={styles.item}>
    <Image source={require("../assets/saber.png")} />
  </View>
);

const ImageComponent3 = () => (
  <View style={styles.item}>
    <Image
      source={require("../assets/saber.png")}
      style={{ height: 180, width: 105, borderRadius: 10 }}
    />
  </View>
);
const data1 = [
  { id: "1", Component: ImageComponent1 },
  { id: "2", Component: ImageComponent2 },
  { id: "3", Component: ImageComponent3 },

];
  const carsollScreen =({})=>{
    return(
<SafeAreaView>
<ScrollView>
          <View style={{width:'100%',paddingVertical:10,paddingHorizontal:10}}>
            <Text style={styles.heading}>Action Movies</Text>
            <FlatList
              data={data1}
              renderItem={({ item }) => <item.Component />}
              keyExtractor={(item) => item.id}
              horizontal
            />
          </View>
        </ScrollView>
</SafeAreaView>
    )
  }
 export default carsollScreen;
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "black",
      flex: 1,
    },
    heading: { color: "white", paddingLeft: 20, margin: 8 },
    item: {
  paddingVertical:20,paddingHorizontal:20,
      height: 180,
      width: 120,
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 15,
    },
    searchInput: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#ccc",
      borderColor: "rgba(60, 207, 239, 1)",
      width: "80%",
      height: 38,
      marginTop: 30,
      paddingLeft: 10,
      color: "white",
      paddingRight: 20,
    },
  });