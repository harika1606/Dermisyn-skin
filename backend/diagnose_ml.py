import torch
import torch.nn as nn
import timm
import os

PATHS = [
    r"c:\skin\backend\models\best_model_v4.pth",
    r"c:\skin\backend\models\best_model_v3.pth",
    r"c:\skin\backend\deploy_model.pth"
]

def check_pth(path):
    if not os.path.exists(path):
        return f"MISSING {path}"
    
    try:
        data = torch.load(path, map_location="cpu")
        state_dict = data["model_state_dict"] if isinstance(data, dict) and "model_state_dict" in data else data
        
        # Check Final Layer
        if "head.fc.weight" in state_dict:
            classes = state_dict["head.fc.weight"].shape[0]
            feature_dim = state_dict["head.fc.weight"].shape[1]
        elif "head.weight" in state_dict:
            classes = state_dict["head.weight"].shape[0]
            feature_dim = state_dict["head.weight"].shape[1]
        elif "fc.weight" in state_dict:
            classes = state_dict["fc.weight"].shape[0]
            feature_dim = state_dict["fc.weight"].shape[1]
        else:
            # Fallback scan all keys
            classes = "Unknown"
            feature_dim = "Unknown"
            for k in state_dict.keys():
                if "weight" in k and len(state_dict[k].shape) == 2:
                   if state_dict[k].shape[0] in [7, 8]:
                       classes = state_dict[k].shape[0]
                       feature_dim = state_dict[k].shape[1]
        
        # Swin Tiny feature dim IS typically 768? No, Tiny is 768?
        # Swin T: 768
        # Swin B: 1024
        
        return f"PATH: {path} | CLASSES: {classes} | FEAT_DIM: {feature_dim}"
    except Exception as e:
        return f"ERROR {path}: {str(e)}"

print("\n--- ML WEIGHT AUDIT ---\n")
for p in PATHS:
    print(check_pth(p))
print("\n--- AUDIT COMPLETE ---\n")
