# Development Guide

This guide covers development practices, coding standards, and workflows for the Learuma AI project.

## Development Environment Setup

### Prerequisites

- Python 3.8+ with pip
- Node.js 18+ with npm
- Git for version control
- Code editor (VS Code recommended)

### Backend Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd learuma-ai
   ```

2. **Set up Python virtual environment**
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # source .venv/bin/activate  # macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run the development server**
   ```bash
   python main.py
   ```

### Frontend Development Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## Project Architecture

### Backend Structure

```
backend/
├── app/
│   ├── models/          # Database models
│   │   ├── user.py      # User model
│   │   ├── chat.py      # Chat model
│   │   └── message.py   # Message model
│   ├── routes/          # API endpoints
│   │   ├── auth.py      # Authentication routes
│   │   ├── chat.py      # Chat management routes
│   │   ├── message.py   # Message handling routes
│   │   └── upload.py    # File upload routes
│   └── services/        # Business logic
│       └── agent.py     # AI agent service
├── extensions/          # Flask extensions
│   ├── database.py      # Database configuration
│   └── chroma.py        # Vector database setup
├── migrations/          # Database migrations
├── instance/            # Instance-specific files
├── chroma_db/           # Vector database storage
├── main.py              # Application entry point
├── config.py            # Configuration settings
└── requirements.txt     # Python dependencies
```

### Frontend Structure

```
frontend/
├── app/                 # Next.js App Router
│   ├── chat/           # Chat interface pages
│   ├── dashboard/      # Dashboard pages
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/             # Reusable UI components
│   ├── magicui/        # Magic UI components
│   ├── prompt-kit/     # Prompt-related components
│   ├── chat.tsx        # Chat interface
│   ├── login-form.tsx  # Login form
│   └── signup-form.tsx # Signup form
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── public/             # Static assets
└── package.json        # Dependencies and scripts
```

## Coding Standards

### Python (Backend)

- Follow PEP 8 style guidelines
- Use type hints where appropriate
- Write docstrings for functions and classes
- Use meaningful variable and function names
- Keep functions small and focused

**Example:**
```python
from typing import Optional
from flask import jsonify, request

def create_user(username: str, email: str, password: str) -> Optional[dict]:
    """
    Create a new user account.
    
    Args:
        username: The user's username
        email: The user's email address
        password: The user's password
        
    Returns:
        User data dictionary or None if creation fails
    """
    # Implementation here
    pass
```

### TypeScript (Frontend)

- Use TypeScript for all new code
- Define interfaces for data structures
- Use meaningful component and variable names
- Follow React best practices
- Use functional components with hooks

**Example:**
```typescript
interface User {
  id: number;
  username: string;
  email: string;
}

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  // Component implementation
};
```

## Database Management

### Models

The application uses SQLAlchemy ORM with the following models:

- **User**: User accounts and authentication
- **Chat**: Chat sessions
- **Message**: Individual messages within chats

### Migrations

Database schema changes should be handled through migrations:

```bash
# Create a new migration
flask db migrate -m "Description of changes"

# Apply migrations
flask db upgrade
```

## API Development

### Route Organization

- **auth.py**: Authentication endpoints (`/api/auth/*`)
- **chat.py**: Chat management endpoints (`/api/chats/*`)
- **message.py**: Message handling endpoints (`/api/messages/*`)
- **upload.py**: File upload endpoints (`/api/upload/*`)

### Error Handling

Use consistent error response format:

```python
from flask import jsonify

def handle_error(message: str, status_code: int = 400):
    return jsonify({"error": message}), status_code
```

## Testing

### Backend Testing

```bash
# Run tests
python -m pytest

# Run with coverage
python -m pytest --cov=app
```

### Frontend Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes
- `docs/documentation-update` - Documentation changes

### Commit Messages

Use conventional commit format:

```
type(scope): description

feat(auth): add JWT token refresh functionality
fix(chat): resolve message ordering issue
docs(api): update endpoint documentation
```

## Development Tools

### Recommended VS Code Extensions

- Python
- Pylance
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- GitLens
- Thunder Client (for API testing)

### Environment Configuration

Create `.vscode/settings.json` for consistent formatting:

```json
{
  "python.defaultInterpreterPath": "./backend/.venv/Scripts/python.exe",
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

## Debugging

### Backend Debugging

1. Enable Flask debug mode in development
2. Use Python debugger (`pdb`) for complex issues
3. Check logs in the console output

### Frontend Debugging

1. Use browser developer tools
2. Enable React Developer Tools extension
3. Use `console.log` for debugging (remove before production)

## Performance Considerations

### Backend

- Use database indexes for frequently queried fields
- Implement pagination for large data sets
- Cache frequently accessed data
- Optimize database queries

### Frontend

- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize images and assets
- Minimize bundle size

## Security Best Practices

- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Validate all user inputs
- Implement proper authentication and authorization
- Keep dependencies updated

## Troubleshooting

### Common Backend Issues

1. **Database connection errors**: Check database configuration in `.env`
2. **Import errors**: Ensure virtual environment is activated
3. **Port conflicts**: Change port in `main.py` if 5000 is occupied

### Common Frontend Issues

1. **Module not found**: Run `npm install` to ensure dependencies are installed
2. **Build errors**: Check TypeScript errors and fix them
3. **API connection issues**: Verify backend is running and CORS is configured

### Environment Issues

1. **Python version conflicts**: Use virtual environments
2. **Node version issues**: Use nvm to manage Node.js versions
3. **Package conflicts**: Delete `node_modules` and reinstall

## Contributing Guidelines

1. Fork the repository
2. Create a feature branch
3. Make your changes following the coding standards
4. Write tests for new functionality
5. Update documentation as needed
6. Submit a pull request with a clear description

## Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)