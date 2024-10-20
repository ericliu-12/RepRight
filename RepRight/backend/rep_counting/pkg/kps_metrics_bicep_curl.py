from .kps_metrics import KpsMetrics
from .kps_constant import KPS_INDEX_DICT
from enum import Enum

class KpsMetricsBicepCurl(KpsMetrics):
    metric_names = Enum("BicepCurlMetricNames", [
        "shl_dist", "lshl_lwrist_dist", "rshl_rwrist_dist",
        "lelbow_angle", "relbow_angle"
    ])
    
    exercise_name = 'bicepcurl'
    
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
        states[self.metric_names.shl_dist.name] = self.distance(
            KPS_INDEX_DICT.left_shoulder.value,
            KPS_INDEX_DICT.right_shoulder.value,
            kps,
            'xy',
            ratio
        )
        
        # Distance between left shoulder and wrist
        states[self.metric_names.lshl_lwrist_dist.name] = self.distance(
            KPS_INDEX_DICT.left_shoulder.value,
            KPS_INDEX_DICT.left_wrist.value,
            kps,
            'y',
            ratio
        )
        
        # Distance between right shoulder and wrist
        states[self.metric_names.rshl_rwrist_dist.name] = self.distance(
            KPS_INDEX_DICT.right_shoulder.value,
            KPS_INDEX_DICT.right_wrist.value,
            kps,
            'y',
            ratio
        )
        
        # Angle at the left elbow
        states[self.metric_names.lelbow_angle.name] = self.angle(
            KPS_INDEX_DICT.left_elbow.value,
            KPS_INDEX_DICT.left_shoulder.value,
            KPS_INDEX_DICT.left_wrist.value,
            kps
        )
        
        # Angle at the right elbow
        states[self.metric_names.relbow_angle.name] = self.angle(
            KPS_INDEX_DICT.right_elbow.value,
            KPS_INDEX_DICT.right_shoulder.value,
            KPS_INDEX_DICT.right_wrist.value,
            kps
        )

    
    def get_metric_names(self):
        return self.metric_names

if __name__ == "__main__":
    jj = KpsMetricsBicepCurl()
    
