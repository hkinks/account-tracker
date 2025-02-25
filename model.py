from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey, create_engine, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class BankTransaction(Base):
    __tablename__ = "bank_transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date, nullable=False)
    description = Column(String, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String, nullable=False, default='EUR', server_default='EUR')
    sender = Column(String, nullable=False)
    receiver = Column(String, nullable=False)

    __table_args__ = (UniqueConstraint('date', 'sender', 'receiver', 'description', 'amount', 'currency'),)