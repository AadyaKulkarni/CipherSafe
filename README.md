
# CipherSafe 🔐

**A Cryptography-Based Security Application**

CipherSafe is a web-based security application designed to protect sensitive information using encryption and decryption. It provides functionality for encrypting and decrypting files and messages, alongside user registration and login.

## Features

- **User Registration:** Create an account using a username, email address, and password.
- **User Login:** Authenticate users through the backend API.
- **Secure Password Storage:** Store password hashes using Argon2 rather than storing plaintext passwords.
- **File Encryption:** Encrypt files and download the encrypted output.
- **File Decryption:** Decrypt encrypted files and download the resulting output.
- **Message Encryption:** Encrypt text messages.
- **Message Decryption:** Decrypt previously encrypted messages.
- **Database Integration:** Store registered user information in an SQLite database.
- **REST API:** Use FastAPI endpoints for backend authentication and request handling.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML | Web page structure |
| CSS | User interface styling |
| JavaScript | Frontend functionality and cryptographic operations |
| Python | Backend implementation |
| FastAPI | REST API development |
| SQLite | User data storage |
| Argon2 | Password hashing |
| Uvicorn | ASGI server |

## Project Structure

```text
CipherSafe/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── requirements.txt
│   └── ciphersafe.db       # Created locally
├── index.html
├── register.html
├── dashboard.html
├── file.html
├── file-decrypt.html
├── message.html
├── decrypt.html
├── crypto.js
├── login.js
├── register.js
├── style.css
├── .gitignore
└── README.md
```

The SQLite database and Python virtual environment are generated locally and should not be committed to GitHub.

## Requirements

- Python 3.10 or a compatible supported Python version
- Visual Studio Code or another code editor
- A modern web browser
- VS Code Live Server extension, or an equivalent local frontend server

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/AadyaKulkarni/CipherSafe.git
cd CipherSafe
```

### 2. Set up the Python backend

Open a terminal in the project directory and navigate to the backend:

```powershell
cd backend
```

Create a virtual environment:

```powershell
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the dependencies:

```powershell
python -m pip install -r requirements.txt
```

### 3. Start the backend server

From the `backend` directory, run:

```powershell
python -m uvicorn main:app --reload
```

The backend should be available at:

`http://127.0.0.1:8000`

Interactive API documentation is available at:

`http://127.0.0.1:8000/docs`

### 4. Start the frontend

Open the project root folder in Visual Studio Code.

Use Live Server to open `index.html`. The development configuration expects the frontend to run at either:

- `http://127.0.0.1:5500`
- `http://localhost:5500`

Keep the backend and frontend servers running while using the application.

## API Endpoints

The backend currently provides the following endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Root endpoint |
| GET | `/health` | Health check |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Verify login credentials |
| POST | `/api/messages/validate` | Validate a declared encryption algorithm |

The message validation endpoint validates the declared algorithm; it should not be treated as proof that a message's cryptographic contents are valid.

## Database

CipherSafe uses SQLite to store registered user records.

The database file is created locally at:

`backend/ciphersafe.db`

The users table contains fields for:

- User ID
- Username
- Email address
- Password hash
- Account creation timestamp

Username and email addresses must be unique. Passwords are hashed using Argon2 before storage.

## Testing

The following functional checks have been performed during development:

- User registration
- Successful login with valid credentials
- Rejection of invalid login credentials
- Rejection of duplicate registrations
- Verification of registered records