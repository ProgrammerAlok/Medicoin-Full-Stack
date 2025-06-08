from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import shutil
import uvicorn
import os

import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms, models
import matplotlib.pyplot as plt
from PIL import Image

from routes import router
from contextlib import asynccontextmanager
from db import create_db_and_table

class DoubleConv(nn.Module):
    """(convolution => [BN] => ReLU) * 2"""
    def __init__(self, in_channels, out_channels, mid_channels=None):
        super().__init__()
        if not mid_channels:
            mid_channels = out_channels
        self.double_conv = nn.Sequential(
            nn.Conv2d(in_channels, mid_channels, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(mid_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(mid_channels, out_channels, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True)
        )

    def forward(self, x):
        return self.double_conv(x)

class Down(nn.Module):
    """Downscaling with maxpool then double conv"""
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.maxpool_conv = nn.Sequential(
            nn.MaxPool2d(2),
            DoubleConv(in_channels, out_channels)
        )

    def forward(self, x):
        return self.maxpool_conv(x)

class Up(nn.Module):
    """Upscaling then double conv"""
    def __init__(self, in_channels, out_channels, bilinear=True):
        super().__init__()
        if bilinear:
            self.up = nn.Upsample(scale_factor=2, mode='bilinear', align_corners=True)
            self.conv = DoubleConv(in_channels, out_channels, in_channels // 2)
        else:
            self.up = nn.ConvTranspose2d(in_channels, in_channels // 2, kernel_size=2, stride=2)
            self.conv = DoubleConv(in_channels, out_channels)

    def forward(self, x1, x2):
        x1 = self.up(x1)
        diffY = x2.size()[2] - x1.size()[2]
        diffX = x2.size()[3] - x1.size()[3]
        x1 = F.pad(x1, [diffX // 2, diffX - diffX // 2,
                        diffY // 2, diffY - diffY // 2])
        x = torch.cat([x2, x1], dim=1)
        return self.conv(x)

class OutConv(nn.Module):
    def __init__(self, in_channels, out_channels):
        super(OutConv, self).__init__()
        self.conv = nn.Conv2d(in_channels, out_channels, kernel_size=1)

    def forward(self, x):
        return self.conv(x)

class UNet(nn.Module):
    def __init__(self, n_channels, n_classes, bilinear=False):
        super(UNet, self).__init__()
        self.n_channels = n_channels
        self.n_classes = n_classes
        self.bilinear = bilinear

        self.inc = DoubleConv(n_channels, 64)
        self.down1 = Down(64, 128)
        self.down2 = Down(128, 256)
        self.down3 = Down(256, 512)
        factor = 2 if bilinear else 1
        self.down4 = Down(512, 1024 // factor)
        self.up1 = Up(1024, 512 // factor, bilinear)
        self.up2 = Up(512, 256 // factor, bilinear)
        self.up3 = Up(256, 128 // factor, bilinear)
        self.up4 = Up(128, 64, bilinear)
        self.outc = OutConv(64, n_classes)

    def forward(self, x):
        x1 = self.inc(x)
        x2 = self.down1(x1)
        x3 = self.down2(x2)
        x4 = self.down3(x3)
        x5 = self.down4(x4)
        x = self.up1(x5, x4)
        x = self.up2(x, x3)
        x = self.up3(x, x2)
        x = self.up4(x, x1)
        logits = self.outc(x)
        return logits

# Segmentation model settings
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
seg_model = UNet(n_channels=3, n_classes=1).to(device)
seg_model_path = "unet_model_medicoin_debjit_2.pth"
try:
    seg_model.load_state_dict(torch.load(seg_model_path, map_location=device))
    seg_model.eval()
except FileNotFoundError:
    print(f"Error: Segmentation model weights file '{seg_model_path}' not found.")
    exit(1)

seg_transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.ToTensor(),
])

def seg_predict(model, image_path):
    image = Image.open(image_path).convert("RGB")
    image_tensor = seg_transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(image_tensor)
        output = torch.sigmoid(output)
        output = (output > 0.5).float()
    # Return the mask and the original image for reference
    return output.squeeze().cpu().numpy(), image


class VGG19Binary(nn.Module):
    def __init__(self, freeze_backbone=True):
        super(VGG19Binary, self).__init__()
        self.vgg19 = models.vgg19(pretrained=True)
        if freeze_backbone:
            for param in self.vgg19.features.parameters():
                param.requires_grad = False
        # Modify classifier for binary classification
        self.vgg19.classifier = nn.Sequential(
            nn.Linear(512 * 7 * 7, 512),
            nn.ReLU(True),
            nn.Dropout(0.5),
            nn.Linear(512, 256),
            nn.ReLU(True),
            nn.Dropout(0.3),
            nn.Linear(256, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.vgg19(x)

# Classification model settings
class_model_path = "custom_vgg19_model.pth"
class_model = VGG19Binary().to(device)
try:
    class_model.load_state_dict(torch.load(class_model_path, map_location=device))
    class_model.eval()
    print(f"Classification model loaded from {class_model_path}")
except FileNotFoundError:
    print(f"Error: Classification model weights file '{class_model_path}' not found.")
    exit(1)

class_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def class_predict(model, image_path):
    """
    Predict the class of an image using the VGG19Binary model.
    Returns:
      - prob (float): Confidence (probability) output.
      - pred_class (int): 1 for Malignant, 0 for benign.
    """
    image = Image.open(image_path).convert("RGB")
    image_tensor = class_transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(image_tensor)
        prob = output.item()
        pred_class = 1 if prob > 0.5 else 0
    return prob, pred_class

@asynccontextmanager
async def lifespan(_: FastAPI):
  create_db_and_table()
  yield

app = FastAPI(lifespan=lifespan)
app.include_router(router, prefix="/api")


# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process/")
async def process_image(
    file: UploadFile = File(...),
    task: str = Form(...)
):
    # Save the uploaded file temporarily
    temp_input_path = f"temp_{file.filename}"
    with open(temp_input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        if task.lower() == "segmentation":
            # Run segmentation prediction
            prediction, _ = seg_predict(seg_model, temp_input_path)
            # Save the segmentation output image
            output_path = f"seg_{file.filename}"
            plt.imsave(output_path, prediction, cmap='gray')
            # Remove the temporary input file
            os.remove(temp_input_path)
            return FileResponse(output_path, media_type="image/png", filename=f"seg_{file.filename}")
        
        elif task.lower() == "classification":
            # Run classification prediction
            prob, pred_class = class_predict(class_model, temp_input_path)
            os.remove(temp_input_path)
            label = "Malignant" if pred_class == 1 else "Benign"
            return JSONResponse(content={
                "prediction": label,
                "probability": round(prob * 100, 2)
            })
        else:
            os.remove(temp_input_path)
            return JSONResponse(status_code=400, content={"message": "Invalid task type. Use 'segmentation' or 'classification'."})
    except Exception as e:
        if os.path.exists(temp_input_path):
            os.remove(temp_input_path)
        return JSONResponse(status_code=500, content={"message": f"An error occurred: {str(e)}"})

@app.get("/")
async def root():
    return {"message": "UNet Segmentation and VGG19 Classification API is running."}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
