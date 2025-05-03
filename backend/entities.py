from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class Doctor(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True,)
    name: str
    email: str = Field(index=True, nullable=False, unique=True)
    password: str
    specialization: str


class Patient(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    age: int
    gender: str
    contact: str
    email: str = Field(index=True, nullable=False, unique=True)
    reports: List["Report"] = Relationship(back_populates="patient")

class Report(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patient.id")
    diagnosis: str
    treatment: str
    date_created: datetime = Field(default_factory=datetime.utcnow)

    patient: Optional[Patient] = Relationship(back_populates="reports")
