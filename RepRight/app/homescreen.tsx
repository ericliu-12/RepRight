import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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
import axios from "axios";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  // State to hold workout data
  const [workouts, setWorkouts] = useState([]);
  const [showProgress, setShowProgress] = useState(false);

  // Fetch workouts from the backend
  const fetchWorkouts = async () => {
    try {
      //   const response = await axios.get("http://10.246.179.1:5000/workouts");
      const response = await axios.get("http://100.64.26.136:5000/workouts");
      setWorkouts(response.data);
      // Convert the workouts array to a JSON string before passing it as a URL param
      router.push({
        pathname: "/data",
        params: { workouts: JSON.stringify(response.data) }, // Pass workout data as a string
      });
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

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
          buttonColor={colors.primary}
        >
          Start Workout
        </Button>

        <Button
          mode="contained"
          onPress={fetchWorkouts} // Fetch data when "View Progress" is pressed
          style={styles.button}
          buttonColor={colors.primary} // Use theme accent color
        >
          View Progress
        </Button>

        <Button
          mode="contained"
          onPress={() => alert("Login pressed!")}
          style={styles.button}
          buttonColor={colors.primary}
        >
          Login
        </Button>
      </View>

      {/* Conditionally show the workout data */}
      {showProgress && (
        <ScrollView style={styles.progressContainer}>
          <Title style={[styles.title, { color: colors.primary }]}>
            Workout Progress
          </Title>
          {workouts.length > 0 ? (
            workouts.map((workout, index) => (
              <Card key={index} style={styles.workoutCard}>
                <Card.Content>
                  <Text>Workout ID: {workout[0]}</Text>
                  <Text>Workout Time: {workout[1]}</Text>
                  <Text>User ID: {workout[2]}</Text>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={styles.noDataText}>No workouts found.</Text>
          )}
        </ScrollView>
      )}

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
  progressContainer: {
    marginTop: 20,
    width: "100%",
  },
  workoutCard: {
    marginBottom: 15,
    padding: 10,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
