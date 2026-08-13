> ⚠️ **Note**: This directory contains the **code structure and architecture overview** only.  
> The actual implementation is maintained in the **private repository**.

---

## 📁 File: `langgraph_agent.py`

```text
langgraph_agent.py
├── AgentState (TypedDict)
│   ├── messages: List[Dict[str, str]]
│   ├── current_patient: Optional[Dict[str, Any]]
│   ├── current_patient_id: Optional[str]
│   ├── tool_results: List[Dict[str, Any]]
│   ├── plan: List[str]
│   ├── next_action: str
│   ├── final_response: str
│   └── params: Dict[str, Any]
│
├── Tools (LangChain @tool decorator)
│   ├── search_patient_tool         # Search patient by name
│   ├── get_all_patients_tool       # Get all patients
│   ├── schedule_appointment_tool   # Book appointments
│   ├── get_appointments_tool       # Get appointments
│   └── generate_soap_note_tool     # Generate SOAP notes
│
├── Nodes (StateGraph nodes)
│   ├── planner()          # Decides what action to take
│   ├── executor()         # Executes the planned action
│   ├── reflector()        # Checks if action succeeded
│   └── response_generator() # Generates final response
│
├── Edges & Routing
│   ├── set_entry_point("planner")
│   ├── conditional_edges()
│   └── should_continue()  # Determines next step
│
└── Class: LangGraphOrchestrator
    ├── __init__(db, doctor_id)
    └── process_message(user_message) → response
```


---

## 🔄 Graph Flow

User Message
    │
    ▼
┌──────────┐
│ Planner  │  → Decides action (search_patient, get_all_patients, etc.)
└────┬─────┘
     │
     ▼
┌──────────┐
│ Executor │  → Calls the appropriate tool with parameters
└────┬─────┘
     │
     ▼
┌──────────┐
│ Reflector│  → Checks if action succeeded
└────┬─────┘
     │
     ▼
┌──────────┐
│ Response │  → Formats and returns final response
└──────────┘

---

## 🔑 Key Components

| Component | Purpose |
|-----------|---------|
| `AgentState` | State management for the graph |
| `@tool` functions | LangChain tools for clinical actions |
| `planner()` | LLM decides which action to take |
| `executor()` | Runs the selected tool |
| `reflector()` | Validates execution |
| `response_generator()` | Creates user-facing response |
| `LangGraphOrchestrator` | Main entry point for processing messages |

---

## 🛠️ Technologies Used

- **LangGraph** - State graph orchestration
- **LangChain** - Tool decorators and LLM integration
- **Groq LLM** - llama-3.3-70b-versatile model
- **FastAPI** - API layer

---

## ✨ Features

- **Dynamic parameter extraction** → Extracts names, dates, times from messages
- **Tool routing** → Routes to appropriate clinical tools
- **State management** → Maintains patient context across messages
- **Conditional flow** → Decides whether to continue or respond

---

📁 **Full implementation**: [`agents/langgraph_agent.py`](https://github.com/rajkaur-13/mediagent-private)  
🔒 *This file is part of the private repository and contains proprietary orchestration logic.*
