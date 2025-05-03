from sqlmodel import SQLModel, create_engine, Session 
from fastapi import Depends
from typing import Annotated

engine = create_engine("sqlite:///database.db")

def create_db_and_table():
  SQLModel.metadata.create_all(engine)

def get_session():
  with Session(engine) as session:
    yield session

SessionType = Annotated[Session, Depends(get_session)]