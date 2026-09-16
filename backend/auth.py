import os
import sqlite3
import secrets
import hashlib
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
from pwdlib import PasswordHash


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ============================================================
# DATABASE
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

DB_PATH = os.path.join(BASE_DIR, "auth.db")

password_hash = PasswordHash.recommended()


def get_db():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_auth_database():
    connection = get_db()
    cursor = connection.cursor()

    # Users table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )

    # Password reset table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            token_hash TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            used INTEGER DEFAULT 0
        )
        """
    )

    connection.commit()
    connection.close()


# ============================================================
# REQUEST MODELS
# ============================================================

class SignupRequest(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=6)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=6)


# ============================================================
# SIGNUP
# ============================================================

@router.post("/signup")
def signup(request: SignupRequest):

    connection = get_db()
    cursor = connection.cursor()

    name = request.name.strip()
    email = request.email.lower().strip()

    # Check if email already exists
    cursor.execute(
        "SELECT id FROM users WHERE email = ?",
        (email,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        connection.close()

        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists."
        )

    # Hash password
    hashed_password = password_hash.hash(
        request.password
    )

    # Insert user
    cursor.execute(
        """
        INSERT INTO users
        (name, email, password_hash, created_at)
        VALUES (?, ?, ?, ?)
        """,
        (
            name,
            email,
            hashed_password,
            datetime.now(timezone.utc).isoformat()
        )
    )

    connection.commit()
    connection.close()

    return {
        "message": "Account created successfully.",
        "name": name,
        "email": email
    }


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login(request: LoginRequest):

    connection = get_db()
    cursor = connection.cursor()

    email = request.email.lower().strip()

    cursor.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    )

    user = cursor.fetchone()

    connection.close()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    # Verify password against stored hash
    if not password_hash.verify(
        request.password,
        user["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    return {
        "message": "Login successful.",
        "email": user["email"],
        "name": user["name"]
    }


# ============================================================
# FORGOT PASSWORD
# ============================================================

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest
):

    connection = get_db()
    cursor = connection.cursor()

    email = request.email.lower().strip()

    cursor.execute(
        "SELECT id FROM users WHERE email = ?",
        (email,)
    )

    user = cursor.fetchone()

    if not user:
        connection.close()

        return {
            "message":
            "If this email exists, a reset link has been generated."
        }

    raw_token = secrets.token_urlsafe(32)

    token_hash = hashlib.sha256(
        raw_token.encode()
    ).hexdigest()

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(minutes=15)
    ).isoformat()

    cursor.execute(
        """
        INSERT INTO password_reset_tokens
        (email, token_hash, expires_at, used)
        VALUES (?, ?, ?, 0)
        """,
        (
            email,
            token_hash,
            expires_at
        )
    )

    connection.commit()
    connection.close()

    reset_link = (
        "http://localhost:3000/"
        f"reset-password?token={raw_token}"
    )

    print("\nPASSWORD RESET LINK:")
    print(reset_link)
    print()

    return {
        "message":
        "Reset link generated. Check the backend terminal.",
        "reset_link": reset_link
    }


# ============================================================
# RESET PASSWORD
# ============================================================

@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest
):

    connection = get_db()
    cursor = connection.cursor()

    token_hash = hashlib.sha256(
        request.token.encode()
    ).hexdigest()

    cursor.execute(
        """
        SELECT * FROM password_reset_tokens
        WHERE token_hash = ?
        AND used = 0
        """,
        (token_hash,)
    )

    reset_record = cursor.fetchone()

    if not reset_record:
        connection.close()

        raise HTTPException(
            status_code=400,
            detail="Invalid or already-used reset token."
        )

    expires_at = datetime.fromisoformat(
        reset_record["expires_at"]
    )

    if datetime.now(timezone.utc) > expires_at:
        connection.close()

        raise HTTPException(
            status_code=400,
            detail="This reset link has expired."
        )

    new_password_hash = password_hash.hash(
        request.new_password
    )

    cursor.execute(
        """
        UPDATE users
        SET password_hash = ?
        WHERE email = ?
        """,
        (
            new_password_hash,
            reset_record["email"]
        )
    )

    cursor.execute(
        """
        UPDATE password_reset_tokens
        SET used = 1
        WHERE id = ?
        """,
        (reset_record["id"],)
    )

    connection.commit()
    connection.close()

    return {
        "message": "Password reset successfully."
    }