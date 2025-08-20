from transformers import AutoModelForCausalLM
from peft import PeftModel

# 1. Load base model
base_model = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-Instruct-v0.1")

# 2. Load LoRA weights
lora_path = "./mistral-lora-finetuned/checkpoint-50"
peft_model = PeftModel.from_pretrained(base_model, lora_path, is_trainable=False)

# 3. Merge LoRA adapter into base model
merged_model = peft_model.merge_and_unload()

# 4. Push to Hugging Face Hub
merged_model.push_to_hub("MeuruReflex/mistral-lora-finetuned", use_temp_dir=False)
