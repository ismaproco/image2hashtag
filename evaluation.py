### Import packages
import torch
import numpy as np
from torch import nn, optim
import torch.nn.functional as F
from torchvision import  datasets, transforms, models
from PIL import Image

def process_image(image):
    ''' Scales, crops, and normalizes a PIL image for a PyTorch model,
        returns an Numpy array
    '''
    
    # TODO: Process a PIL image for use in a PyTorch model
    img_og = Image.open( image )
    img_og.load()
    img = img_og.convert('RGB')
    normalize = transforms.Normalize(
       mean=[0.485, 0.456, 0.406],
       std=[0.229, 0.224, 0.225]
    )
    preprocess = transforms.Compose([
       transforms.Resize(256),
       transforms.CenterCrop(224),
       transforms.ToTensor(),
       normalize
    ])
    img_tensor = preprocess(img)
    return img_tensor

def predict(image_path, model, device='cpu'):
    ''' Predict the class (or classes) of an image using a trained deep learning model.
    '''
    model.eval()
    eval_img = process_image(image_path)
    eval_img = eval_img.unsqueeze(0).to(device)
    logits = model.forward(eval_img)
    ps = F.softmax(logits, dim=1)
    return ps

def load_base_model(device, classes):
    model = models.resnet152(pretrained=True)

    ## Freeze parameters so we don't backprop through them
    for param in model.parameters():
        param.requires_grad = False
    
    for param in model.layer3.parameters():
        param.requires_grad = False
        
    for param in model.layer4.parameters():
        param.requires_grad = False

    from collections import OrderedDict
    fc = nn.Sequential(OrderedDict([
                              ('fc1', nn.Linear(2048, 1024)),
                              ('relu', nn.ReLU()),
                              ('fc2', nn.Linear(1024, len(classes))),
                              ('output', nn.LogSoftmax(dim=1))
                              ]))

    model.fc = fc
    model.to(device)
    return model

def load_checkpoint(device, classes):
    model = load_base_model(device, classes)
    model.load_state_dict(torch.load('image2hashtag_resnet152_p99.pt', map_location=lambda storage, loc: storage))
    return model

def get_probs(img_path, model, device, classes):
    img_result = predict(img_path, model, device)
    probs, idx = torch.topk(img_result, 5)
    probs,idx = probs.squeeze(), idx.squeeze()
    
    title = img_path
    img = Image.open(img_path)
    
    probabilities = []
    for i,prob in enumerate(probs):
        class_dict = {}
        class_dict['name'] = classes[idx[i].item()]
        class_dict['prob'] = prob.item()
        probabilities.append(class_dict)
    return probabilities