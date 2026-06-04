from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import json

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

model = tf.keras.models.load_model("symptobuddy_v2.h5")

with open("disease_mapping.json", "r") as f:
    disease_mapping = json.load(f)

# Define symptom order based on training dataset
symptom_order = [
    "Fever",
    "Persistent Fever",
    "Chills",
    "Headache",
    "Fatigue",
    "Body Ache",
    "Loss of Appetite",
    "Sweating",
    "Cough",
    "Runny Nose",
    "Nasal Congestion",
    "Sneezing",
    "Sore Throat",
    "Difficulty Breathing",
    "Nausea",
    "Vomiting",
    "Diarrhea",
    "Abdominal Pain",
    "Dehydration",
    "Red Eyes",
    "Watery Eyes",
    "Eye Discharge",
    "Rash",
    "Itching",
    "Skin Blisters",
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
    "diarrhea": {
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
    },
    "sinusitis": {
    "overview": "Sinusitis is inflammation or swelling of the tissue lining the sinuses, often caused by infections, allergies, or other conditions that block the sinuses.",
    "causes": [
        "Viral infections such as the common cold.",
        "Bacterial infections.",
        "Allergies that cause nasal inflammation.",
        "Nasal polyps or structural problems in the nose."
    ],
    "symptoms": [
        "Facial pain or pressure",
        "Stuffy or blocked nose",
        "Thick nasal discharge",
        "Reduced sense of smell and taste",
        "Headache",
        "Cough"
    ],
    "next_steps": [
        "Rest and drink plenty of fluids.",
        "Use saline nasal sprays or nasal irrigation as recommended.",
        "Seek medical attention if symptoms last longer than 10 days or become severe.",
        "Follow prescribed treatment if a bacterial infection is diagnosed."
    ]
},

"food_poisoning": {
    "overview": "Food poisoning is an illness caused by eating contaminated food or drinking contaminated water. Symptoms usually develop within hours to days after exposure.",
    "causes": [
        "Bacteria such as Salmonella, E. coli, or Listeria.",
        "Viruses such as norovirus.",
        "Parasites in contaminated food or water.",
        "Toxins produced by certain bacteria."
    ],
    "symptoms": [
        "Nausea and vomiting",
        "Diarrhea",
        "Stomach cramps",
        "Fever",
        "Weakness and fatigue"
    ],
    "next_steps": [
        "Drink plenty of fluids to prevent dehydration.",
        "Rest and avoid foods that may worsen symptoms.",
        "Seek medical care if symptoms are severe, persistent, or accompanied by signs of dehydration.",
        "Follow food safety practices to prevent future infections."
    ]
},

"conjunctivitis": {
    "overview": "Conjunctivitis, commonly known as pink eye, is inflammation of the conjunctiva, the thin membrane that covers the white part of the eye and inner eyelid.",
    "causes": [
        "Viral infections.",
        "Bacterial infections.",
        "Allergic reactions.",
        "Exposure to irritants such as smoke or chemicals."
    ],
    "symptoms": [
        "Red or pink eyes",
        "Itchy or burning eyes",
        "Excessive tearing",
        "Eye discharge",
        "Crusting around the eyelids"
    ],
    "next_steps": [
        "Avoid touching or rubbing the eyes.",
        "Wash hands frequently to prevent spreading the infection.",
        "Use prescribed eye drops if recommended by a healthcare provider.",
        "Seek medical attention if vision changes, severe pain, or worsening symptoms occur."
    ]
},

"measles": {
    "overview": "Measles is a highly contagious viral infection that spreads through respiratory droplets. It can lead to serious complications, especially in young children.",
    "causes": [
        "Infection with the measles virus.",
        "Exposure to respiratory droplets from an infected person."
    ],
    "symptoms": [
        "High fever",
        "Runny nose",
        "Cough",
        "Red, watery eyes",
        "White spots inside the mouth (Koplik spots)",
        "Red skin rash that spreads across the body"
    ],
    "next_steps": [
        "Seek medical attention if measles is suspected.",
        "Stay isolated from others to prevent spreading the virus.",
        "Drink plenty of fluids and get adequate rest.",
        "Monitor for complications such as difficulty breathing or severe dehydration."
    ]
},

"chickenpox": {
    "overview": "Chickenpox is a highly contagious viral infection caused by the varicella-zoster virus. It is characterized by an itchy rash and flu-like symptoms.",
    "causes": [
        "Infection with the varicella-zoster virus.",
        "Direct contact with an infected person's rash or respiratory droplets."
    ],
    "symptoms": [
        "Itchy rash with fluid-filled blisters",
        "Fever",
        "Fatigue",
        "Loss of appetite",
        "Headache"
    ],
    "next_steps": [
        "Avoid scratching the blisters to reduce the risk of infection.",
        "Rest and stay hydrated.",
        "Stay away from others until all blisters have crusted over.",
        "Seek medical attention if symptoms become severe or complications develop."
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
        input_vector = [
            1 if symptom in symptoms.symptoms else 0
            for symptom in symptom_order
        ]

        # Convert to NumPy array
        input_array = np.array([input_vector])

        # Make prediction
        predictions = model.predict(input_array)

        # Get top 3 predictions
        top_3_indices = np.argsort(predictions[0])[-3:][::-1]

        top_predictions = []

        for idx in top_3_indices:
            disease = disease_mapping[str(idx)]
            confidence = float(predictions[0][idx] * 100)

            top_predictions.append({
                "disease": disease,
                "confidence": round(confidence, 2)
            })

        # Use first prediction for disease information
        primary_disease = top_predictions[0]["disease"]

        normalized_key = (
            primary_disease.lower()
            .replace(" ", "_")
            .replace("-", "_")
        )

        disease_details = disease_info.get(normalized_key, {})

        return {
            "top_predictions": top_predictions,
            "overview": disease_details.get("overview", ""),
            "causes": disease_details.get("causes", []),
            "symptoms": disease_details.get("symptoms", []),
            "next_steps": disease_details.get("next_steps", [])
        }

    except Exception as e:
        return {"error": str(e)}
