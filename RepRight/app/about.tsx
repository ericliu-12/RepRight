import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { theme } from "./theme.ts"; // Make sure to import the theme from your theme file

export default function AboutMeScreen() {
  const router = useRouter();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Image
        source={require("../assets/images/Repright_logo_trans.png")}
        style={styles.logo} // Refer to the logo style for sizing
        resizeMode="contain" // This ensures the image scales properly
      />
      <Text style={[styles.header, { color: theme.colors.primary }]}>
        About Me
      </Text>
      <Text style={[styles.description, { color: theme.colors.onBackground }]}>
        Howdy! Our names are Eric, Jesse, Kane, and Vincent and we are the
        creators of RepRight. We created this app as part of the Tidal Fall 2024
        Hackathon as a way to automaticall track your workouts and we hope y'all
        enjoy it as much as we loved creating it.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 40,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logo: {
    width: 300, // Adjust based on the desired width
    height: 200, // Adjust based on the desired height
    marginBottom: 20, // Add some space between the logo and the card below
  },
});
