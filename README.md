# Tux - PR Review Tool

A modern, open-source PR review tool with an enhanced UX for understanding code changes.

## Features (MVP)
- Fetch and display public GitHub PRs
- View PR title and description
- Display file diffs with syntax highlighting
- View and filter comments by author
- Clean 3-pane layout (navigation, diff viewer, sidebar)

## Tech Stack
- **Backend**: Node.js + Express
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **API**: GitHub REST API

## Getting Started

### Prerequisites
- Node.js 18+ 
- GitHub Personal Access Token (for API rate limits)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd tux
```

2. Install backend dependencies
```bash
cd backend
npm install
cp .env.example .env
# Add your GitHub token to .env
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend (from backend directory)
```bash
npm run dev
```

2. Start the frontend (from frontend directory)
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

## Project Structure
```
tux/
├── backend/       # Express API server
├── frontend/      # React TypeScript app
└── README.md
```

## License
MIT

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
