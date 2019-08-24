import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Header = ({ uploadImage }) => {
  return (
    <TouchableOpacity onPress={uploadImage} style={styles.headerStyle}>
      <Text>Upload New</Text>
      <Ionicons name="md-add-circle" style={styles.buttonStyle} />
    </TouchableOpacity>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 10
  },
  buttonStyle: {
    marginLeft: 10,
    fontSize: 40,
    color: "#4286f4"
  }
});
