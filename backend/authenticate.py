from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from passlib.hash import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from fastapi.middleware.cors import CORSMiddleware

# Constants for JWT
SECRET_KEY = "SKL242AE2O24IRU"
ALGORITHM = "HS256"

# Database setup
DATABASE_URL = "mysql+mysqlconnector://root:<your_password>@localhost/ecom_web"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI instance
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLAlchemy user model
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

# Create database tables
Base.metadata.create_all(bind=engine)

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Models for API requests
class RegisterUser(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginUser(BaseModel):
    email: EmailStr
    password: str

# Hash a password using bcrypt
def hash_password(password: str) -> str:
    return bcrypt.hash(password)

# Verify a password using bcrypt
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.verify(plain_password, hashed_password)

# Generate JWT token
def create_jwt_token(user_id: int):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=2)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# Registration endpoint
@app.post("/register")
async def register(user: RegisterUser, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    # Hash the password
    hashed_password = hash_password(user.password)

    # Insert new user into database
    new_user = User(username=user.name, email=user.email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

# Login endpoint
@app.post("/login")
async def login(user: LoginUser, db: Session = Depends(get_db)):
    # Check if the user exists by email
    user_record = db.query(User).filter(User.email == user.email).first()
    if not user_record:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify the provided password
    if not verify_password(user.password, user_record.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generate a JWT token
    token = create_jwt_token(user_record.id)

    return {"message": "Login successful", "token": token, "username": user_record.username}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
