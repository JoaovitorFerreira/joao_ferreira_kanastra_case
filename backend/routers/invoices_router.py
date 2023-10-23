from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, BackgroundTasks, WebSocket
from sqlalchemy.orm import Session
from fastapi_pagination import Page
from database.database import engine, get_db
import services.invoices_services as service
import models.invoices_models as model
import schemas.invoices_schemas as schema

model.db.Base.metadata.create_all(bind=engine)


router = APIRouter(
    prefix="/files",
    tags=["Files"],
    responses={404: {"description": "Not found"}},
)


@router.post("/")
def upload_bulk_file(file_upload: UploadFile, backgroundTask: BackgroundTasks, db: Session = Depends(get_db)):
    try:
        backgroundTask.add_task(
            service.create_bulk_invoices, db, file_upload)
        backgroundTask.add_task(service.check_mailer, db)
    except Exception as e:
        print(e)
    return {"message": 'file received'}


@router.get("/")
def get_all_files(db: Session = Depends(get_db)) -> Page[schema.Invoice]:
    data = service.get_invoices(db)
    return data


@router.get('/{invoice_month}')
def get_all_files_by_month(invoice_month=str, db: Session = Depends(get_db)):
    data = service.get_invoices_by_month(
        db, datetime.strptime(invoice_month, '%Y-%m-%d'))
    return data
