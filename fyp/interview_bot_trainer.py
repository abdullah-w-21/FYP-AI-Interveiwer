import json
from transformers import DistilBertForSequenceClassification, DistilBertTokenizer
import torch
from torch.utils.data import DataLoader, TensorDataset

# Load interview questions and answers from the JSON file.
with open("Questions.json", "r") as json_file:
    interview_data = json.load(json_file)

# Extract questions and answers
questions = list(interview_data.keys())
answers = list(interview_data.values())

# Use the DistilBERT tokenizer and model
tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")
model = DistilBertForSequenceClassification.from_pretrained("distilbert-base-uncased")

# Prepare data for training
inputs = tokenizer(questions, answers, padding=True, truncation=True, return_tensors="pt", max_length=128)
labels = torch.zeros(len(questions), 2)


# Create a DataLoader for training
dataset = TensorDataset(inputs.input_ids, inputs.attention_mask, labels)
batch_size = 32
dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

# Define optimizer and loss function
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-5)
loss_fn = torch.nn.BCEWithLogitsLoss()

# Training loop
num_epochs = 200  # Customize as needed
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.train()

for epoch in range(num_epochs):
    total_loss = 0
    for batch in dataloader:
        batch = tuple(t.to(device) for t in batch)
        inputs_ids, attention_mask, labels = batch

        optimizer.zero_grad()

        outputs = model(input_ids=inputs_ids, attention_mask=attention_mask)
        logits = outputs.logits

        loss = loss_fn(logits.squeeze(1), labels.float())
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    print(f"Epoch {epoch + 1}/{num_epochs}, Loss: {total_loss / len(dataloader)}")

# Save the trained model
model.save_pretrained("interview_model")
tokenizer.save_pretrained("interview_model")
