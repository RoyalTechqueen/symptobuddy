from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import joblib

# Load the trained model and label encoder
model = tf.keras.models.load_model('disease_prediction_model.h5')
label_encoder = joblib.load('label_encoder.pkl')

# Create FastAPI app
app = FastAPI()

# Define the input data format for symptoms
class Symptoms(BaseModel):
    symptoms: list  # List of selected symptoms (1 for present, 0 for absent)

# Define the prediction endpoint
@app.post("/predict")
async def predict(symptoms: Symptoms):
    # Convert the symptoms to numpy array format
    symptom_array = np.array(symptoms.symptoms).reshape(1, -1)

    # Make the prediction
    prediction = model.predict(symptom_array)

    # Get the predicted class index (numeric value)
    predicted_class_index = np.argmax(prediction, axis=1)[0]

    # Decode the predicted numeric class back to the disease label
    predicted_disease = label_encoder.inverse_transform([predicted_class_index])[0]

    # Return the predicted disease
    return {"predicted_disease": predicted_disease}
