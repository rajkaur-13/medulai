
⚠️ **Note**: This directory contains the **code structure and architecture overview** only.  
The actual implementation is maintained in the **private repository**.
features/
├── auth/
│ ├── components/
│ │ ├── Login.jsx
│ │ └── Login.css
│ └── hooks/
│ └── useAuth.js
│
├── patients/
│ ├── components/
│ │ └── PatientPanel.jsx
│ └── hooks/
│ └── usePatients.js
│
├── chat/
│ ├── components/
│ │ └── ChatPanel.jsx
│ └── hooks/
│ └── useChat.js
│
├── clinical/
│ └── components/
│ └── ClinicalPanel.jsx
│
├── soap/
│ └── hooks/
│ └── useSoap.js
│
├── prescriptions/
│ └── hooks/
│ └── usePrescription.js
│
├── imaging/
│ └── components/
│ ├── AnalyzeButton.jsx
│ └── XRayAnalyzer.jsx
│
└── appointments/
└── hooks/
└── useAppointments.js

## Feature Descriptions

| Feature | Purpose |
|---------|---------|
| **Auth** | Login, authentication, session management |
| **Patients** | Patient search, selection, context display |
| **Chat** | AI-powered clinical conversation interface |
| **Clinical** | SOAP notes, prescriptions, clinical tools |
| **Soap** | SOAP note creation and management |
| **Prescriptions** | Prescription creation and management |
| **Imaging** | Medical image upload and analysis |
| **Appointments** | Appointment scheduling and management |

## Architecture

UI Components → Custom Hooks → API Services → Backend



## Technologies Used

- **React 18** - UI framework
- **Lucide Icons** - Modern icon library
- **CSS Modules** - Scoped styling
- **React Hooks** - State and effect management

---

📁 **Full implementation**: [`features/`](https://github.com/rajkaur-13/mediagent-private)  
🔒 *This directory is part of the private repository and contains proprietary UI logic.*
