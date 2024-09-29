import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Define height and width for your model's input size
height = 150  # Change to match your model's expected height
width = 150   # Change to match your model's expected width

# Load the model
model = load_model(r'C:\\Users\\orion\\git\\CropDentify\\cropdentify\\dataset\\crop_disease_model.h5')

# Function to preprocess the image
def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(height, width))  # Load the image
    img_array = image.img_to_array(img)  # Convert to array
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array /= 255.0  # Normalize
    return img_array  # Return without flattening

# Path to the new image
img_path = r'C:\\Users\\orion\\git\\CropDentify\\cropdentify\dataset\\good.png'  # Change this to your image path

# Preprocess the image and make predictions
preprocessed_image = preprocess_image(img_path)
predictions = model.predict(preprocessed_image)

print("Raw predictions:", predictions)

# Set a threshold
threshold = 0.8  # Choose your threshold value

#  Classify based on the threshold
if predictions.shape[1] > 1:  # Check if we have more than one class
    if predictions[0][1] > threshold:  # Assuming index 1 is for "bad corn"
        result = "good corn"
    else:
        result = "bad corn"
else:
    # If there's only one class, you can interpret it differently
    if predictions[0][0] > threshold:  # Assuming index 0 indicates presence of disease
        result = "good corn"
    else:
        result = "bad corn"

print(f"Predicted result: {result}")