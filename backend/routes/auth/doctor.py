from fastapi import APIRouter, HTTPException, status, Depends, Body, Response, Cookie
from entities import Doctor
from db import SessionType
from sqlmodel import select, delete
from typing import List, Annotated, Dict
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel, Field
from datetime import datetime, timedelta, timezone
import jwt
from jwt.exceptions import PyJWTError, InvalidTokenError


router = APIRouter(
  prefix='/auth/doctor',
  tags=['auth']
)

SECRET_KEY="secret"
ALGORITHM="HS256"

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

class SigninDoctorRequest(BaseModel):
  email: str
  password: str 

class SignupDoctorRequest(BaseModel):
  name: str
  email: str
  password: str
  specialization: str

class Token(BaseModel):
  access_token: str
  token_type: str

class DoctorResponse(BaseModel):
  name: str
  email: str
  password: str
  specialization: str
   

def create_access_token(email: str, doctor_id: int, expires_delta: timedelta):
  payload = {
    "id": doctor_id,
    "email": email
  }
  expires = datetime.now(timezone.utc) + expires_delta
  payload.update({'exp': expires})
  return jwt.encode(payload=payload, key=SECRET_KEY, algorithm=ALGORITHM)


def process_signin(doctor: Dict = Body(...)):
    # Perform additional processing or validation
    # doctor.update({"isValid", False})
    doctor['is'] = False
    print(type(doctor))
    return doctor



@router.post('/signin')
async def signin(doctor: Annotated[Dict, Depends(process_signin)], session: SessionType, response: Response):
  user: Doctor = session.exec(select(Doctor).where(Doctor.email == doctor["email"])).first()
  if not user:
    raise HTTPException(status.HTTP_404_NOT_FOUND, { "message": "User not found" })
  if not bcrypt_context.verify(doctor["password"], user.password):
    raise HTTPException(status.HTTP_401_UNAUTHORIZED, { "message": "Invalid password" })
  token = create_access_token(user.email, user.id, timedelta(minutes=30))
  
  # TODO: need to fix set cookie
  response.set_cookie(
     path="/",
     key="token",
     value=token,
     httponly=True,
    #  secure=True,
     samesite="none",
     expires= datetime.now(timezone.utc) + timedelta(minutes=30)
  )
  response =  JSONResponse(
    content={"access_token": token, "token_type": "Bearer"},
    status_code=200
  )
  return response



@router.post('/signup', status_code=status.HTTP_201_CREATED)
async def signup(doctor: SignupDoctorRequest, session: SessionType):
  doctorFromDB = session.exec(select(Doctor).where(Doctor.email == doctor.email)).first()

  if doctorFromDB is not None:
    raise HTTPException(
      status.HTTP_400_BAD_REQUEST,
      {
        "message": "Email already registered."
      }
    )

  newDoctor = Doctor(
    name=doctor.name,
    email=doctor.email,
    password=bcrypt_context.hash(doctor.password),
    specialization=doctor.specialization
  )
  session.add(newDoctor)
  session.commit()
  session.refresh(newDoctor)
  return newDoctor


@router.get('/signout')
def signout(session: SessionType):
  pass

def get_current_doctor(token: Annotated[str, Depends(oauth2_bearer)], session: SessionType):
  credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
  )
  try:
      payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
      email = payload.get("email")
      if email is None:
          raise credentials_exception
  except InvalidTokenError:
      raise credentials_exception
  doctor = session.exec(select(Doctor).where(Doctor.email == email)).first()
  if doctor is None:
      raise credentials_exception
  return doctor

@router.get('/me')
def get_me(doctor: Annotated[Doctor, Depends(get_current_doctor)], access_token: Annotated[str | None, Cookie()] = None):
  print(access_token)
  return JSONResponse(
     {
        "data": doctor.model_dump(exclude={"password"}),
        "message": f"doctor details fetched success",
        "cookie": access_token
     },
     status.HTTP_200_OK,
  )

@router.get('/all', status_code=status.HTTP_200_OK)
def get_me(session: SessionType):
  doctors = session.exec(select(Doctor)).all()
  return JSONResponse(
      content={
          "message": "fetch success",
          "data": [doc.model_dump() for doc in doctors]
      },
      status_code=202
  )