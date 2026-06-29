# AgentFlow

AgentFlow is a full-stack AI conversational platform inspired by modern AI assistants like ChatGPT. It provides a clean and interactive chat interface where users can communicate with AI models, upload files, use voice input, and experience a scalable multi-model architecture.

## Features

- Multi-model AI chat interface
- Google Gemini AI integration
- ChatGPT-inspired responsive UI
- Voice-to-text input
- Secure Google Authentication
- Email & Password Authentication
- Forgot Password functionality
- File and folder upload support
- Markdown support for AI responses
- Real-time chat experience
- MongoDB Atlas integration
- Modular backend architecture for future AI models

## Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- React Markdown

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### AI Integration
- Google Gemini API

### Authentication
- Google OAuth
- Email & Password Authentication

### Voice Features
- Web Speech API
- Web Audio API

## Project Structure

```text
AgentFlow
│── frontend
│── backend
│── README.md
```

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/AgentFlow.git
cd AgentFlow
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside the backend folder.

```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
```

## Current Features

- AI-powered conversational interface
- Model selection interface
- User authentication
- Voice input
- File uploads
- Responsive dashboard
- Markdown AI responses

## Upcoming Features

- Image analysis
- PDF analysis
- AI memory
- Chat history synchronization
- Text-to-Speech
- Streaming AI responses
- Additional AI model integrations

## Screenshots

Add screenshots of your application here.

## License

This project is developed for educational and learning purposes.
