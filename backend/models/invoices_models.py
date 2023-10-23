from sqlalchemy import Column, Integer, String, Date
import database.database as db

class Invoice(db.Base):
    __tablename__ = 'invoices'
    name = Column(String)
    governmentId = Column(Integer)
    email = Column(String)
    debtAmount = Column(Integer)
    debtDueDate = Column(Date)
    debtId = Column(String)
    id = Column(Integer, primary_key=True,autoincrement=True)

