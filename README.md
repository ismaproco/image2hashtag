# image2hashtag
Generate Images to Hashtags using CNNs

# Creating the Training and Validation Datasets

The notebook `dataset_management.ipynb` describes the steps to generate the datasets.

It makes use of the fast.ai api to store and verify the images, and it looks for the download links in folder:

- url_files

each class has it's own file, it uses the suffix `_valid` to indicate the image urls for the validation dataset,

## Example

class: autumn
- url_files/autumn.txt
- url_files/autumn_valid.txt

# Training the model

The notebook `model_training.ipynb` describes the functions and steps to training a model with a custom set of classes.

- Remember that it requires that the Datasets to be already generated in the correct structure.

# Evaluating the model

The notebook `predic_classes.ipynb` use a generated model and evaluate individual images.

# Deployment application

The file `app.py` has a Flask application that exposes the `/image` endpoint to process model and generate the probabilites per class.

# Web Application

In the `angular-app` folder can be found an angular application that can upload images and call the endpoint for the model processing.



