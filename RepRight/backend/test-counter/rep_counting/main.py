import os
import sys
import cv2

# Repetition counter
from pkg.kps_metrics import KpsMetrics
from rep_counter import RepetitionCounter

DEFAULT_CONFIG_DIR = "./smart_trainer_config/config.json"

def main():
    rep_counter = RepetitionCounter(config_path=DEFAULT_CONFIG_DIR)
    rep_counter.set_metric("bicep_curls")
    
    vid = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    while vid.isOpened():
        ret, frame = vid.read()
        
        if not ret:
            break
        
        kps_norm = rep_counter.update_metric(frame)
        frame = rep_counter.draw_kps_skeleton(frame, kps_norm, 5)
        metric = rep_counter.get_metric(rep_counter.current_metric_name)
        
        cv2.putText(frame, f'Reps: {str(metric.reptition_count)}', (10, 30), 
        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
        
        cv2.imshow("frame", frame)
        print(f"Reps: {str(metric.reptition_count)}")
        
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
    vid.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
    