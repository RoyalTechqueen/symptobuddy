from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import joblib

# Create FastAPI app
app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model and label encoder
model = tf.keras.models.load_model("disease_prediction_model.h5")
label_encoder = joblib.load("label_encoder.pkl")

# Define symptom order based on training dataset
symptom_order = [
    "Fever",
    "Chills",
    "Headache",
    "Muscle Pain",
    "Nausea",
    "Vomiting",
    "Fatigue",
    "Diarrhoea",
    "Phlegm",
    "Throat Irritation",
]

# Define the input data format
class Symptoms(BaseModel):
    symptoms: list[str]

# Prediction route
@app.post("/predict")
async def predict(symptoms: Symptoms):
    try:
        # Create binary vector from symptom list
        input_vector = [1 if symptom in symptoms.symptoms else 0 for symptom in symptom_order]

        # Convert to NumPy array and reshape for model input
        input_array = np.array([input_vector])

        # Make prediction
        prediction = model.predict(input_array)
        predicted_index = np.argmax(prediction)
        predicted_disease = label_encoder.inverse_transform([predicted_index])[0]

        return {"predicted_disease": predicted_disease}

    except Exception as e:
        return {"error": str(e)}
