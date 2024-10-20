import os
import cv2
import mediapipe as mp
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
from rep_counting.pkg.kps_metrics import KpsMetrics
from rep_counting.rep_counter import RepetitionCounter

# MediaPipe Pose initialization
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Define exercise labels and load pre-trained model
labels = ['barbell biceps curl', 'push up', 'squat']
label_encoder = LabelEncoder()
labels_encoded = label_encoder.fit_transform(labels)
new_model = tf.keras.models.load_model('RepModel.keras')

# Load repetition counter configuration
DEFAULT_CONFIG_DIR = "./rep_counting/smart_trainer_config/config.json"
exercise_dict = {'barbell biceps curl': 'bicep_curls', 'push up': 'push_ups', 'squat': 'squats'}

# Video capture from webcam
vid = cv2.VideoCapture(0)
if not vid.isOpened():
    print("Error opening video file")
    exit()

# Helper function to extract keypoints using MediaPipe
def extract_keypoints(image):
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(rgb_image)
    if not results.pose_landmarks:
        return np.zeros(33*3)
    keypoints = []
    for landmark in results.pose_landmarks.landmark:
        keypoints.append([landmark.x, landmark.y, landmark.z])
    return np.array(keypoints).flatten()

# Initialize variables
dict1 = {}
maxv = None  # Initialize maxv to track the most frequent prediction
rep_counter = None  # Initialize rep_counter later after warmup
warmup_complete = False  # Flag to track warmup completion

while vid.isOpened():
    ret, frame = vid.read()
    if not ret:
        break
    
    # Warm-up phase: collect 30 frames to predict the exercise
    if sum(dict1.values()) < 30:
        keypoints = extract_keypoints(frame)
        keypoints = np.expand_dims(keypoints, axis=0)
        prediction = new_model.predict(keypoints)
        predicted_class = label_encoder.inverse_transform([np.argmax(prediction)])[0]
        
        # Update prediction frequency
        if predicted_class not in dict1:
            dict1[predicted_class] = 1
        else:
            dict1[predicted_class] += 1
        
        # Display warm-up status
        cv2.putText(frame, f'Warmup reps!', (10, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
        print(predicted_class)
    
    # Once 30 frames have been processed, determine the exercise and initialize the counter
    if sum(dict1.values()) == 30 and not warmup_complete:
        maxv = max(dict1, key=dict1.get)  # Determine the most frequent prediction
        rep_counter = RepetitionCounter(config_path=DEFAULT_CONFIG_DIR)  # Initialize rep counter
        rep_counter.set_metric(exercise_dict[maxv])  # Set the metric based on the identified exercise
        warmup_complete = True  # Mark warm-up as complete
    
    # Rep counting phase: if warm-up is complete, start counting reps
    if warmup_complete:
        cv2.putText(frame, f'Exercise: {maxv}', (10, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
        
        # Extract and normalize keypoints for rep counting
        keypoints = extract_keypoints(frame)
        kps_norm = rep_counter.update_metric(frame)
        
        # Draw the skeleton on the frame
        frame = rep_counter.draw_kps_skeleton(frame, kps_norm, 5)
        
        # Get the current repetition count and display it
        metric = rep_counter.get_metric(rep_counter.current_metric_name)
        cv2.putText(frame, f'Reps: {str(metric.reptition_count)}', (10, frame.shape[0] - 10), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

    # Display the video feed with annotations
    cv2.imshow("Video classification", frame)
        
    # Break the loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

# Release video capture and close windows
vid.release()
cv2.destroyAllWindows()

print(exercise_dict[maxv])
print(metric.reptition_count)