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

# Disease information (overview, causes, symptoms, next steps)
disease_info = {
    "malaria": {
        "overview": "Malaria is a serious disease caused by a parasite that infects a type of mosquito that feeds on humans. It is common in tropical and subtropical regions.",
        "causes": [
            "Infection with Plasmodium parasites transmitted through the bites of infected Anopheles mosquitoes."
        ],
        "symptoms": [
            "Fever, chills, and sweating",
            "Headache",
            "Nausea and vomiting",
            "Fatigue",
            "Muscle aches"
        ],
        "next_steps": [
            "Seek medical attention immediately if malaria is suspected.",
            "A blood test will confirm the diagnosis.",
            "Begin antimalarial treatment as prescribed.",
            "Avoid mosquito bites by using mosquito nets and repellents."
        ]
    },
    "typhoid": {
        "overview": "Typhoid fever is a bacterial infection caused by Salmonella typhi, which can cause life-threatening complications if untreated.",
        "causes": [
            "Infection by Salmonella typhi through contaminated food or water.",
            "Poor sanitation and hygiene practices."
        ],
        "symptoms": [
            "High fever",
            "Weakness and fatigue",
            "Stomach pain",
            "Headache",
            "Diarrhea or constipation",
            "Loss of appetite"
        ],
        "next_steps": [
            "Consult a doctor immediately to confirm the diagnosis.",
            "A blood or stool test will be performed.",
            "Start antibiotics as prescribed.",
            "Maintain proper hygiene, and avoid preparing food for others during illness."
        ]
    },
    "common_cold": {
        "overview": "The common cold is a viral infection of the upper respiratory tract, typically caused by rhinoviruses. It is highly contagious.",
        "causes": [
            "Infection by rhinoviruses or other respiratory viruses.",
            "Spread through respiratory droplets or contaminated surfaces."
        ],
        "symptoms": [
            "Runny or stuffy nose",
            "Sneezing",
            "Sore throat",
            "Cough",
            "Mild fever",
            "Fatigue"
        ],
        "next_steps": [
            "Rest and drink plenty of fluids.",
            "Use over-the-counter medications to alleviate symptoms.",
            "Avoid close contact with others to prevent spread.",
            "Consult a healthcare provider if symptoms last longer than 10 days or worsen."
        ]
    },
    "diarrhoea": {
        "overview": "Diarrhea is characterized by frequent, loose, watery stools, which can lead to dehydration and other complications.",
        "causes": [
            "Infections from bacteria (e.g., Salmonella, E. coli), viruses (e.g., norovirus), or parasites.",
            "Foodborne illnesses or food intolerances.",
            "Medications such as antibiotics."
        ],
        "symptoms": [
            "Frequent, watery stools",
            "Abdominal cramping",
            "Nausea or vomiting",
            "Fever (in some cases)",
            "Dehydration signs like dry mouth and dizziness"
        ],
        "next_steps": [
            "Stay hydrated with oral rehydration solutions.",
            "Avoid foods and drinks that can worsen symptoms (e.g., dairy).",
            "Seek medical help if diarrhea persists for more than 48 hours or if dehydration occurs."
        ]
    },
    "stomach_flu": {
        "overview": "Stomach flu (gastroenteritis) is an inflammation of the stomach and intestines caused by viral or bacterial infections.",
        "causes": [
            "Viral infections (e.g., norovirus, rotavirus).",
            "Bacterial infections (e.g., Salmonella, E. coli).",
            "Contaminated food or water."
        ],
        "symptoms": [
            "Watery diarrhea",
            "Vomiting",
            "Stomach cramps",
            "Nausea",
            "Low-grade fever"
        ],
        "next_steps": [
            "Rest and drink plenty of fluids to prevent dehydration.",
            "Avoid solid food until vomiting stops.",
            "Consult a doctor if symptoms last longer than 2 days or if dehydration occurs."
        ]
    },
    "sore_throat": {
        "overview": "A sore throat is a painful, dry, or scratchy feeling in the throat often caused by infections, allergies, or irritants.",
        "causes": [
            "Viral infections (e.g., common cold, flu).",
            "Bacterial infections (e.g., strep throat).",
            "Environmental irritants such as smoke or pollution."
        ],
        "symptoms": [
            "Painful or scratchy throat",
            "Difficulty swallowing",
            "Swollen lymph nodes",
            "Mild fever"
        ],
        "next_steps": [
            "Gargle with warm salt water.",
            "Drink plenty of fluids.",
            "Use over-the-counter throat lozenges.",
            "Consult a healthcare provider if symptoms worsen or if fever persists."
        ]
    },
    "respiratory_infection": {
        "overview": "Respiratory infections affect the lungs and airways and can be caused by a variety of viruses, bacteria, or fungi.",
        "causes": [
            "Viral infections (e.g., flu, common cold, COVID-19).",
            "Bacterial infections (e.g., pneumonia, bronchitis).",
            "Exposure to irritants such as smoke or allergens."
        ],
        "symptoms": [
            "Coughing",
            "Shortness of breath",
            "Chest discomfort",
            "Fever or chills",
            "Wheezing"
        ],
        "next_steps": [
            "Rest and drink fluids to stay hydrated.",
            "Use over-the-counter medications to alleviate symptoms.",
            "Seek medical attention if symptoms worsen or you have difficulty breathing."
        ]
    }
}

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

        # Normalize predicted label to match dictionary keys
        normalized_key = predicted_disease.lower().replace(" ", "_")
        disease_details = disease_info.get(normalized_key, {})

        return {
            "predicted_disease": predicted_disease,
            "overview": disease_details.get("overview", ""),
            "causes": disease_details.get("causes", []),
            "symptoms": disease_details.get("symptoms", []),
            "next_steps": disease_details.get("next_steps", [])
        }

    except Exception as e:
        return {"error": str(e)}
