import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const ImageCard = ({ uri, date, removeImage, itemKey }) => {
  const formattedDate = String(date).substr(0, 15);
  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri }} style={styles.imageStyle} />
      <View style={styles.footerStyle}>
        <Text style={styles.dateStyle}>{formattedDate}</Text>
        <View style={styles.buttonsContainer}>
          <Ionicons
            style={styles.heartIconStyle}
            name="md-heart"
            size={40}
            color="#fb7777"
          />
          <Ionicons
            name="md-trash"
            color="#004"
            size={40}
            onPress={() => {
              removeImage(itemKey);
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default ImageCard;

// get the dimensions of the device
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0.5,
    paddingBottom: 0.5,
    marginTop: 20,
    backgroundColor: "#f8f9ff"
  },
  imageStyle: {
    width: width,
    height: height / 2
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row"
  },
  footerStyle: {
    width: width,
    display: "flex",
    flex: 1,
    flexDirection: "row",
    paddingTop: 10,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#69fb0020"
  },
  heartIconStyle: {
    marginRight: 10
  }
});
