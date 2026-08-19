# 🏥 MedulAi

> **AI-Powered Clinical Assistant with Multi-Agent Orchestration**

MedulAi is an AI-powered clinical assistant that brings intelligent automation into real clinical workflows. It uses multi-agent orchestration, patient-aware conversations, semantic retrieval, clinical documentation assistance, and multimodal medical image analysis to support doctors across their daily tasks—while keeping them hands-on and in control of patient management, appointments, prescriptions, and clinical decisions.

[![Live Demo](https://img.shields.io/badge/Live_Demo-medulai--eta.vercel.app-1a73e8?style=for-the-badge&logo=vercel)](https://mediagent-eta.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend_API-medulai--pn7o.onrender.com-1a73e8?style=for-the-badge&logo=render)](https://mediagent-pn7o.onrender.com/)
[![API Docs](https://img.shields.io/badge/API_Docs-Swagger-1a73e8?style=for-the-badge&logo=swagger)](https://mediagent-pn7o.onrender.com/docs)
[![GitHub](https://img.shields.io/badge/GitHub-rajkaur--13-181717?style=for-the-badge&logo=github)](https://github.com/rajkaur-13)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Er.Rajinder--Kaur-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/er-rajinder-kaur-6344581a7/)
![MedulAi Demo](screenshots/medul1.gif)

---

## 🎯 Why MedulAi?

Clinical workflows are often fragmented across systems for patient records, documentation, appointments, prescriptions, and medical imaging. MedulAi brings these workflows together in a single clinical interface, reducing context switching while keeping doctors hands-on.

Doctors can use natural language to access AI-powered tools for patient retrieval, clinical documentation, appointment scheduling, medical image analysis, and clinical workflows.

MedulAi can also analyze available patient data—including medical history, allergies, chronic conditions, SOAP notes, prescriptions, laboratory results, imaging, and appointments—to summarize key findings, identify potential risks, and generate clinical insights and recommendations.

MedulAi is designed to **assist, not replace, clinicians**. Doctors remain in control of reviewing information, managing patients, and making clinical decisions, while AI helps reduce repetitive work and surface relevant information when it adds value.

---

## ✨ What It Does

| Capability | Description |
|------------|-------------|
| 🔍 **Patient Search & Retrieval** | Search patients by name or MRN with fuzzy matching. View complete demographics, medical history, allergies, conditions, and visit history. |
| 🧠 **Multi-Agent Clinical Reasoning** | LangGraph orchestrates specialized tools for patient retrieval, clinical documentation, appointments, prescriptions, and imaging. Intent detection routes requests to the right tool. |
| 📝 **SOAP Note Generation** | Generate structured clinical documentation (Subjective, Objective, Assessment, Plan) from brief descriptions. View, edit, and track SOAP note history. |
| 💊 **Prescription Management** | Create and manage prescriptions with AI assistance. Track all medications by date, dosage, and status. |
| 📅 **Appointment Scheduling** | Schedule appointments using natural language ("Schedule follow-up for Asha Kujur next Tuesday"). View upcoming appointments and today's schedule. |
| 🩻 **Medical Image Analysis** | Upload and analyze medical images using Gemini Vision. Supports X-Ray, CT, MRI, Ultrasound, Retina, ECG, Mammogram, Fluoroscopy, PET, and SPECT. AI generates structured findings, impression, and recommendations. Doctors can review, edit, and add clinical notes directly within the image analysis card in the chat interface. |
| 📚 **Semantic Patient Retrieval** | ChromaDB-powered vector search using 384-dimensional embeddings. Find similar patients and retrieve relevant clinical context for AI responses. |
| 💬 **Conversational Clinical Assistant** | Patient-aware chat interface where AI responses dynamically include current patient context. |

---

## 🏗️ Architecture

MedulAi separates the user interface, clinical application logic, AI orchestration, specialized tools, and data services while keeping AI integrated into the existing clinical workflow.

```text
                         ┌──────────────────────┐
                         │       React UI       │
                         │        Vercel        │
                         └──────────┬───────────┘
                                    │
                              REST API / JWT
                                    │
                         ┌──────────▼───────────┐
                         │       FastAPI        │
                         │        Render        │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │      LangGraph Orchestrator   │
                    │   Intent Detection & Routing  │
                    │      Context Management       │
                    └───────────────┬───────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
       Patient Tools          Clinical Tools        Imaging Tools
       • Search/Retrieve      • SOAP Notes          • Image Analysis
       • Patient Context      • Prescriptions       • Report Generation
                              • Appointments
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
         ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐
         │ PostgreSQL  │     │  ChromaDB   │     │ AI Services │
         │             │     │             │     │             │
         │ Clinical    │     │ Semantic    │     │ Groq        │
         │ Data        │     │ Retrieval   │     │ Llama 3.3   │
         │             │     │             │     │             │
         │ SOAP Notes  │     │ 384-dim     │     │ Gemini      │
         │ Prescriptions│    │ embeddings  │     │ Vision      │
         │ Appointments│     │             │     │             │
         └─────────────┘     └─────────────┘     └─────────────┘
```

---

## 🔍 Semantic Patient Retrieval

MedulAi uses **ChromaDB** for semantic retrieval of patient information. Patient data is converted into **384-dimensional embeddings** using `all-MiniLM-L6-v2` and stored in ChromaDB, allowing the system to find relevant patients and clinical context based on semantic similarity rather than exact keyword matches.

```text
Patient Data
     ↓
all-MiniLM-L6-v2
     ↓
384-dimensional embeddings
     ↓
ChromaDB
     ↓
Semantic Similarity Search
     ↓
Similar Patients / Relevant Context
     ↓
LLM
     ↓
Context-Aware Response
```

### Integration Points

| Component | Purpose |
|-----------|---------|
| **Patient Search** | Find patients by name, condition, or clinical description |
| **Similar Patients** | Retrieve comparable cases for clinical reference |
| **Context Injection** | Relevant patient data passed to LLM for patient-aware responses |

---

## 🩻 Medical Image Analysis

MedulAi integrates **Google Gemini Vision** to assist doctors with medical image analysis. Doctors can upload an image, receive a structured AI-generated report, review and edit the results, add clinical notes, and save the finalized analysis to the patient's record.

```text
Medical Image Upload
        ↓
Gemini Vision Analysis
        ↓
Structured AI Report
        ↓
┌──────────────────────────────┐
│ • Findings                   │
│ • Impression                 │
│ • Recommendations            │
└──────────────────────────────┘
        ↓
Doctor Review & Edit
        ↓
Clinical Notes
        ↓
Save to Patient Record
```

### Supported Image Types

| Modality | Examples |
|----------|----------|
| **X-Ray** | Chest, bone, dental |
| **CT** | Cross-sectional imaging |
| **MRI** | Brain, spine, soft tissue |
| **Ultrasound** | Abdominal, obstetric, cardiac |
| **Retina** | Retinal imaging |
| **ECG** | Electrocardiogram images |
| **Mammogram** | Breast imaging |
| **Fluoroscopy** | Fluoroscopic images |
| **PET** | PET imaging |
| **SPECT** | SPECT imaging |

### Analysis Output

The AI generates a structured report containing:

| Field | Description |
|-------|-------------|
| **Findings** | Key observations identified from the image |
| **Impression** | Summary of the analyzed findings |
| **Recommendations** | AI-generated suggestions for further clinical consideration |

### Doctor-in-the-Loop Workflow

MedulAi keeps the doctor involved in the final clinical workflow. After AI analysis, doctors can:

- 📝 Review the generated findings and impression
- ✏️ Edit the AI-generated report
- 📋 Add their own clinical notes
- 💾 Save the finalized analysis to the patient's record

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, CSS Modules, Lucide Icons |
| **Backend** | Python, FastAPI |
| **Orchestration** | LangGraph |
| **LLM** | Groq — Llama 3.3 70B |
| **Multimodal AI** | Google Gemini |
| **Database** | PostgreSQL |
| **Vector Store** | ChromaDB |
| **Embeddings** | all-MiniLM-L6-v2 |
| **Cache** | Redis |
| **Storage** | Backblaze B2 |
| **Authentication** | JWT, RBAC |
| **Evaluation** | RAGAS |
| **Deployment** | Docker, Vercel, Render |
| **CI/CD** | GitHub Actions |

---

## 📊 Evaluation

MedulAi includes an automated evaluation pipeline using **RAGAS** to assess the quality of AI-generated responses. The pipeline runs predefined clinical test scenarios and evaluates metrics such as answer relevancy, context precision, and faithfulness.

```text
Clinical Test Scenarios
          ↓
     LLM Responses
          ↓
    RAGAS Evaluation
          ↓
┌─────────────────────────────┐
│ • Answer Relevancy          │
│ • Context Precision         │
│ • Faithfulness              │
└─────────────────────────────┘
          ↓
    Evaluation Results
```

### Current Metrics

| Metric | Result |
|--------|--------|
| **Answer Relevancy** | 0.6679 |
| **Context Precision** | Under evaluation |
| **Faithfulness** | Under evaluation |
| **Test Coverage** | 26% |

### Test Scenarios

The evaluation pipeline uses predefined clinical scenarios covering different MedulAi workflows:

| Scenario | Example Query |
|----------|---------------|
| **Patient Search** | "Find patient with last name Smith" |
| **Appointments** | "Show me upcoming appointments for today" |
| **SOAP Notes** | "Generate SOAP note for patient with hypertension" |
| **Scheduling** | "Schedule appointment for patient Brown with Dr. Patel" |
| **Medications** | "What medications is patient Johnson currently taking?" |

### Evaluation Workflow

1. **Test Dataset** — Predefined clinical queries and expected context
2. **Response Collection** — Generate and capture LLM responses
3. **Metric Calculation** — RAGAS evaluates response quality
4. **Result Storage** — Evaluation results are stored for tracking and comparison

### Evaluation Files

| File | Purpose |
|------|---------|
| `evaluation/data/test_dataset.json` | Clinical test scenarios |
| `evaluation/scripts/evaluate.py` | Evaluation pipeline |
| `evaluation/results/evaluation_results.json` | Stored evaluation results |

> These results are intended to track system quality during development and **do not represent clinical validation or medical accuracy**.

---

## ⚡ Performance

| Metric | Value |
|--------|-------|
| **API Latency** | ~1.8s p95 |
| **Database Query** | ~35ms |
| **Vector Retrieval** | ~65ms |

> Performance figures are based on measurements from the current development environment and workload.

---

## 📁 Project Structure

```text
MedulAi/
├── backend/
│   └── app/
│       ├── agents/         # LangGraph orchestration
│       ├── api/            # FastAPI routes
│       ├── core/           # Configuration, prompts, security
│       ├── models/         # SQLAlchemy database models
│       ├── services/       # LLM, Vision, Vector, Storage, Cache
│       └── tools/          # Specialized clinical tools
│
├── frontend/
│   └── src/
│       ├── app/            # Application entry and main UI
│       ├── features/       # Patient, chat, SOAP, imaging, etc.
│       ├── services/       # API communication
│       └── styles/         # Application styles
│
├── evaluation/             # RAGAS evaluation pipeline
├── tests/                  # Automated tests
├── docker-compose.yml
└── README.md
```

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `backend/app/agents/` | LangGraph orchestration and agent workflows |
| `backend/app/api/` | FastAPI API routes |
| `backend/app/core/` | Configuration, prompts, and security |
| `backend/app/models/` | SQLAlchemy database models |
| `backend/app/services/` | LLM, Vision, Vector, Storage, and Cache services |
| `backend/app/tools/` | Specialized clinical tools used by the orchestrator |
| `frontend/src/features/` | Feature-based React modules |
| `frontend/src/services/` | Frontend API communication |
| `evaluation/` | RAGAS evaluation pipeline and results |
| `tests/` | Automated test suite |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL database
- Required API keys for AI features

### Using Docker

Clone the repository:

```bash
git clone https://github.com/yourusername/medulai.git
cd medulai
```

Create a `.env` file in the project root and add your database credentials and API keys.

Start the application:

```bash
docker-compose up --build
```

Docker Compose starts:
- **Frontend** — React application at http://localhost:3000
- **Backend** — FastAPI API at http://localhost:8000
- **Redis** — Redis cache on port 6379

Once running:
- Application: http://localhost:3000
- API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# ====================
# REQUIRED
# ====================

# Groq API Key for LLM inference (Llama 3.3 70B)
GROQ_API_KEY=your_groq_api_key

# Google Gemini API Key for medical image analysis
GEMINI_API_KEY=your_gemini_api_key

# PostgreSQL database connection string
DATABASE_URL=postgresql://user:password@localhost:5432/medulai

# Secret key for JWT authentication
SECRET_KEY=your_secret_key_here

# ====================
# OPTIONAL
# ====================

# Redis cache (for orchestration state management)
REDIS_URL=redis://localhost:6379

# Backblaze B2 storage (for medical image uploads)
B2_KEY_ID=your_b2_key_id
B2_APPLICATION_KEY=your_b2_app_key
B2_BUCKET_NAME=medulai-images

# API Configuration
CORS_ORIGINS=http://localhost:3000,https://medulai-eta.vercel.app
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256
```

### Required Variables

| Variable | Purpose |
|----------|---------|
| `GROQ_API_KEY` | LLM inference for chat and agent orchestration |
| `GEMINI_API_KEY` | Medical image analysis |
| `DATABASE_URL` | PostgreSQL connection for patient data, SOAP notes, etc. |
| `SECRET_KEY` | JWT token signing |

### Optional Variables

| Variable | Purpose |
|----------|---------|
| `REDIS_URL` | Session state and caching for orchestration |
| `B2_*` | Backblaze B2 storage for medical images |
| `CORS_ORIGINS` | Allowed frontend origins |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiration (default: 30) |
| `ALGORITHM` | JWT signing algorithm (default: HS256) |

> **Note:** Without `GROQ_API_KEY` and `GEMINI_API_KEY`, AI features will not function. The application will still run but LLM and Vision capabilities will be disabled.

---

## ⚠️ Disclaimer

**MedulAi is a research and engineering project** intended to demonstrate AI-assisted clinical workflows. It is **not a medical device** and should **not be used as a substitute for professional medical judgment, diagnosis, or treatment**.

- AI-generated outputs, including clinical documentation, recommendations, and medical image analysis, are **suggestions only** and require **human review and validation**.
- The system has **not been clinically validated** and is not intended to meet medical device regulatory requirements.
- Patient data should be handled in accordance with **applicable privacy and data-protection regulations**.
- Healthcare professionals should independently review and make all clinical decisions.

> **MedulAi is provided "as-is" for demonstration and educational purposes.**

---

## 📬 Author

**Rajinder Kaur**  
AI Engineer | Generative AI | LLM Applications | Multi-Agent Systems

[![GitHub](https://img.shields.io/badge/GitHub-rajkaur--13-181717?style=for-the-badge&logo=github)](https://github.com/rajkaur-13)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Er.Rajinder--Kaur-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/er-rajinder-kaur-6344581a7/)
