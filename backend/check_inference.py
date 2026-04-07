import os
import torch
import torch.nn as nn
import timm
import numpy as np
from PIL import Image
import albumentations as A
from albumentations.pytorch import ToTensorV2

# Constants from model_utils.py
IMG_SIZE = 224
MODEL_NAME = "swin_tiny_patch4_window7_224"
MODEL_WEIGHTS_PATH = r"c:\skin\backend\models\best_model_v4.pth"

def get_transforms():
    return A.Compose([
        A.Resize(IMG_SIZE, IMG_SIZE),
        A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ToTensorV2(),
    ])

def test_inference(image_path=None):
    device = torch.device("cpu")
    print(f"--- STARTING ML RECOVERY TEST ---")
    
    # 1. Initialize
    model = timm.create_model(MODEL_NAME, pretrained=False, num_classes=7)
    
    # 2. Load and Remap
    ckpt = torch.load(MODEL_WEIGHTS_PATH, map_location=device)
    state_dict = ckpt["model_state_dict"] if isinstance(ckpt, dict) and "model_state_dict" in ckpt else ckpt
    
    new_state_dict = {}
    model_keys = list(model.state_dict().keys())
    for k, v in state_dict.items():
        clean_k = k.replace("model.", "").replace("module.", "").replace("backbone.", "")
        if clean_k == "head.weight": clean_k = "head.fc.weight"
        if clean_k == "head.bias": clean_k = "head.fc.bias"
        if clean_k in model_keys:
            new_state_dict[clean_k] = v
    
    load_result = model.load_state_dict(new_state_dict, strict=False)
    print(f"Sync Results -> Missing: {len(load_result.missing_keys)} | Unexpected: {len(load_result.unexpected_keys)}")
    
    if len(load_result.missing_keys) == 0:
        print("SUCCESS: Full Brain synchronization achieved.")
    else:
        print(f"PARTIAL: {len(load_result.missing_keys)} cells missing.")

    model.eval()
    
    # 3. Fake / Real Inference
    if image_path and os.path.exists(image_path):
        img = Image.open(image_path).convert("RGB")
        tfms = get_transforms()
        input_tensor = tfms(image=np.array(img))["image"].unsqueeze(0)
        with torch.no_grad():
            output = model(input_tensor)
            probs = torch.nn.functional.softmax(output, dim=1)[0]
            top_prob, top_idx = torch.max(probs, dim=0)
            print(f"RESULT -> Top Class Index: {top_idx.item()} | Confidence: {top_prob.item()*100:.2f}%")
        
        if top_prob.item() > 0.40:
             print("VERIFICATION: High-confidence logic confirmed.")
        else:
             print("VERIFICATION FAILURE: Model still flat (Low confidence). Check architecture.")
    else:
        print("No test image provided, skipping visual verification.")

if __name__ == "__main__":
    # Test on the last uploaded image if found
    test_inference()
