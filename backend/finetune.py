from transformers import AutoTokenizer, AutoModelForCausalLM, Trainer, TrainingArguments, DataCollatorForLanguageModeling
from datasets import load_dataset
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from transformers import BitsAndBytesConfig
import torch

model_name = "mistralai/Mistral-7B-v0.1"

assert torch.cuda.is_available(), "CUDA is not available. Make sure you're using a compatible GPU."


bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16
)


model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=bnb_config,
    device_map="auto",
    trust_remote_code=True
)


model = prepare_model_for_kbit_training(model)


lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

model = get_peft_model(model, lora_config)


tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=True)
tokenizer.pad_token = tokenizer.eos_token


dataset = load_dataset("json", data_files="tara_synthetic_dataset_100_remake.jsonl")["train"]

def tokenize_fn(examples):
    return tokenizer(examples["input"], padding="max_length", truncation=True, max_length=512)

dataset = dataset.map(tokenize_fn, batched=True)

training_args = TrainingArguments(
    output_dir="./mistral-lora-finetuned",
    per_device_train_batch_size=1,
    gradient_accumulation_steps=4,
    warmup_steps=10,
    learning_rate=2e-4,
    logging_steps=10,
    num_train_epochs=2,
    save_strategy="epoch",
    fp16=True,
    report_to="none"
)


trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    data_collator=DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)
)


trainer.train()
