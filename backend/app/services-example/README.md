>⚠️ **Note**: This directory contains the **code structure and architecture overview** only.  
>The actual implementation is maintained in the **private repository**.

---

```text
services/
├── init.py
├── llm_service.py # LLM interaction and response generation
├── vision_service.py # Medical image analysis with multimodal LLM
├── chroma_service.py # Vector database operations (ChromaDB)
├── pinecone_service.py # Pinecone vector DB operations
├── vector_service.py # Semantic retrieval and embeddings
├── research_service.py # Clinical literature and evidence retrieval
├── b2_storage.py # Cloud storage (Backblaze B2)
├── redis_service.py # Session and cache management
├── local_storage.py # Local file storage
└── init.py
```


## File Descriptions

| File | Purpose |
|------|---------|
| `llm_service.py` | LLM interaction, prompt management, response generation |
| `vision_service.py` | Multimodal medical image analysis with Gemini |
| `chroma_service.py` | ChromaDB vector operations for embeddings |
| `pinecone_service.py` | Pinecone vector DB operations (alternative to Chroma) |
| `vector_service.py` | Embedding generation, semantic search, retrieval |
| `research_service.py` | Literature search, evidence retrieval |
| `b2_storage.py` | Medical image storage (Backblaze B2) |
| `redis_service.py` | Session and cache management |
| `local_storage.py` | Local file storage for development |

## Service Architecture

Application → Service Layer → External APIs/DBs



## Technologies Used

| Service | Technology |
|---------|------------|
| **LLM** | Google Gemini / Groq |
| **Vision** | Google Gemini Vision |
| **Vector DB** | ChromaDB / Pinecone |
| **Storage** | Backblaze B2 |
| **Cache** | Redis |
| **Database** | PostgreSQL |

## Key Features

- **Factory pattern** → Consistent service creation
- **Registry pattern** → Dynamic service discovery
- **Client isolation** → Clean API client separation
- **Configuration-driven** → Easy to modify settings
- **Caching** → Redis for performance

---

📁 **Full implementation**: [`services/`](https://github.com/rajkaur-13/mediagent-private)  
🔒 *This directory is part of the private repository and contains proprietary service logic.*
