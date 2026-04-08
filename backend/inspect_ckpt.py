import torch
import os

MODEL_WEIGHTS_PATH = r"c:\skin\backend\models\best_model_v4.pth"
print(f"Inspecting {MODEL_WEIGHTS_PATH}")

if os.path.exists(MODEL_WEIGHTS_PATH):
    ckpt = torch.load(MODEL_WEIGHTS_PATH, map_location="cpu", weights_only=False)
    state_dict = ckpt["model_state_dict"] if isinstance(ckpt, dict) and "model_state_dict" in ckpt else ckpt
    
    # Check head weights
    for k in state_dict.keys():
        if "head" in k.lower() and "weight" in k.lower():
            print(f"Layer: {k}, Shape: {state_dict[k].shape}")
            
    # Check if there's a class_names list in the checkpoint
    if isinstance(ckpt, dict) and "classes" in ckpt:
        print(f"Found class names in ckpt: {ckpt['classes']}")
    elif isinstance(ckpt, dict) and "class_to_idx" in ckpt:
        print(f"Found class_to_idx in ckpt: {ckpt['class_to_idx']}")
else:
    print("File not found.")
