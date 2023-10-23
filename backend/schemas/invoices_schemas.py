from pydantic import BaseModel
from datetime import datetime


class InvoiceBase(BaseModel):
    name: str
    governmentId: int
    email: str
    debtAmount: int
    debtDueDate: datetime
    debtId: str


class Invoice(InvoiceBase):
    pass

    class Config:
        from_attributes = True


class InvoiceCreate(InvoiceBase):
    pass
