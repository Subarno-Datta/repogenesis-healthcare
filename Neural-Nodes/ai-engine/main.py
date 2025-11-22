from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from PIL import Image
import io
import os
import tensorflow as tf

# --- CONFIGURATION ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GLOBAL MODEL LOADER ---
MODEL_PATH = "model/dermanode_model_v1.h5"
model = None

print(f"⏳ INITIALIZING: Loading Model from {MODEL_PATH}...")
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(" SUCCESS: Model Loaded & Ready.")
except Exception as e:
    print(f" CRITICAL ERROR: Could not load model. {e}")

# --- CLASS MAPPING ---
CLASS_NAMES = {
    0: 'Actinic Keratoses (Pre-Cancerous)',
    1: 'Basal Cell Carcinoma (Cancer)',
    2: 'Benign Keratosis (Sun Spot)',
    3: 'Dermatofibroma (Benign)',
    4: 'Melanoma (High Risk Cancer)',
    5: 'Common Mole (Benign)',
    6: 'Vascular Lesion (Benign)'
}

@app.get("/")
def read_root():
    return {"status": "online"}

@app.post("/scan")
async def scan_image(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # 1. Read & Preprocess
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image = image.resize((224, 224)) 

        img_array = np.array(image)
        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
        img_array = np.expand_dims(img_array, axis=0)

        # 2. Predict
        predictions = model.predict(img_array)
        probs = predictions[0] 

        # --- 🔍 DEBUG LOGGING ---
        print("\n" + "="*30)
        print("🔍 RAW MODEL PROBABILITIES:")
        for i, prob in enumerate(probs):
            print(f"Class {i}: {float(prob)*100:.2f}%")
        print("="*30 + "\n")
        # ------------------------

        # 3. Logic Override (The Fix)
        # We extract risks as PYTHON FLOATS to avoid JSON errors
        melanoma_risk = float(probs[4] * 100)
        bcc_risk = float(probs[1] * 100)
        akiec_risk = float(probs[0] * 100)
        
        # --- STEP A: Identify Primary Diagnosis ---
        top_class_idx = np.argmax(probs)
        top_confidence = float(probs[top_class_idx] * 100)
        
        # Mole Suppression (Keep this!)
        if top_class_idx == 5 and top_confidence < 60.0:
            temp_probs = np.copy(probs)
            temp_probs[5] = -1 
            runner_up_idx = np.argmax(temp_probs)
            runner_up_score = float(temp_probs[runner_up_idx] * 100)
            if runner_up_score > 15.0:
                top_class_idx = runner_up_idx
                top_confidence = runner_up_score

        top_class_name = CLASS_NAMES.get(top_class_idx, "Unknown")

        # --- STEP B: Severity Assignment ---
        diagnosis = ""
        confidence = top_confidence
        severity = "low"

        # LOGIC TREE:
        
        # 1. IS THE PRIMARY DIAGNOSIS CANCER? (Absolute Priority)
        if top_class_idx in [0, 1, 4]:
            diagnosis = top_class_name
            severity = "high"
            
        # 2. IS IT BENIGN WITH HIDDEN RISKS? (Calculated Priority)
        else:
            # Collect all risks that cross their safety thresholds
            active_risks = []
            
            if melanoma_risk > 2.0:
                active_risks.append({"name": "Melanoma", "score": melanoma_risk})
            
            if bcc_risk > 5.0:
                active_risks.append({"name": "Basal Cell", "score": bcc_risk})
                
            if akiec_risk > 5.0:
                active_risks.append({"name": "Actinic Keratosis", "score": akiec_risk})
            
            # If we found any risks...
            if len(active_risks) > 0:
                # Sort them by score (Highest First) so the "Loudest" risk wins
                active_risks.sort(key=lambda x: x['score'], reverse=True)
                top_risk = active_risks[0]
                
                clean_name = top_class_name.split('(')[0].strip()
                diagnosis = f"{clean_name} (⚠️ Risk: {top_risk['name']})"
                severity = "medium" # Amber Alert
                
            else:
                # No risks found, totally safe
                diagnosis = top_class_name
                severity = "low"

        return {
            "success": True,
            "diagnosis": diagnosis,
            "confidence": round(confidence, 2),
            "severity": severity
        }

    except Exception as e:
        print(f"❌ ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)