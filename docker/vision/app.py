import io, torch
from fastapi import FastAPI, UploadFile
from PIL import Image
from torchvision import models
W = models.ResNet18_Weights.DEFAULT
net = models.resnet18(weights=W).eval(); pre = W.transforms()
app = FastAPI(title="UAtlas Vision CNN")
@app.get("/health")
def health(): return {"ok": True}
@app.post("/classify")
async def classify(file: UploadFile):
    img = Image.open(io.BytesIO(await file.read())).convert("RGB")
    with torch.no_grad(): p = net(pre(img).unsqueeze(0)).softmax(1)[0]
    s, i = p.topk(5)
    return [{"label": W.meta["categories"][j], "score": round(float(v), 4)} for v, j in zip(s, i)]
