import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Define height and width for your model's input size
height = 150  # Change to match your model's expected height
width = 150   # Change to match your model's expected width

# Load the model
model = load_model(r'C:\\Users\\orion\\Downloads\\corn_disease_model2(1).h5')

# Function to preprocess the image
def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(height, width))  # Load the image
    img_array = image.img_to_array(img)  # Convert to array
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array /= 255.0  # Normalize
    return img_array  # Return without flattening

# Path to the new image
img_path = r'C:\\Users\\orion\\dataset\\good.png'  # Change this to your image path

# Preprocess the image and make predictions
preprocessed_image = preprocess_image(img_path)
predictions = model.predict(preprocessed_image)

print("Raw predictions:", predictions)

# Get the class labels
class_labels = ['Anthracnose Stalk Rot','Good Corn', 'Gray Leaf Spot', 'Northern Corn Leaf Blight', 'Southern Rust']

# Set a threshold
threshold = 0.8  # Choose your threshold value

# Determine the predicted class
predicted_class_index = np.argmax(predictions, axis=1)[0]  # Get the index of the highest probability
predicted_class = class_labels[predicted_class_index]
predicted_confidence = predictions[0][predicted_class_index]

# Check if the confidence is above the threshold
if predicted_confidence > threshold:
    result = predicted_class
else:
    result = "Uncertain: Not confident in the prediction"

print(f"Predicted result: {result} with confidence: {predicted_confidence:.2f}")
