import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Camera, CameraType } from "expo-camera/legacy";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";

export default function WorkoutScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); // Camera permission state
  const [camera, setCamera] = useState<Camera | null>(null); // Camera reference
  const [isCameraReady, setIsCameraReady] = useState(false); // To check if the camera is ready
  const [type, setType] = useState(CameraType.back); // Using legacy Camera.Constants
  const router = useRouter();

  // Request camera permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync(); // Using legacy permissions method
      setHasPermission(status === "granted");
    })();
  }, []);

  // Display permission messages based on status
  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={(ref) => setCamera(ref)}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View style={styles.buttonContainer}>
          {/* Button to flip the camera (front/back) */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === CameraType.back ? CameraType.front : CameraType.back
              );
            }}
          >
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </View>
      </Camera>

      {/* Button to navigate back */}
      <Button
        mode="contained"
        onPress={() => router.back()}
        style={styles.exitButton}
      >
        End Workout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  exitButton: {
    marginBottom: 20,
    alignSelf: "center",
  },
});
