import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Text, Card, Title } from "react-native-paper";
import axios from "axios";

type Workout = { workout_id: number; workout_time: string }; // Update type to match the returned workout data structure

export default function WorkoutScreen() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentTime, setCurrentTime] = useState<string | null>(null); // Tracks the current workout's time

  // Fetch the most recent workout on mount
  useEffect(() => {
    fetchWorkout("recent");
  }, []);

  // Function to fetch workouts
  const fetchWorkout = async (
    direction: "next" | "prev" | "recent",
    workout_time: string | null = null
  ) => {
    try {
      const response = await axios.get("http://10.246.179.1:5000/workouts", {
        params: {
          workout_time: workout_time,
          direction: direction,
        },
      });

      if (response.data) {
        // console.log(response.data);
        const fetchedWorkout = {
          workout_id: response.data[0], // Assuming workout ID is at index 0
          workout_time: response.data[1], // Assuming workout time is at index 1 and converting to readable string
        };
        // console.log(fetchedWorkout);
        setWorkout(fetchedWorkout);
        setCurrentTime(fetchedWorkout.workout_time); // Update the current workout time with the raw value
        console.log(fetchedWorkout.workout_time);
      }
    } catch (error) {
      console.error("Error fetching workout:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.progressContainer}>
        <Title style={styles.title}>Workout Progress</Title>
        {workout ? (
          <Card style={styles.workoutCard}>
            <Card.Content>
              <Text>Workout ID: {workout.workout_id}</Text>
              <Text>Workout Time: {workout.workout_time}</Text>
            </Card.Content>
          </Card>
        ) : (
          <Text style={styles.noDataText}>No workout found.</Text>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {/* Previous button */}
        <Button
          mode="contained"
          onPress={() => fetchWorkout("prev", currentTime)} // Fetch previous workout
          disabled={!currentTime} // Disable if no workout is available
          style={styles.button}
        >
          Previous
        </Button>

        {/* Next button */}
        <Button
          mode="contained"
          onPress={() => fetchWorkout("next", currentTime)} // Fetch next workout
          disabled={!currentTime} // Disable if no workout is available
          style={styles.button}
        >
          Next
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
  },
});
