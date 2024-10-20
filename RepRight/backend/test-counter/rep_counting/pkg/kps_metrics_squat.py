from .kps_metrics import KpsMetrics
from .kps_constant import KPS_INDEX_DICT
from enum import Enum

class KpsMetricsSquat(KpsMetrics):
    metric_names = Enum("SquatMetricNames", [
        "hip_dist", "lhip_lankle_dist", "rhip_rankle_dist",
        "lknee_angle", "rknee_angle"
    ])
    
    exercise_name = 'squat'
    
    def __init__(self, low_pass_filter=True, low_pass_filter_alpha=0.4, config_path=None):
        super().__init__(low_pass_filter=low_pass_filter,
                         low_pass_filter_alpha=low_pass_filter_alpha,
                         config_path=config_path)
    
    def get_exercise_name(self) -> str:
        return self.exercise_name.lower()
        
    def _get_query_pattern(self) -> list[int]:
        return [0, 1, 0]
    
    def _process_metrics(self, kps, states, ratio):
        # Distance between shoulder and elbow
        states[self.metric_names.hip_dist.name] = self.distance(
            KPS_INDEX_DICT.left_hip.value,
            KPS_INDEX_DICT.right_hip.value,
            kps,
            'xy',
            ratio
        )
        
        # Distance between left shoulder and wrist
        states[self.metric_names.lhip_lankle_dist.name] = self.distance(
            KPS_INDEX_DICT.left_hip.value,
            KPS_INDEX_DICT.left_ankle.value,
            kps,
            'xy',
            ratio
        )
        
        # Distance between right shoulder and wrist
        states[self.metric_names.rhip_rankle_dist.name] = self.distance(
            KPS_INDEX_DICT.right_hip.value,
            KPS_INDEX_DICT.right_ankle.value,
            kps,
            'xy',
            ratio
        )
        
        # Angle at the left elbow
        states[self.metric_names.lknee_angle.name] = self.angle(
            KPS_INDEX_DICT.left_knee.value,
            KPS_INDEX_DICT.left_hip.value,
            KPS_INDEX_DICT.left_ankle.value,
            kps
        )
        
        # Angle at the right elbow
        states[self.metric_names.rknee_angle.name] = self.angle(
            KPS_INDEX_DICT.right_knee.value,
            KPS_INDEX_DICT.right_hip.value,
            KPS_INDEX_DICT.right_ankle.value,
            kps
        )

    
    def get_metric_names(self):
        return self.metric_names

if __name__ == "__main__":
    jj = KpsMetricsSquat()
    