# Prompts - High-Level Architecture

> ⚠️ **Note**: This document describes the **prompt architecture and structure**.  
> The actual implementation is maintained in the **private repository**.

---

## 🎯 Purpose

Prompts guide the AI's behavior, define its role, and provide instructions for tool usage. They are the **"secret sauce"** of the AI system.

---

## 📋 Prompt Categories

| Category | Purpose |
|----------|---------|
| **System Prompts** | Defines the AI's role, capabilities, and rules |
| **Tool Descriptions** | Explains available tools and their parameters |
| **Clinical Prompts** | Medical reasoning and diagnosis instructions |
| **Vision Prompts** | Medical image analysis instructions |

---

## 🧠 System Prompt Structure

You are MediAgent, an AI medical assistant for doctors.


Your Capabilities
List of available tools with descriptions

Tool parameters and usage

Rules
Always use tools to access data

Never invent patient information

Maintain context across conversations

Be concise and professional

Response Format
Clear summaries

Structured results

Professional tone



---

## 🔧 Tool Descriptions

Each tool is described with:

| Field | Description |
|-------|-------------|
| **Name** | Tool identifier |
| **Purpose** | What the tool does |
| **Parameters** | Required inputs |
| **Returns** | What the tool returns |

---

## 📦 Key Features

| Feature | Description |
|---------|-------------|
| **Role Definition** | Defines AI as a medical assistant |
| **Tool Instructions** | Explains how to use each tool |
| **Rules & Constraints** | Guardrails for safe behavior |
| **Response Guidelines** | Consistent output format |
| **Context Management** | Maintains conversation context |

---

## 🛠️ Technologies

- **LangChain** - Prompt templates
- **Groq LLM** - Model provider
- **Google Gemini** - Vision prompts

---

📁 **Full implementation**: [`core/prompts.py`](https://github.com/rajkaur-13/mediagent-private)  
🔒 *This file is part of the private repository and contains proprietary prompt engineering.*
