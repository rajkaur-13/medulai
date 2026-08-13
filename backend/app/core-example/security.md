
# Security - High-Level Architecture

> ⚠️ **Note**: This document describes the **security architecture and flow**.  
> The actual implementation is maintained in the **private repository**.

---

## 🎯 Purpose

The security module handles **authentication, authorization, and password management** for MedulAI.

---

## 🔄 Security Flow

┌─────────────────────────────────────────────────────────────────┐
│ User Login Request │
│ (email + password) │
└───────────────────────────┬─────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ 1. Password Verification │
│ │
│ • Hash the provided password │
│ • Compare with stored hash │
│ • Return success/failure │
└───────────────────────────┬─────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. JWT Token Generation │
│ │
│ • Create payload (user_id, role, etc.) │
│ • Sign with secret key │
│ • Set expiration time │
└───────────────────────────┬─────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Token Validation │
│ │
│ • Validate token on each request │
│ • Check expiration │
│ • Extract user information │
└─────────────────────────────────────────────────────────────────┘



---

## 🔧 Core Functions

| Function | Purpose |
|----------|---------|
| `verify_password()` | Compares plain password with hashed password |
| `get_password_hash()` | Creates a secure hash of the password |
| `create_access_token()` | Generates a JWT token for authenticated users |
| `decode_access_token()` | Validates and decodes a JWT token |

---

## 🔒 Security Features

| Feature | Description |
|---------|-------------|
| **Password Hashing** | Uses bcrypt for secure password storage |
| **JWT Tokens** | Stateless authentication with expiration |
| **Token Validation** | Verifies token integrity and expiration |
| **Secret Key** | JWT signing with secure secret key |

---

## 📦 Key Components

| Component | Purpose |
|-----------|---------|
| **bcrypt** | Password hashing (one-way encryption) |
| **JWT** | JSON Web Tokens for authentication |
| **Expiration** | Tokens expire after configured time |
| **Payload** | Contains user identity and claims |

---

## 🛠️ Technologies

- **passlib** - Password hashing (bcrypt)
- **python-jose** - JWT token creation and validation
- **datetime** - Token expiration management

---

📁 **Full implementation**: [`core/security.py`](https://github.com/rajkaur-13/mediagent-private)  
🔒 *This file is part of the private repository and contains proprietary security logic.*
