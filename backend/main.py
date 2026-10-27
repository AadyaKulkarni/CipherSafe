from database import initialize_database
from fastapi import FastAPI

@app.on_event("startup")
def startup():
    initialize_database()

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

