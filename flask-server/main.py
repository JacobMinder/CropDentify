from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import numpy as np
import boto3
import json
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

current_dir = os.path.dirname(os.path.abspath(__file__))

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TensorFlow logging

# Define height and width for your model's input size
height = 150
width = 150

# Load the model globally to avoid loading it for every request
model_path = os.path.join(current_dir, 'corn_disease_model.h5')
model = load_model(model_path)

app = Flask(__name__)
CORS(app, origins='*')

@app.route("/api/users", methods=['GET'])
def users():
    return jsonify(
        {
            "users": [
                'arpan',
                'zach',
                'jessie'
            ]
        }
    )

# Function to preprocess the image
def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(height, width))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0
    return img_array

# Define a function to talk to Claude via AWS Bedrock
def talk_to_Claude(disease):
    client = boto3.client("bedrock-runtime", region_name="us-west-2")
    model_id = "anthropic.claude-3-sonnet-20240229-v1:0"

    def invoke_model(message):
        payload = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "messages": [
                {"role": "user", "content": [{"type": "text", "text": message}]}
            ]
        }

        response = client.invoke_model(
            modelId=model_id,
            contentType="application/json",
            accept="application/json",
            body=json.dumps(payload)
        )

        response_body = json.loads(response["body"].read())
        return response_body["content"][0]["text"]

    if disease == "Good Corn":
        user_message = "The corn appears to be healthy. Please provide a brief statement about maintaining corn health bullet points and Keep it under 10 lines."
    elif disease == "Uncertain":
        user_message = "The corn's condition is uncertain; please add something like we are sorry we were unable to identify it. Please provide general advice on monitoring corn health and identifying potential issues in bullet points and keep it under 10 lines."
    else:
        user_message = f"Describe the corn disease {disease}. Provide 5 major points of the disease and 5 ways to cure it. Use bullet points and separate with titles. Keep it under 10 lines."

    response = invoke_model(user_message)
    return response

# Define a POST route for image upload and analysis
@app.route("/api/analyze", methods=['POST'])
def analyze_image():
    try:
        # Extract JSON data from the request
        data = request.json
        
        # Expecting base64 image data in the 'image' field
        image_data = data['image']

        header, encoded = image_data.split(',', 1)  # Get the base64 part
        decoded_image = base64.b64decode(encoded)  # Decode the base64 image data

        img_path = 'temp_image.png'  # Path to save the image
        with open(img_path, 'wb') as f:
            f.write(decoded_image)

        # Preprocess the image
        preprocessed_image = preprocess_image(img_path)

        # Make predictions
        predictions = model.predict(preprocessed_image)
        print("Raw predictions: ", predictions)
        
        # Get class labels
        class_labels = ['Anthracnose Stalk Rot', 'Good Corn', 'Gray Leaf Spot', 'Northern Corn Leaf Blight', 'Southern Rust']
        threshold = 0.8  # Choose your threshold value

        # Determine the predicted class
        predicted_class_index = np.argmax(predictions, axis=1)[0]
        predicted_class = class_labels[predicted_class_index]
        predicted_confidence = float(predictions[0][predicted_class_index])  # Convert to native float

        # Check if the confidence is above the threshold and determine result
        if predicted_confidence > threshold and predicted_class != "Good Corn":
            result = predicted_class
        elif predicted_class == "Good Corn" and predicted_confidence > threshold:
            result = "Good Corn"
        else:
            result = "Uncertain"

        # Get advice from Claude
        advice = talk_to_Claude(result)

        output = {
            "result": result,
            "confidence": predicted_confidence,  # Already converted
            "advice": advice
        }

        return jsonify({
            "message": "Image received and processed",
            "image_data_length": len(image_data),
            "model_output": output
        })
    
    except Exception as e:
        print(f"Error: {e}")  # Print the error message
        return jsonify({"error": str(e)}), 400
if __name__ == '__main__':
    app.run(debug=True, port=8080)
