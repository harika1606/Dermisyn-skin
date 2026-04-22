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
    "Seborrheic Keratoses And Other Benign Tumors", # Index 0
    "Eczema Photos", # Index 1
    "Melanoma Skin Cancer Nevi And Moles", # Index 2
    "Psoriasis Pictures Lichen Planus And Related Diseases", # Index 3
    "Vascular Tumors", # Index 4
    "Urticaria Hives", # Index 5
    "Actinic Keratosis Basal Cell Carcinoma And Other Malignant Lesions" # Index 6
]

# Path to the 7-class model weights (Cloud-Ready Portable Path)
MODEL_WEIGHTS_PATH = os.path.join(os.path.dirname(__file__), "models", "best_model_v6.pth")

def get_val_transforms(size=224):
    """Calibrated preprocessing for Swin-Transformer (Bicubic + ImageNet Norm)"""
    import cv2
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
        
    # 1. Spin up base model architecture (Matching notebook cell 19)
    model = timm.create_model(
        MODEL_NAME,
        pretrained=False
    )
    model.head = nn.Linear(model.head.in_features, num_classes)
    
    # 2. Force Load Trained Weights
    # Automatic ZIP extraction logic for Cloud Deployment
    MODEL_DIR = os.path.dirname(MODEL_WEIGHTS_PATH)
    ZIP_PATH = os.path.join(MODEL_DIR, "model.zip")
    
    if not os.path.exists(MODEL_WEIGHTS_PATH) and os.path.exists(ZIP_PATH):
        print("Model: Extracting model.zip...")
        import zipfile
        with zipfile.ZipFile(ZIP_PATH, 'r') as zip_ref:
            zip_ref.extractall(MODEL_DIR)
        print("Model: Extraction complete.")

    if not os.path.exists(MODEL_WEIGHTS_PATH):
        print(f"--> [ERROR] Essential weights missing at {MODEL_WEIGHTS_PATH}. AI is currently in 'Dumb Mode'.")
    else:
        print(f"Model: Loading weights from {MODEL_WEIGHTS_PATH}")
        ckpt = torch.load(MODEL_WEIGHTS_PATH, map_location=device, weights_only=False)
        
        # Structure Extraction
        state_dict = ckpt["model_state_dict"] if isinstance(ckpt, dict) and "model_state_dict" in ckpt else ckpt
        
        # SMART REMAPPING LOGIC
        # 1. Normalize keys and handle standard timm/torchvision prefix mismatches
        new_state_dict = {}
        model_keys = model.state_dict().keys()
        
        for k, v in state_dict.items():
            # Strip common wrapper prefixes
            new_key = k.replace("model.", "").replace("module.", "").replace("backbone.", "")
            
            if new_key in model_keys:
                new_state_dict[new_key] = v
            else:
                print(f"--> [DEBUG] Skipping unmatched weight key: {k} -> {new_key}")
        
        # 3. Load with verification
        print(f"--> [DEBUG] Attempting to load {len(new_state_dict)} matched keys into model...")
        load_result = model.load_state_dict(new_state_dict, strict=False)
        missing = load_result.missing_keys
        
        if len(missing) > 0:
            # We filter out non-weight keys if any
            critical_missing = [m for m in missing if not m.endswith(".num_batches_tracked")]
            if critical_missing:
                print(f"--> [CRITICAL] Missing {len(critical_missing)} essential layers: {critical_missing[:3]}...")
            else:
                print("--> SUCCESS: Base model weights synchronized (tracked buffers skipped).")
        else:
            print("--> SUCCESS: 100% Brain Layers synchronized and active.")
        
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
        
        # Handle Swin feature map output (Global Average Pooling)
        # This is critical if the head was replaced without an internal pool layer
        if logits.dim() == 4:
            logits = torch.mean(logits, dim=[2, 3])
            
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

    # Calibrated Thresholds for Clinical Deployment
    # < 20%: Unverifiable / Non-Medical
    # 20-40%: Indeterminate / Subtle Manifestation
    # > 40%: Valid Diagnostic Case
    is_valid = (confidence > 0.40) or force
    
    # Refined Clinical Messaging
    if not is_valid:
        risk_level = "Indeterminate / Subtle Presentation"
        pretty_class_name = "Subtle Clinical Manifestation"
        status_label = "Professional Review Recommended"
    elif is_malignant:
        risk_level = "Potential Malignancy"
        status_label = "Urgent Specialist Review"
    else:
        # Reassurance for non-cancerous conditions
        risk_level = "Benign / Common Skin Manifestation"
        status_label = "Non-Malignant Manifestation"

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

