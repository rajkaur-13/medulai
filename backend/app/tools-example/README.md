
⚠️ **Note**: This directory contains the **code structure and architecture overview** only.  
The actual implementation is maintained in the **private repository**.
tools/
├── init.py
├── patient_tools.py # Patient search, filtering, similarity
├── appointment_tools.py # Scheduling, availability, conflict detection
├── soap_tools.py # SOAP note generation and extraction
├── prescription_tools.py # Prescription creation and management
├── image_tools.py # Medical image analysis workflow
├── severity_analyzer.py # Clinical urgency assessment
├── similar_patients_tool.py # Patient similarity and retrieval
└── vision_service.py # Vision service integration

## File Descriptions

| File | Purpose |
|------|---------|
| `patient_tools.py` | Search, filter, find similar patients |
| `appointment_tools.py` | Schedule, availability, conflicts |
| `soap_tools.py` | Generate and extract SOAP notes |
| `prescription_tools.py` | Create, validate, manage prescriptions |
| `image_tools.py` | Image upload, analysis, reporting |
| `severity_analyzer.py` | Assess clinical urgency |
| `similar_patients_tool.py` | Find similar patients using vectors |
| `vision_service.py` | Medical image analysis |

## Tool Architecture

Agent → Tool Executor → Tool Registry → Specific Tool → Result



## Key Features

- **Registry pattern** → Dynamic tool discovery
- **Base class** → Consistent tool interface
- **Helper utilities** → Reusable functions
- **Validation** → Input/output validation

---

📁 **Full implementation**: [`tools/`](https://github.com/rajkaur-13/mediagent-private)  
🔒 *This directory is part of the private repository and contains proprietary clinical logic.*
