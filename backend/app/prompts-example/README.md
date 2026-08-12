
⚠️ **Note**: This directory contains the **code structure and architecture overview** only.  
The actual implementation is maintained in the **private repository**.
prompts/
├── init.py
├── system_prompts.py # System-level prompts for agents
├── clinical_prompts.py # Clinical reasoning and diagnosis prompts
├── tool_prompts.py # Tool selection and routing prompts
├── vision_prompts.py # Medical image analysis prompts
├── rag_prompts.py # Retrieval-augmented generation prompts
├── evaluation_prompts.py # Response quality evaluation prompts
└── templates/
├── init.py
├── soap_template.py # SOAP note generation templates
└── prescription_template.py # Prescription generation templates

## Prompt Categories

| Category | Purpose |
|----------|---------|
| **System Prompts** | Define agent role, behavior, and constraints |
| **Clinical Prompts** | Medical reasoning, diagnosis, treatment planning |
| **Tool Prompts** | Guide agent to select and use appropriate tools |
| **Vision Prompts** | Medical image interpretation and analysis |
| **RAG Prompts** | Retrieval-augmented generation for evidence-based responses |
| **Evaluation Prompts** | Quality assessment of AI-generated outputs |

## Prompt Design Principles

- **Clinical accuracy** - Medically validated content
- **Professional tone** - Appropriate for healthcare
- **Structured output** - Consistent, parsable formats
- **Safety first** - Guardrails against harmful responses
- **Context awareness** - Patient-specific information

## Technologies Used

- **LangChain** - Prompt templates and management
- **Groq LLM** - llama-3.3-70b-versatile model
- **Google Gemini** - Vision and multimodal prompts

---

📁 **Full implementation**: [`prompts/`](https://github.com/rajkaur-13/mediagent-private)  
🔒 *This directory is part of the private repository and contains proprietary prompt engineering.*
