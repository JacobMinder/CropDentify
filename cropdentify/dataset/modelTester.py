import numpy as np
import boto3
import json
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Define height and width for your model's input size
height = 150
width = 150

# Load the model
model = load_model(r'C:\Users\orion\Downloads\corn_disease_model2(1).h5')

# Function to preprocess the image
def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(height, width))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0
    return img_array

# Path to the new image
img_path = r'C:\Users\orion\git\CropDentify\cropdentify\dataset\good.png'

# Preprocess the image and make predictions
preprocessed_image = preprocess_image(img_path)
predictions = model.predict(preprocessed_image)

print("Raw predictions:", predictions)

# Get the class labels
class_labels = ['Anthracnose Stalk Rot', 'Good Corn', 'Gray Leaf Spot', 'Northern Corn Leaf Blight', 'Southern Rust']

# Set a threshold
threshold = 0.8

# Determine the predicted class
predicted_class_index = np.argmax(predictions, axis=1)[0]
predicted_class = class_labels[predicted_class_index]
predicted_confidence = predictions[0][predicted_class_index]

# Check if the confidence is above the threshold and it's not "Good Corn"
if predicted_confidence > threshold and predicted_class != "Good Corn":
    result = predicted_class
elif predicted_class == "Good Corn" and predicted_confidence > threshold:
    result = "Good Corn"
else:
    result = "Uncertain"

print(f"Predicted result: {result} with confidence: {predicted_confidence:.2f}")

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
        user_message = "The corn's condition is uncertain please add something like we are sorry we were unable to idendify please use these tips. Please provide general advice on monitoring corn health and identifying potential issues Bullet points and Keep it under 10 lines."
    else:
        user_message = f"Describe the corn disease {disease}. Provide 5 major points of the disease and 5 ways to cure it. Use bullet points and separate with titles. Keep it under 10 lines."

    response = invoke_model(user_message)
    print(response)
    

# Call the function with the result
talk_to_Claude(result)
