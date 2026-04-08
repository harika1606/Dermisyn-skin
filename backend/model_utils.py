import gdown
import os
import torch
import torch.nn as nn
import timm
import numpy as np
import albumentations as A
from albumentations.pytorch import ToTensorV2
from PIL import Image

# --- Notebook Configuration Mapping ---
IMG_SIZE = 224
MODEL_NAME = "swin_tiny_patch4_window7_224"

# Calibrated 7-Class Registry (v4.2 Calibration)
DEFAULT_CLASS_NAMES = [
    "Melanoma Skin Cancer Nevi And Moles", # Index 0 (Validated via Anchor Test)
    "Actinic Keratosis Basal Cell Carcinoma And Other Malignant Lesions", # Index 1
    "Eczema Photos", # Index 2
    "Psoriasis Pictures Lichen Planus And Related Diseases", # Index 3
    "Seborrheic Keratoses And Other Benign Tumors", # Index 4
    "Urticaria Hives", # Index 5
    "Vascular Tumors" # Index 6
]

# Path to the 7-class model weights (Cloud-Ready Portable Path)
MODEL_WEIGHTS_PATH = os.path.join(os.path.dirname(__file__), "models", "best_model_v4.pth")

def get_val_transforms(size=224):
    """Calibrated preprocessing for Swin-Transformer (Bicubic + ImageNet Norm)"""
    import cv2
    return A.Compose([
        A.Resize(size, size, interpolation=cv2.INTER_CUBIC),
        A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ToTensorV2(),
    ])

def load_model():
    """Initializes the Swin Tiny model and prepares it for inference."""
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    num_classes = 7 # UPDATED: 7 classes for the new model
    print(f"--> Building model with {num_classes} classes...")
    
    if not os.path.exists(MODEL_WEIGHTS_PATH):
        print("--> Model not found. Downloading from Google Drive...")
        
        os.makedirs(os.path.dirname(MODEL_WEIGHTS_PATH), exist_ok=True)
        
        url = "https://drive.google.com/uc?id=16fFJPwYsjLTODNxzeDfwtCrhi6pi7Sx0"
        gdown.download(url, MODEL_WEIGHTS_PATH, quiet=False)
        
        print("--> Model downloaded successfully!")
        
    # 1. Spin up base model architecture
    model = timm.create_model(
        MODEL_NAME,
        pretrained=False, 
        num_classes=num_classes,
    )
    
    # 2. Force Load Trained Weights
    if os.path.exists(MODEL_WEIGHTS_PATH):
        print(f"--> Found trained weights at {MODEL_WEIGHTS_PATH}. Syncing...")
        ckpt = torch.load(MODEL_WEIGHTS_PATH, map_location=device, weights_only=False)
        
        # Structure Extraction
        state_dict = ckpt["model_state_dict"] if isinstance(ckpt, dict) and "model_state_dict" in ckpt else ckpt
        
        # SMART REMAPPING LOGIC
        # 1. Strip common prefixes (model., module., backbone., etc)
        # 2. Map 'head.weight' to 'head.fc.weight' (New timm standard)
        new_state_dict = {}
        model_keys = list(model.state_dict().keys())
        
        for k, v in state_dict.items():
            # Clean key
            clean_k = k.replace("model.", "").replace("module.", "").replace("backbone.", "")
            
            # Specific Head Remapping
            if clean_k == "head.weight": clean_k = "head.fc.weight"
            if clean_k == "head.bias": clean_k = "head.fc.bias"
            
            if clean_k in model_keys:
                new_state_dict[clean_k] = v
            else:
                # Debug logging for mismatched keys
                print(f"--> [DEBUG] Skipping unmatched weight key: {k} (Cleaned: {clean_k})")
        
        # 3. Load with verification
        load_result = model.load_state_dict(new_state_dict, strict=False)
        missing = load_result.missing_keys
        unexpected = load_result.unexpected_keys
        
        if len(missing) > 0:
            print(f"--> [CRITICAL] Missing {len(missing)} layers! AI will be UNCERTAIN.")
            # We don't fail here yet to allow the app to boot, but we log the severity
        else:
            print("--> SUCCESS: 100% Brain Layers synchronized and active.")
    else:
        print(f"--> [ERROR] Essential weights missing at {MODEL_WEIGHTS_PATH}. AI is currently in 'Dumb Mode'.")
        
    model = model.to(device)
    model.eval() # Deployment Mode
    
    return model, DEFAULT_CLASS_NAMES, device

def predict_image(image_path, model, class_names, device, force=False):
    """
    Loads an image, applies inference transformations, feeds it through the model,
    and formats the result into a JSON friendly dict.
    """
    # Load Image
    img = Image.open(image_path).convert("RGB")
    np_img = np.array(img)
    
    # Transform
    tfms = get_val_transforms(IMG_SIZE)
    transformed = tfms(image=np_img)
    tensor_img = transformed["image"].unsqueeze(0) # Add batch dimension [1, C, H, W]
    tensor_img = tensor_img.to(device)
    
    # Predict
    with torch.no_grad():
        logits = model(tensor_img)
        # Apply softmax to get probabilities
        probabilities = torch.nn.functional.softmax(logits, dim=1)[0]
        
    # Get Top Prediction
    predicted_class_idx = torch.argmax(probabilities).item()
    confidence = probabilities[predicted_class_idx].item()
    predicted_class_name = class_names[predicted_class_idx]
    
    # Format classes visually for the UI
    # We map the long folder names to cleaner clinical terms
    UI_NAME_MAPPING = {
        "Eczema Photos": "Eczema",
        "Psoriasis Pictures Lichen Planus And Related Diseases": "Psoriasis / Lichen Planus",
        "Melanoma Skin Cancer Nevi And Moles": "Melanoma / Nevi",
        "Seborrheic Keratoses And Other Benign Tumors": "Seborrheic Keratosis",
        "Actinic Keratosis Basal Cell Carcinoma And Other Malignant Lesions": "Actinic Keratosis / BCC",
        "Vascular Tumors": "Vascular Tumor",
        "Urticaria Hives": "Urticaria (Hives)"
    }
    
    # Map long class names into clinical categories
    is_malignant = predicted_class_name in [
        "Melanoma Skin Cancer Nevi And Moles", 
        "Actinic Keratosis Basal Cell Carcinoma And Other Malignant Lesions"
    ]
    
    pretty_class_name = UI_NAME_MAPPING.get(predicted_class_name, predicted_class_name)

    # Rejection Threshold (lower than 10% is extremely suspect for non-medical imagery)
    # Between 10-15% is 'Uncertain Presentation'
    # Above 15% is 'Valid Clinical Case'
    is_valid = (confidence > 0.15) or force
    
    # Refined Clinical Messaging
    if not is_valid:
        risk_level = "Unverifiable Presentation"
        pretty_class_name = "Subtle Clinical Manifestation"
        # If it's very likely to be one of our classes but confidence is just low
        status_label = "Awaiting Verification"
    elif is_malignant:
        risk_level = "Potential Malignancy"
        status_label = "High Clinical Priority"
    else:
        # User requested: "non skin cancer image. like it some disease which will cure"
        risk_level = "Non-Skin Cancer / Common Condition"
        status_label = "Common / Curable Condition"

    # Generate full classification report for the UI
    full_report = []
    for idx, prob in enumerate(probabilities):
        name = class_names[idx]
        ui_name = UI_NAME_MAPPING.get(name, name)
        
        # Determine internal ID for clinical manifest linking
        manifest_id_map = {
            "Eczema Photos": "eczema",
            "Psoriasis Pictures Lichen Planus And Related Diseases": "psoriasis",
            "Melanoma Skin Cancer Nevi And Moles": "melanoma",
            "Seborrheic Keratoses And Other Benign Tumors": "seborrheic",
            "Actinic Keratosis Basal Cell Carcinoma And Other Malignant Lesions": "bcc",
            "Vascular Tumors": "vascular",
            "Urticaria Hives": "urticaria"
        }
        
        full_report.append({
            "id": manifest_id_map.get(name, "unknown"),
            "name": ui_name,
            "confidence": round(prob.item() * 100, 2),
            "is_malignant": name in ["Melanoma Skin Cancer Nevi And Moles", "Actinic Keratosis Basal Cell Carcinoma And Other Malignant Lesions"]
        })
    
    # Sort report by highest confidence first
    full_report = sorted(full_report, key=lambda x: x["confidence"], reverse=True)

    # Calculate Risk Score (Sum of malignant class probabilities)
    malignant_probs = [
        probabilities[idx].item() for idx, name in enumerate(class_names)
        if name in ["Melanoma Skin Cancer Nevi And Moles", "Actinic Keratosis Basal Cell Carcinoma And Other Malignant Lesions"]
    ]
    risk_score = round(sum(malignant_probs) * 100, 2)

    return {
        "prediction": pretty_class_name,
        "confidence": round(confidence * 100, 2),
        "risk_score": risk_score, # Total probability of malignancy
        "risk_level": risk_level,
        "status_label": status_label,
        "is_valid": is_valid,
        "is_malignant": is_malignant,
        "full_report": full_report,
        "raw_logits_distribution": probabilities.cpu().numpy().tolist()
    }

