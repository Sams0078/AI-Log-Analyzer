# AI Log Analyzer

AI Log Analyzer is an AI-powered observability project that converts raw server and application logs into useful insights such as anomalies, incidents, similar historical issues, and AI-generated root-cause guidance.

> This project does not fix problems automatically. It helps developers identify the possible problem, understand its cause, and decide what to investigate or fix.

## Features

- Upload LOG, TXT, and JSON files
- Parse and normalize log data
- Store logs in PostgreSQL
- Detect unusual logs using Machine Learning
- Group related errors into incidents
- Search historical similar logs using FAISS
- Generate root-cause explanations using Qwen3 4B
- Display logs, anomalies, incidents, metrics, and AI analysis on a dashboard

## Architecture

```text
Log File
   ↓
Parser and Normalization
   ↓
PostgreSQL Database
   ↓
Feature Engineering
   ↓
Isolation Forest Anomaly Detection
   ↓
K-Means Incident Grouping
   ↓
FAISS Similarity Search
   ↓
Qwen3 4B through Ollama
   ↓
React Dashboard
```

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS, Axios, Lucide React, Recharts |
| Backend | Python, FastAPI, Uvicorn, Pydantic |
| Database | PostgreSQL, SQLAlchemy |
| ML Libraries | Pandas, NumPy, Scikit-learn |
| ML Models | Isolation Forest, K-Means |
| Similarity Search | FAISS, Sentence Transformers |
| Local AI | Qwen3 4B, Ollama |

## ML and AI Working

### Isolation Forest

Used for anomaly detection. It identifies unusual log behavior such as high API response time, high CPU or memory usage, increased error rate, and repeated database connection failures.

### K-Means Clustering

Used for grouping similar anomalies into incidents. For example, API timeout, database failure, and high latency can be grouped into one incident:

```text
API and Database Performance Degradation
```

### FAISS

Used to search similar historical logs or past incidents. This gives additional evidence for the current issue.

### Qwen3 4B

Qwen3 is a local AI model running through Ollama. It reads incident details and similar historical logs, then explains the likely root cause, evidence, system impact, and recommended action.

## Prerequisites

- Python 3.10 or above
- Node.js 18 or above
- PostgreSQL
- Ollama
- Qwen3 4B model

## Environment Variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_log_analyzer
DB_USER=postgres
DB_PASSWORD=your_postgres_password

ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password
ADMIN_JWT_SECRET=your_long_random_secret

OLLAMA_URL=http://localhost:11434/api/generate
```

## Run the Project

### 1. Start PostgreSQL

Create the database:

```sql
CREATE DATABASE ai_log_analyzer;
```

### 2. Start Qwen3 AI

```powershell
ollama pull qwen3:4b
ollama run qwen3:4b
```

If Ollama service is not running:

```powershell
ollama serve
```

### 3. Start Backend

```powershell
cd "C:\Users\Sanya\AI log analyzer"
.venv\Scripts\Activate.ps1
uvicorn backend.main:app --reload --port 8001
```

Backend API documentation:

```text
http://127.0.0.1:8001/docs
```

### 4. Start Frontend

Open another terminal:

```powershell
cd "C:\Users\Sanya\AI log analyzer\frontend"
npm install
npm run dev
```

Open in browser:

```text
http://localhost:5173
```

## Important API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Checks API status |
| GET | `/logs/` | Gets all stored logs |
| POST | `/logs/upload` | Uploads a log file |
| GET | `/analysis/` | Runs log analysis and returns incidents |
| POST | `/analysis/ai` | Generates AI analysis for an incident |
| POST | `/admin/login` | Admin login |
| POST | `/admin/systems` | Registers a connected system |

## Example API Commands

Check backend health:

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8001/health"
```

Get analysis:

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8001/analysis/"
```

Upload a log file:

```powershell
curl.exe -X POST "http://127.0.0.1:8001/logs/upload" -F "file=@C:\path\to\server.log"
```

## Conclusion

AI Log Analyzer helps developers and DevOps teams analyze large log files quickly. It detects anomalies, creates incidents, finds similar historical issues, and gives AI-based suggestions for investigation. The final decision and actual problem fix are performed by the developer.
