import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Button,
  Text,
  Card,
  Title,
  Paragraph,
  useTheme,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  // Access the custom theme's colors
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Title style={[styles.title, { color: colors.primary }]}>
            Welcome to RepRight
          </Title>
          <Paragraph style={[styles.subtitle, { color: colors.onSurface }]}>
            Track your progress and improve your form!
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => router.push("/workout")}
          style={styles.button}
          color={colors.primary}
        >
          Start Workout
        </Button>
        <Button
          mode="contained"
          onPress={() => alert("View Progress pressed!")}
          style={styles.button}
          color={colors.secondary}
        >
          View Progress
        </Button>
        <Button
          mode="contained"
          onPress={() => alert("Settings pressed!")}
          style={styles.button}
          color={colors.secondary}
        >
          Settings
        </Button>
      </View>

      <StatusBar style="auto" />
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
  card: {
    width: "100%",
    marginBottom: 40,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  button: {
    marginBottom: 15,
    borderRadius: 5,
  },
});
