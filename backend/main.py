from database import initialize_database
from fastapi import FastAPI
from contextlib import asynccontextmanager

import sqlite3

from argon2 import PasswordHasher
from argon2.exceptions import HashingError
from fastapi import HTTPException
from pydantic import BaseModel, EmailStr, Field

from database import get_connection


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()
    yield


app = FastAPI(
    title="CipherSafe API",
    description="Backend API for the CipherSafe security application",
    version="1.0.0",
    lifespan=lifespan,
)

@app.get("/")
def home():
    return {
        "message": "Welcome to CipherSafe!",
        "status": "Backend is running",
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}




from pydantic import BaseModel, Field


class EncryptedMessage(BaseModel):
    algorithm: str
    keyDerivation: str
    iterations: int = Field(gt=0)
    salt: str
    iv: str
    data: str


@app.post("/api/messages/validate")
def validate_encrypted_message(message: EncryptedMessage):
    if message.algorithm != "AES-256-GCM":
        from fastapi import HTTPException
        raise HTTPException(
            status_code=400,
            detail="Unsupported encryption algorithm",
        )

    return {
        "valid": True,
        "message": "Encrypted message package received",
        "algorithm": message.algorithm,
    }



password_hasher = PasswordHasher()


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


@app.post("/api/auth/register", status_code=201)
def register_user(user: RegisterRequest):
    password_hash = password_hasher.hash(user.password)
    connection = get_connection()

    try:
        connection.execute(
            """
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
            """,
            (user.username, str(user.email), password_hash),
        )
        connection.commit()

        return {
            "message": "User registered successfully",
            "username": user.username,
            "email": str(user.email),
        }

    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="Username or email already exists",
        )

    finally:
        connection.close()


