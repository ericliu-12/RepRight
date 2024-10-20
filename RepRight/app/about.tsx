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

export default function AboutScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  // State to hold workout data
  const [workouts, setWorkouts] = useState([]);
  const [showProgress, setShowProgress] = useState(false);

  // Fetch workouts from the backend
  const fetchhome = async () => {
    try {
      //   const response = await axios.get("http://10.246.179.1:5000/workouts");
      const response = await axios.get("http://100.64.26.136:5000/homescreen");
      //setWorkouts(response.data);
      // Convert the workouts array to a JSON string before passing it as a URL param
    //   router.push({
    //     pathname: "/data",
    //     params: { workouts: JSON.stringify(response.data) }, // Pass workout data as a string
    //   });
    } catch (error) {
      console.error("Error fetching homescreen:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Title style={[styles.title, { color: colors.primary }]}>
            About us
          </Title>
          <ScrollView style={styles.progressContainer}>


          <Paragraph style={[styles.subtitle, { color: colors.onSurface }]}>
            
Welcome to RepRight, the ultimate fitness companion designed to take your workout experience to the next level. Our app tracks your exercise reps automatically and even identifies the type of exercise you're performing, so you can focus entirely on achieving your fitness goals.

What We Do
At RepRight, we combine the power of cutting-edge technology with the simplicity of a user-friendly interface. Using TensorFlow and machine learning, our app can recognize and count your reps in real-time, whether you're doing push-ups, squats, or any other exercise. No more manual tracking—let us handle the numbers while you get stronger!

Key Features:
Automatic Rep Counting: Forget the hassle of keeping track of your reps. Our intelligent system counts them for you!
Exercise Recognition: Our advanced algorithms can identify different exercises, ensuring accurate tracking no matter your workout routine.
Easy-to-Use Interface: Built with React Native, our app provides a smooth and intuitive user experience, accessible to everyone from beginners to fitness enthusiasts.
Why Choose Us?
We know how important it is to stay motivated and track your progress. That&apos;s why we&apos;ve created a fitness app that does more than just count calories or log steps. Our mission is to offer a seamless fitness-tracking experience that helps you stay focused on your workout while delivering real-time insights into your progress.

Join the fitness revolution with RepRight and take the guesswork out of your workouts!
          </Paragraph>
          </ScrollView>
        </Card.Content>
      </Card>
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