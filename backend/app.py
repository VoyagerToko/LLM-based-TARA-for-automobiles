from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .llm_handler import analyze_threat  # Make sure this import is correct
import uvicorn

app = FastAPI()

# Enable CORS so your frontend (any origin) can talk to the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(request: Request):
    try:
        data = await request.json()
        item = {
            "functionality": data.get("functionality", ""),
            "system_boundaries": data.get("system_boundaries", ""),
            "interfaces": data.get("interfaces", "")
        }
        return analyze_threat(item)
    except Exception as e:
        return {"error": str(e)}

# For local testing via `python app.py`
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
