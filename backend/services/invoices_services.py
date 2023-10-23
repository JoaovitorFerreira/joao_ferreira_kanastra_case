import io
from fastapi import File, UploadFile, Depends
from sqlalchemy.orm import Session
from sqlalchemy import extract
import pandas as pd
import concurrent.futures

from datetime import datetime

import schemas.invoices_schemas as schemas
import models.invoices_models as models
import workers.sent_email_worker as mailer

from fastapi_pagination import paginate


def get_invoices_by_email(db: Session, email: str):
    return db.query(models.Invoice).filter(models.Invoice.email == email).first()


def get_invoices(db: Session):
    return paginate(db.query(models.Invoice).order_by(models.Invoice.debtDueDate.desc()).all())


def get_invoices_by_month(db: Session, date: datetime = datetime.today()):
    return db.query(models.Invoice).filter(extract('month', models.Invoice.debtDueDate) == date.month).all()


def create_invoice(db: Session, invoice: schemas.InvoiceCreate):
    db_invoice = models.Invoice(email=invoice.email, name=invoice.name,
                                governmentId=invoice.governmentId, debtAmount=invoice.debtAmount,
                                debtDueDate=invoice.debtDueDate, debtId=invoice.debtId)
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice


def create_bulk_invoices(db: Session, file: UploadFile = File(...)):
    num_threads = 20
    try:
        dados = io.BytesIO(file.file.read())
        csv_data_list = pd.read_csv(dados, delimiter=',',
                                    encoding='utf-8').values.tolist()
        with concurrent.futures.ThreadPoolExecutor(max_workers=num_threads) as executor:
            futures = [executor.submit(read_csv_data, document)
                       for document in csv_data_list]
            for future in concurrent.futures.as_completed(futures):
                result = future.result()
                db.add(result)

        db.commit()
        dados.close()
    except Exception as e:
        db.rollback()
        print(e)
    finally:
        db.close()


def check_mailer(db: Session):
    invoices_list = get_invoices_by_month(db)
    mailer.send_email_by_date(invoices_list)


def read_csv_data(fileData):
    data_invoice = schemas.Invoice(**{'name': fileData[0], 'governmentId': fileData[1], 'email': fileData[2],
                                      'debtAmount': fileData[3], 'debtDueDate': datetime.strptime(fileData[4], '%Y-%m-%d').date(), 'debtId': fileData[5]})

    return (models.Invoice(**{'name': data_invoice.name, 'governmentId': data_invoice.governmentId, 'email': data_invoice.email,
                              'debtAmount': data_invoice.debtAmount, 'debtDueDate': data_invoice.debtDueDate, 'debtId': data_invoice.debtId}))
