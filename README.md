# Interactive Tutor AI Chat

A web-based application that provides personalized AI tutoring through a conversational interface with Retrieval-Augmented Generation (RAG) capabilities.

## Project Structure

```
├── backend/                 # Flask backend API
│   ├── app/                # Application package
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic services
│   │   └── utils/          # Utility functions
│   ├── extensions/         # Flask extensions
│   ├── migrations/         # Database migrations
│   ├── config.py          # Configuration settings
│   ├── main.py            # Application entry point
│   └── requirements.txt   # Python dependencies
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/               # Utility libraries
│   ├── hooks/             # Custom React hooks
│   └── public/            # Static assets
└── .kiro/                 # Kiro specifications
    └── specs/             # Feature specifications
```

## Technology Stack

### Backend
- **Framework**: Flask with Flask-RESTful
- **Database**: PostgreSQL (SQLAlchemy ORM)
- **Authentication**: JWT with Flask-JWT-Extended
- **AI Integration**: OpenAI API
- **Vector Database**: ChromaDB for RAG
- **Embeddings**: Sentence Transformers
- **Caching**: Redis

### Frontend
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Context + useReducer
- **HTTP Client**: Axios
- **Authentication**: JWT with automatic refresh

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- Redis (for caching)
- PostgreSQL (optional, SQLite used by default)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```

5. Update `.env` with your configuration:
   - Set your OpenAI API key
   - Configure database URI if using PostgreSQL
   - Set email configuration for user registration

6. Initialize the database:
   ```bash
   python init_db.py
   ```

7. Run the development server:
   ```bash
   python main.py
   ```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment configuration:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` if needed (default configuration should work for local development)

5. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## Features

### Implemented
- ✅ Project structure and development environment
- ✅ Flask backend with proper package organization
- ✅ Next.js frontend with TypeScript
- ✅ Authentication system (JWT-based)
- ✅ Database models and relationships
- ✅ RAG system with ChromaDB integration
- ✅ API client and context providers
- ✅ Service layer architecture

### In Development
- 🔄 Authentication API endpoints
- 🔄 Chat interface components
- 🔄 Real-time messaging
- 🔄 RAG-enhanced responses
- 🔄 Document upload and management

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Conversations
- `GET /api/conversations` - List user conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/{id}` - Get conversation details
- `DELETE /api/conversations/{id}` - Delete conversation

### Messages
- `GET /api/conversations/{id}/messages` - Get conversation messages
- `POST /api/conversations/{id}/messages` - Send message

### RAG System
- `POST /api/rag/query` - RAG-enhanced query
- `POST /api/rag/search` - Search knowledge base
- `GET /api/rag/sources` - Get available sources

### Documents
- `POST /api/upload/document` - Upload document
- `GET /api/documents` - List documents
- `DELETE /api/documents/{id}` - Delete document

## Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests (when implemented)
cd frontend
npm test
```

### Code Style
- Backend: Follow PEP 8 guidelines
- Frontend: ESLint configuration included

### Database Migrations
```bash
cd backend
flask db migrate -m "Description of changes"
flask db upgrade
```

## Contributing

1. Follow the existing code structure and patterns
2. Write tests for new features
3. Update documentation as needed
4. Follow the established naming conventions

## License

This project is for educational purposes.