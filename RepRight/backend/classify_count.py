import os
import cv2
import mediapipe as mp
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras import layers, models

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

def extract_keypoints(image):
    # convert image to RGB
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(rgb_image)

    # if no landmarks (joints) return zeros
    if not results.pose_landmarks:
        return np.zeros(33*3)
    
    # get keypoints in (x,y,z) coordinates format
    keypoints = []
    for landmark in results.pose_landmarks.landmark:
        keypoints.append([landmark.x, landmark.y, landmark.z])
    return np.array(keypoints).flatten()

labels = ['barbell biceps curl', 'push up', 'squat']

# encode exercise names into numerical format
from sklearn.preprocessing import LabelEncoder
label_encoder = LabelEncoder()
labels_encoded = label_encoder.fit_transform(labels)

# load model
new_model = tf.keras.models.load_model('RepModel.keras')

# Repetition counter
from rep_counting.pkg.kps_metrics import KpsMetrics
from rep_counting.rep_counter import RepetitionCounter

DEFAULT_CONFIG_DIR = "./rep_counting/smart_trainer_config/config.json"

exercise_dict = {'barbell biceps curl': 'bicep_curls', 'push up': 'push_ups', 'squat': 'squats'}

vid = cv2.VideoCapture(0, cv2.CAP_DSHOW)
if not vid.isOpened():
    print("Error opening video file")
dict1 = {}
maxv = None  # Initialize maxv to negative infinity
curv = None

rep_counter = RepetitionCounter(config_path=DEFAULT_CONFIG_DIR)
# rep_counter.set_metric("bicep_curls")

while vid.isOpened():
    ret, frame = vid.read()
    if not ret:
        break
        
    if sum(dict1.values()) < 30:
        for v in dict1:
            if maxv == None or dict1[v] > dict1[maxv]:
                cur1 = dict1[v]
                curv = v
                max1 = cur1
                maxv = curv
        
        keypoints = extract_keypoints(frame)
        keypoints = np.expand_dims(keypoints, axis=0)
        prediction = new_model.predict(keypoints)
        predicted_class = label_encoder.inverse_transform([np.argmax(prediction)])
        if predicted_class[0] not in dict1:
            dict1[predicted_class[0]] =1
        else:
            dict1[predicted_class[0]] +=1
        lol = max(dict1, key=dict1.get)
        
        cv2.putText(frame, f'Warmup reps!', (10, 30), 
            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

        print(predicted_class)
    
    # cv2.putText(frame, f'Predicted: {predicted_class[0]}', (10, 30), 
    #     cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
    # print(predicted_class)
    # cv2.putText(frame, f'Predicted: {predicted_class[0]}', (10, 30), 
    #     cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
    
    elif sum(dict1.values()) == 30:
        rep_counter.set_metric(exercise_dict[maxv])
        dict1[maxv] += 1
    
    else:
        cv2.putText(frame, f'Predicted: {maxv}', (10, 30), 
        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
        kps_norm = rep_counter.update_metric(frame)
        frame = rep_counter.draw_kps_skeleton(frame, kps_norm, 5)
        metric = rep_counter.get_metric(rep_counter.current_metric_name)
        
        cv2.putText(frame, f'Reps: {str(metric.reptition_count)}', (10, frame.shape[0] - 10), 
            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
        cv2.putText(frame, f'Predicted: {maxv}', (10, 30), 
            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
    
    cv2.imshow("Video classification", frame)
        
    # break loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break
vid.release()
cv2.destroyAllWindows()