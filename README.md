# Learuma AI

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/your-username/learuma-ai)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://python.org)
[![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org)

A modern AI-powered chat application built with Flask backend and Next.js frontend, featuring real-time conversations, user authentication, and file upload capabilities.

## 🚀 Technology Stack

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - Database ORM
- **Flask-JWT-Extended** - JWT authentication
- **Flask-CORS** - Cross-origin resource sharing
- **ChromaDB** - Vector database for AI embeddings
- **Python 3.8+** - Programming language

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **React Markdown** - Markdown rendering
- **Axios** - HTTP client

## 📁 Project Structure

```
learuma-ai/
├── backend/                 # Flask API server
│   ├── app/                # Application modules
│   │   ├── models/         # Database models (User, Chat, Message)
│   │   ├── routes/         # API endpoints (auth, chat, message, upload)
│   │   └── services/       # Business logic services
│   ├── extensions/         # Flask extensions (database, chroma)
│   ├── migrations/         # Database migrations
│   ├── instance/           # Instance-specific files (SQLite DB)
│   ├── chroma_db/          # Vector database storage
│   ├── main.py             # Application entry point
│   ├── config.py           # Configuration settings
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js application
│   ├── app/                # App Router pages (chat, dashboard, login, signup)
│   ├── components/         # React components (UI, forms, chat interface)
│   │   ├── ui/             # Reusable UI components
│   │   ├── magicui/        # Magic UI components
│   │   └── prompt-kit/     # Prompt-related components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── public/             # Static assets and images
│   └── package.json        # Node.js dependencies
├── docs/                   # Documentation files
│   ├── API.md              # API documentation
│   ├── DEPLOYMENT.md       # Deployment guide
│   └── DEVELOPMENT.md      # Development guide
└── .kiro/                  # Kiro AI assistant configuration
    ├── hooks/              # Agent hooks
    └── specs/              # Project specifications
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn package manager

### Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
cp .env.example .env
# Configure your .env file
python main.py
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure your .env.local file
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 Documentation

- [API Documentation](docs/API.md) - Complete API reference
- [Development Guide](docs/DEVELOPMENT.md) - Coding standards and workflow
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment guide

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based authentication
- 💬 **AI Chat Interface** - Real-time conversations with AI
- 📁 **File Upload** - Support for document uploads
- 🎨 **Modern UI** - Responsive design with dark/light themes
- 🔄 **Real-time Updates** - Live chat functionality
- 📱 **Mobile Friendly** - Optimized for all devices

## 🛠️ Development

```bash
# Backend development
cd backend
python main.py

# Frontend development
cd frontend
npm run dev

# Linting
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the [Development Guide](docs/DEVELOPMENT.md) for troubleshooting
- Review the [API Documentation](docs/API.md) for endpoint details