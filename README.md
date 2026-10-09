# BizMind AI 🚀

> **AI-Powered Business Planning SaaS** with multi-agent intelligence, market research synthesis, financial projections, and RAG-based context integration.

---

## 🌟 Overview

**BizMind AI** is a full-stack SaaS platform designed to transform raw business ideas into comprehensive, investor-ready business plans in seconds. Powered by **Groq API** (Llama 3.3 70B) with automatic fallback to **Google Gemini 2.0 Flash**, BizMind AI leverages a Retrieval-Augmented Generation (RAG) architecture to enrich business strategies with custom knowledge base documents (PDFs, CSVs, TXT, DOCX).

---

## 🛠️ Key Features

- **⚡ Multi-Agent Business Plan Generation**: Automatically generates complete 7-part business plans including Executive Summary, Market Analysis, Products & Services, Marketing Strategy, Operations Plan, Financial Plan, and Risk Assessment.
- **📚 RAG Knowledge Base Integration**: Upload custom PDFs, spreadsheets, or documents to build a private knowledge base. The system indexes document embeddings using **LanceDB / Vector Store** to enrich AI outputs.
- **🔐 Secure Authentication**: Full JWT-based authentication flow with encrypted passwords (`bcryptjs`), user sessions, and protected API routes.
- **📊 Interactive Dashboard**: Modern dark-themed dashboard built with **React**, **Vite**, **TailwindCSS**, and **Framer Motion**.
- **📄 PDF Export & Reporting**: Export full, boardroom-ready business plan reports straight from the browser.
- **⚙️ Configurable AI Engine**: Support for Groq (Llama 3.3 70B) as primary provider with fallback to Gemini 2.0 Flash.

---

## 🏗️ Technical Architecture & Tech Stack

### **Frontend**
- **Framework**: React 19 + Vite 8
- **Styling**: TailwindCSS 4, Framer Motion
- **Icons & UI**: Lucide React, Custom Glassmorphism UI
- **State & HTTP**: React Context API (`AuthContext`), Axios

### **Backend**
- **Runtime**: Node.js (v22+) & Express 5
- **Database**: MongoDB Atlas / Local Mongoose
- **Vector Store & RAG**: LanceDB (`@lancedb/lancedb`), Google Generative AI Embeddings (`@google/genai`)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **File Processing**: Multer, `pdf-parse`, `mammoth`, `csv-parser`

### **AI Services**
- **Primary Model**: Groq API (`llama-3.3-70b-versatile`)
- **Fallback Model**: Google Gemini API (`gemini-2.0-flash`)

---

## 📁 Project Structure

```
BizMind-AI/
├── backend/
│   ├── config/             # Database connection setup
│   ├── controllers/        # Auth, Business Plan, & RAG controllers
│   ├── middleware/         # JWT Auth & Upload middleware
│   ├── models/             # Mongoose schemas (User, BusinessPlan, Document)
│   ├── rag/                # RAG service, vector store & embeddings
│   ├── routes/             # Express API routes
│   ├── services/           # Groq & Gemini AI service integrations
│   ├── .env.example        # Environment variable template
│   ├── package.json
│   └── server.js           # Server entry point
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Sidebar, Icons, & shared components
│   │   ├── context/        # AuthContext for session management
│   │   ├── pages/          # Dashboard, Generator, Plan Detail, Knowledge Base, Settings, Contact
│   │   ├── services/       # Axios API client & services
│   │   ├── App.jsx         # React router setup
│   │   ├── index.css       # Custom CSS & Glassmorphism design tokens
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- [Groq API Key](https://console.groq.com/) & [Google Gemini API Key](https://aistudio.google.com/)

---

### **1. Clone the Repository**
```bash
git clone https://github.com/Louhichi-Youssef/BizMind-AI.git
cd BizMind-AI
```

---

### **2. Backend Setup**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder (or copy from `.env.example`):
```env
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bizmind

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# AI API Keys
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# RAG Configuration
VECTOR_STORE_PROVIDER=lance
EMBEDDING_PROVIDER=gemini
```

Start the backend server:
```bash
node server.js
```
*Server will run at `http://localhost:5000`*

---

### **3. Frontend Setup**
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend application will run at `http://localhost:5173`*

---

## 🌐 API Routes Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Register a new user account |
| `/api/auth/login` | `POST` | Authenticate user & issue JWT |
| `/api/auth/me` | `GET` | Fetch authenticated user profile |
| `/api/business-plans/generate` | `POST` | Trigger AI generation & RAG context injection |
| `/api/business-plans` | `GET` | Fetch user's saved business plans |
| `/api/business-plans/:id` | `GET` / `DELETE` | Retrieve or delete a specific business plan |
| `/api/rag/upload` | `POST` | Upload & index document into Vector Store |
| `/api/rag/documents` | `GET` | List user's uploaded knowledge base documents |

---

## 📸 Screenshots

*(Add application screenshots here)*

| Landing Page | Dashboard |
| :---: | :---: |
| ![Landing Page Placeholder](https://via.placeholder.com/600x350?text=BizMind+AI+Landing+Page) | ![Dashboard Placeholder](https://via.placeholder.com/600x350?text=BizMind+AI+Dashboard) |

| AI Business Plan Generator | Knowledge Base |
| :---: | :---: |
| ![Generator Placeholder](https://via.placeholder.com/600x350?text=AI+Plan+Generator) | ![Knowledge Base Placeholder](https://via.placeholder.com/600x350?text=Knowledge+Base+RAG) |

---

## 📝 License

Distributed under the **ISC License**.

---

## 👤 Author

**Youssef Louhichi**
- GitHub: [@Louhichi-Youssef](https://github.com/Louhichi-Youssef)
- LinkedIn: [Youssef Louhichi](https://linkedin.com/in/youssef-louhichi)
