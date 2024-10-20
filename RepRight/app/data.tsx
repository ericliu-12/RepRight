import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Button, Text, Card, Title, useTheme } from "react-native-paper";
import axios from "axios";
import { BarChart } from "react-native-chart-kit";

type Workout = { workout_id: number; workout_time: string };
type Exercise = [string, number];

export default function WorkoutScreen() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentId, setCurrentId] = useState<number | null>(null); // Tracks the current workout's ID
  const [loading, setLoading] = useState<boolean>(true); // Add a loading state
  const { colors } = useTheme(); // Get the theme colors

  // Fetch the most recent workout on mount
  useEffect(() => {
    fetchWorkout("recent");
  }, []);

  // Function to fetch workouts by workout_id
  const fetchWorkout = async (
    direction: "next" | "prev" | "recent",
    workout_id: number | null = null
  ) => {
    try {
      setLoading(true); // Set loading to true when fetching data
      const response = await axios.get("http://10.246.179.1:5000/workouts", {
        params: {
          workout_id: workout_id,
          direction: direction,
        },
      });

      if (response.data) {
        const fetchedWorkout = {
          workout_id: response.data.workout[0],
          workout_time: response.data.workout[1],
        };
        setWorkout(fetchedWorkout);
        setCurrentId(fetchedWorkout.workout_id); // Update the current workout ID with the returned value
        console.log(response.data);
        // Ensure rep_count is converted to a number
        const fetchedExercises = response.data.exercises;

        // Set the exercises data
        setExercises(fetchedExercises);
      }
    } catch (error) {
      console.error("Error fetching workout:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  // Prepare data for the BarChart and ensure valid data
  const exerciseLabels = exercises.map((exercise) => exercise[0]);
  const repCounts = exercises.map((exercise) => exercise[1]);

  // Set the min and max Y-axis values dynamically
  const maxRep = Math.max(...repCounts) + 10;
  const minRep = Math.min(...repCounts) - 10;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.progressContainer}>
        <Title style={[styles.title, { color: colors.primary }]}>
          Workout Progress
        </Title>
        {loading ? (
          <Text style={{ color: colors.primary }}>Loading...</Text>
        ) : workout ? (
          <>
            <Card
              style={[styles.workoutCard, { backgroundColor: colors.surface }]}
            >
              <Card.Content>
                <Text>Workout ID: {workout.workout_id}</Text>
                <Text>Workout Time: {workout.workout_time}</Text>
              </Card.Content>
            </Card>

            {exercises.length > 0 && (
              <View style={styles.chartContainer}>
                <BarChart
                  data={{
                    labels: exerciseLabels, // Exercise names
                    datasets: [
                      {
                        data: repCounts, // Rep counts for each exercise
                      },
                    ],
                  }}
                  width={Dimensions.get("window").width - 40} // Adjust the width to fit the screen
                  height={250} // Slightly increased height for better display
                  yAxisLabel=""
                  yAxisSuffix=" reps" // Suffix to add to the Y-axis values
                  chartConfig={{
                    backgroundColor: "#ffffff", // White background for the chart
                    backgroundGradientFrom: "#ffffff", // White gradient for the chart
                    backgroundGradientTo: "#ffffff", // White gradient for the chart
                    decimalPlaces: 0, // No decimals for rep counts
                    color: (opacity = 1) => colors.primary, // Dark purple bars
                    labelColor: (opacity = 1) => colors.primary, // Dark purple text
                    style: {
                      borderRadius: 16,
                      shadowColor: "#000", // Adding shadow to the box
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                      padding: 10, // Add padding for the chart
                    },
                    propsForDots: {
                      r: "6", // Size of the dots
                      strokeWidth: "2",
                      stroke: colors.onPrimary, // Dot stroke color
                    },
                    propsForBackgroundLines: {
                      stroke: colors.outline, // Background lines color
                    },
                    barPercentage: 0.9, // Thicker bars and reduced gap
                  }}
                  fromZero={true} // Start the Y-axis from zero
                  yAxisInterval={1} // Optional: How many ticks per Y-axis interval
                  withHorizontalLabels={true} // Show horizontal labels
                  withVerticalLabels={true} // Show vertical labels
                  withInnerLines={false} // No inner grid lines
                  showBarTops={false} // Turn off bar tops to avoid extra lines
                  segments={4} // Number of Y-axis segments
                  showValuesOnTopOfBars={true} // Show values on top of bars
                  yMin={minRep} // Min limit for Y-axis
                  yMax={maxRep} // Max limit for Y-axis
                  style={{
                    marginVertical: 10, // Add margin for better spacing
                    paddingHorizontal: 20, // Padding around the graph
                    borderRadius: 16,
                  }}
                />
              </View>
            )}
          </>
        ) : (
          <Text style={[styles.noDataText, { color: colors.primary }]}>
            No workout found.
          </Text>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {/* Previous button */}
        <Button
          mode="contained"
          onPress={() => fetchWorkout("prev", currentId)} // Fetch previous workout by ID
          disabled={!currentId} // Disable if no workout is available
          style={styles.button}
        >
          Previous
        </Button>

        {/* Next button */}
        <Button
          mode="contained"
          onPress={() => fetchWorkout("next", currentId)} // Fetch next workout by ID
          disabled={!currentId} // Disable if no workout is available
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
  chartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
