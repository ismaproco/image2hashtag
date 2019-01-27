import os
import base64
from io import BytesIO

from flask import Flask, make_response, request, render_template, jsonify
from flask_cors import CORS
from werkzeug.exceptions import BadRequest
import torch
import evaluation

"""
floyd run --cpu --data floydhub/datasets/colornet/1:colornet --mode serve --env tensorflow-1.7
"""
app = Flask(__name__)
CORS(app)
app.config['DEBUG'] = False
class_names = ['art', 'autumn', 'beach', 'blackandwhite', 'cars', 'christmas', 'computers', 'cute', 'dogs', 'easter', 'fashion', 'friends', 'girl', 'goats', 'gym', 'happy', 'horse', 'landscape', 'love', 'mountains', 'nature', 'selfie', 'snow', 'summer', 'sunset', 'travel', 'work']
device_to = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = evaluation.load_checkpoint(device_to, class_names)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/image', methods=["POST"])
def eval_image():
    """"Preprocessing the data and evaluate the model"""
    # check if the post request has the file part
    input_file = request.files.get('file')
    if not input_file:
        return BadRequest("File not present in request")
    if input_file.filename == '':
        return BadRequest("File name is not present in request")
    if not input_file.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        return BadRequest("Invalid file type")

    # # Save Image to process
    input_buffer = BytesIO()
    output_buffer = BytesIO()
    input_file.save(input_buffer)

    response = jsonify(evaluation.get_probs(input_buffer, model, device_to, class_names))
    return response


if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5000',threaded=True)