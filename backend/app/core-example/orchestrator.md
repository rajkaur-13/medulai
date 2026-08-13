# Orchestrator - High-Level Architecture

> ⚠️ **Note**: This document describes the **architecture and flow** of the orchestrator.  
> The actual implementation is maintained in the **private repository**.

---

## 🎯 Purpose

The orchestrator is the **central brain** of MedulAI. It receives user messages, understands the intent, routes to the appropriate agent/tool, and returns a formatted response.

---

## 🔄 High-Level Flow

```text
┌─────────────────────────────────────────────────────────────────┐
│ User Message │
│ "Show me Asha Kujur" │
└───────────────────────────┬─────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ Orchestrator │
│ │
│ 1. Check Complex Queries → 2. Detect Intent → 3. Route │
│ │
└───────────────────────────┬─────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ Intent Detection │
│ │
│ "search_patient" → Search patient by name │
│ "generate_soap" → Create SOAP note │
│ "view_prescriptions" → List prescriptions │
│ "schedule_appointment" → Book appointment │
│ "general" → Free-text response │
└───────────────────────────┬─────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ Tool/Agent Execution │
│ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│ │ Patient │ │ Clinical │ │ Appointment │ │
│ │ Tools │ │ Tools │ │ Tools │ │
│ └─────────────┘ └─────────────┘ └─────────────────────┘ │
│ │
└───────────────────────────┬─────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ Response Generation │
│ │
│ Format results → Add context → Return to user │
│ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Core Components

| Component | Responsibility |
|-----------|----------------|
| **Intent Detector** | Uses LLM to understand what the user wants |
| **Router** | Routes to the appropriate tool/agent |
| **Context Manager** | Maintains patient context across messages |
| **Response Formatter** | Formats results into user-friendly messages |

---

## 🔧 Supported Actions

| Action | Description |
|--------|-------------|
| `search_patient` | Find a patient by name |
| `get_all_patients` | List all patients |
| `schedule_appointment` | Book an appointment |
| `get_appointments` | View appointments |
| `generate_soap_note` | Create a SOAP note |
| `get_soap_notes` | View SOAP notes |
| `generate_prescription` | Create a prescription |
| `view_prescriptions` | List prescriptions |
| `view_imaging` | View imaging reports |
| `view_appointments` | View upcoming appointments |
| `search_images` | Search images by type |
| `view_medications` | List current medications |
| `general` | Free-text LLM response |

---

## 🔍 Intent Detection

The orchestrator uses an LLM to detect intent from natural language:

User: "Show me Asha Kujur's last SOAP note"
↓
Intent: "view_soap_notes"
Params: { "patient_name": "Asha Kujur" }
↓
Action: Fetch and display SOAP notes

---

## 📦 Key Features

| Feature | Description |
|---------|-------------|
| **Dynamic Intent Detection** | LLM understands natural language |
| **Context Awareness** | Maintains patient context across messages |
| **Tool Routing** | Routes to appropriate tools |
| **Error Handling** | Graceful fallback for unknown queries |
| **Multi-step Workflows** | Handles complex multi-step operations |

---

## 🛠️ Technologies

- **Python** - Core language
- **FastAPI** - API layer
- **SQLAlchemy** - Database ORM
- **LangChain** - LLM integration
- **Groq LLM** - Intent detection and responses

---

📁 **Full implementation**: [`core/orchestrator.py`](https://github.com/rajkaur-13/mediagent-private)  
🔒 *This file is part of the private repository and contains proprietary orchestration logic.*
