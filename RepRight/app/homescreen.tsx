import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
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

  // State to track workout session and data
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [workoutId, setWorkoutId] = useState<number | null>(null);
  const [exerciseResults, setExerciseResults] = useState<
    [number, string, number][]
  >([]); // State to track array of arrays

  // Function to handle starting/stopping the workout
  const toggleWorkout = async () => {
    if (workoutStarted) {
      // Stop workout: Print out the exercise results and send them to the backend
      console.log("Workout completed. Exercise Results:", exerciseResults);

      // Send exercise results to the backend to store in the exercise_reps table
      try {
        const response = await axios.post(
          "http://10.246.179.1:5000/store_exercise_reps",
          {
            workout_id: workoutId,
            exercises: exerciseResults,
          }
        );

        if (response.status === 200) {
          console.log("Exercise data stored successfully:", response.data);
          // Optionally, clear the exerciseResults state after sending the data
          setExerciseResults([]);
        } else {
          console.error("Failed to store exercise data.");
        }
      } catch (error) {
        console.error("Error sending exercise data:", error);
      }

      // Reset the workout state
      setWorkoutStarted(false);
    } else {
      // Start workout
      const response = await axios.post(
        "http://10.246.179.1:5000/start_workout"
      );
      const { workout_id } = response.data;
      setWorkoutId(workout_id); // Store workout_id in state
      console.log(workout_id);
      setWorkoutStarted(true);
    }
  };

  // Function to fetch workouts from the backend
  const fetchWorkouts = async () => {
    try {
      const response = await axios.get("http://10.246.179.1:5000/workouts");
      setWorkouts(response.data);
      router.push({
        pathname: "/data",
        params: { workouts: JSON.stringify(response.data) },
      });
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  // Function to start an exercise and store its result
  const startExercise = async () => {
    try {
      // Send a POST request to start the exercise
      const response = await axios.post(
        "http://10.246.179.1:5000/start_exercise"
      );

      // Extract the exercise name and rep count from the response
      const exerciseName = response.data.exercise_name;
      const repCount = parseInt(response.data.rep_count, 10); // Ensure repCount is a number

      if (workoutId !== null) {
        // Store the workout_id, exercise_name, and repCount in the state
        setExerciseResults((prevResults) => [
          ...prevResults,
          [workoutId, exerciseName, repCount],
        ]);
      } else {
        console.error("Workout ID is not available.");
      }

      console.log("Exercise Name:", exerciseName);
      console.log("Rep Count:", repCount);
    } catch (error) {
      console.error("Error starting exercise:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Image
          source={require("../assets/images/Repright_logo_trans.png")}
          style={styles.logo} // Refer to the logo style for sizing
          resizeMode="contain" // This ensures the image scales properly
        />
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
            onPress={toggleWorkout} // Toggle workout start/stop
            style={styles.button}
            buttonColor={colors.primary}
          >
            {workoutStarted ? "Stop Workout" : "Start Workout"}
          </Button>

          {/* New button for starting an exercise */}
          {workoutStarted && (
            <Button
              mode="contained"
              onPress={startExercise} // Start exercise and execute Python script
              style={styles.button}
              buttonColor={colors.primary}
            >
              Start Exercise
            </Button>
          )}

          <Button
            mode="contained"
            onPress={fetchWorkouts} // Fetch data when "View Progress" is pressed
            style={styles.button}
            buttonColor={colors.primary}
          >
            View Progress
          </Button>

          <Button
            mode="contained"
            onPress={() => router.push("/about")} // Navigate to About screen
            style={styles.button}
            buttonColor={colors.primary}
          >
            About Us
          </Button>
        </View>

        {/* Conditionally show the exercise results */}
        {exerciseResults.length > 0 && (
          <View style={styles.progressContainer}>
            <Title style={[styles.title, { color: colors.primary }]}>
              Exercise Results
            </Title>
            {exerciseResults.map((result, index) => (
              <Card key={index} style={styles.workoutCard}>
                <Card.Content>
                  <Text>Workout ID: {result[0]}</Text>
                  <Text>Exercise Name: {result[1]}</Text>
                  <Text>Reps: {result[2]}</Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures that ScrollView uses the entire available space
  },
  container: {
    flex: 1,
    justifyContent: "flex-start", // Align content closer to the top
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    marginBottom: 40, // Adjust margin for spacing
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
  logo: {
    width: 200, // Adjust based on the desired width
    height: 100, // Adjust based on the desired height
    marginBottom: 10, // Reduce the space below the logo
  },
});
