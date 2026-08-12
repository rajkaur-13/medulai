
⚠️ **Note**: This directory contains the **code structure and architecture overview** only.  
The actual implementation is maintained in the **private repository**.
hooks/
├── useAuth.js # Authentication state management
├── usePatients.js # Patient data and selection
├── useChat.js # Chat interface and messaging
├── useSoap.js # SOAP note management
├── usePrescription.js # Prescription operations
├── useAppointments.js # Appointment scheduling
└── useImaging.js # Medical image analysis

## Hook Descriptions

| Hook | Purpose |
|------|---------|
| `useAuth` | Login, logout, token management, user session |
| `usePatients` | Fetch patients, search, select, cache management |
| `useChat` | Send messages, receive responses, conversation history |
| `useSoap` | Create, save, retrieve SOAP notes |
| `usePrescription` | Create, save, retrieve prescriptions |
| `useAppointments` | Schedule, view, manage appointments |
| `useImaging` | Upload images, trigger analysis, view reports |

## Hook Design Patterns

- **Separation of concerns** - Logic separated from UI components
- **Reusability** - Hooks can be shared across multiple components
- **State management** - Consistent state updates
- **Error handling** - Graceful error handling and user feedback

## Integration Pattern

Component → Hook → API Service → Backend
↓
State Update
↓
Component Re-render



---

📁 **Full implementation**: [`hooks/`](https://github.com/rajkaur-13/mediagent-private)  
🔒 *This directory is part of the private repository and contains proprietary hook logic.*
