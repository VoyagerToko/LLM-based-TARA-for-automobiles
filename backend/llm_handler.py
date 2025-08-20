import ollama
import json

def clean_json_response(text: str) -> str:
    """
    Cleans markdown formatting (e.g., ```json) from model output.
    """
    text = text.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        return "\n".join(line for line in lines if not line.strip().startswith("```")).strip()
    return text

def analyze_threat(item: dict) -> dict:
    """
    Sends the item definition to the LLM and returns a structured TARA response.
    """
    system_prompt = f"""
You are a cybersecurity analyst performing Threat Analysis and Risk Assessment (TARA) according to ISO/SAE 21434.

Given the following item definition:

Functionality:
{item['functionality']}

System Boundaries:
{item['system_boundaries']}

Interfaces:
{item['interfaces']}

Respond ONLY with one valid JSON array with a single object in this exact structure:

[
  {{
    "asset id": "",
    "asset name": "",
    "asset type": "",
    "cybersecurity prospect": "",
    "severe consequences": "",
    "damage scenario": "",
    "damage scenario rationale": "",
    "STRIDE classification": "",
    "threat level": "",
    "threat scenario": "",
    "safety (road view)": "",
    "privacy (road view)": "",
    "operational (road view)": "",
    "financial (road view)": "",
    "brand (OEM view)": "",
    "financial (OEM view)": "",
    "operational (OEM view)": "",
    "impact sum": "0.00",
    "impact rating": "Low",
    "attack path id": "",
    "attack path": "",
    "attack vector": "",
    "CAL analysis": "",
    "elapsed time": "",
    "special expertise": "",
    "knowledge of item": "",
    "window of opportunity": "",
    "equipment": "",
    "attack potential": "",
    "attack feasibility rating": "",
    "attack feasibility rationale": "",
    "maximal risk value": "",
    "risk rating": "",
    "risk treatment": "",
    "risk treatment decision rationale": "",
    "cyber security goals": "",
    "cybersecurity claims": "",
    "strategy for security control": "",
    "specialist expertise": "",
    "new maximal risk value": "",
    "new maximal risk rating": ""
  }}
]

Do not add explanations or markdown formatting. Only return a raw JSON array as described.
""".strip()

    response = ollama.chat(model='mistral', messages=[
        {"role": "user", "content": system_prompt}
    ])

    raw_text = response['message']['content']
    clean_text = clean_json_response(raw_text)

    try:
        parsed = json.loads(clean_text)
        return parsed
    except json.JSONDecodeError:
        return {
            "error": "Response is not valid JSON",
            "raw_output": raw_text
        }
