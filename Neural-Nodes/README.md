# DermaAI: AI-Powered Dermatoscopic Analysis

> **"Real-time, privacy-first skin lesion screening in your pocket."**

<img width="775" height="280" alt="image" src="https://github.com/user-attachments/assets/3533faf9-67ad-441a-a73a-33f6c1a9c101" />


---

## Live Demo
- **Frontend (App):** https://dermaai-fawn.vercel.app/
- **Backend (API):** https://derma-ai-backend-oqml.onrender.com/docs

---

## The Problem: "Wait Time is the Killer"
In India, the ratio of dermatologists to patients is approximately **1:100,000**. For a patient in a rural area, noticing a suspicious spot often leads to weeks of anxiety, travel costs, and waiting lists just for a preliminary checkup.

During this "wait time," treatable conditions like **Melanoma** (99% curable if caught early) can progress to fatal stages.

## The Solution: DermaAI
**DermaAI** is an open-source, computer-vision intervention. It empowers general practitioners and patients to perform **clinical-grade screening** using just a smartphone camera.

Unlike generic symptom checkers, DermaAI uses **Deep Learning (CNNs)** to analyze the visual structure of the lesion, identifying subtle patterns of malignancy that the naked eye might miss.

---

## Key Differentiators

### 1. Privacy-Native Architecture (HIPAA Compliant Logic)
Most health apps upload your photos to the cloud (AWS/Google), creating a massive privacy risk.
**DermaAI is different.**
* **Edge Inference:** The neural network runs locally on the server instance.
* **Zero Storage:** Patient images are processed in RAM and never stored in a database.
* **Data Sovereignty:** The user retains 100% control of their biometric data.

### 2. "High-Sensitivity" Logic Engine
Medical AI cannot afford to be wrong about cancer. We implemented a **Weighted Risk Logic** layer:
* **Bias Correction:** We use class-weighting to counter the dataset imbalance (67% Common Moles).
* **Safety Net:** Even if the model's primary prediction is "Benign," if it detects a **>2% probability signal** for Melanoma, it triggers a "Moderate Risk" alert. We prioritize False Positives over False Negatives.

---

## Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) + Tailwind CSS | Glassmorphism UI, Mobile-First responsiveness |
| **Animations** | Framer Motion | Smooth, "Medical-Grade" UX |
| **Backend** | Python FastAPI | High-performance asynchronous inference API |
| **AI Engine** | TensorFlow / Keras | **MobileNetV2** (Transfer Learning) |
| **Deployment** | Vercel + Render | Distributed Full-Stack Architecture |

---

## Quick Start Guide (Run Locally)

### Prerequisites
* Node.js & npm
* Python 3.10+

### 1. Clone the Repository
```bash
git clone [https://github.com/YourUsername/RepoGenesis_2025.git](https://github.com/YourUsername/RepoGenesis_2025.git)
cd RepoGenesis_2025/Neural\ Nodes
2. Setup the Brain (Backend)
Bash

cd ai-engine

# Create Virtual Environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Run the Neural Network Server
python main.py
Server will start at: http://0.0.0.0:8000

3. Setup the Face (Frontend)
Open a new terminal tab:

Bash

cd client
npm install
npm run dev
App will run at: http://localhost:5173

## Model Performance
Architecture: MobileNetV2 (feature extractor frozen, top layers fine-tuned).

Dataset: HAM10000 (10,015 Dermatoscopic images).

Classes Detected:

- Melanoma (mel) - High Risk

- Basal Cell Carcinoma (bcc) - High Risk

- Actinic Keratoses (akiec) - Pre-Cancerous

- Benign Keratosis (bkl)

- Dermatofibroma (df)

- Vascular Lesions (vasc)

- Melanocytic Nevi (nv) - Common Mole

## Medical Disclaimer
DermaAI is a screening tool, NOT a diagnostic device. The results provided by this AI should never replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any skin changes.

Made with ❤️ and Code by Team Neural Nodes.
