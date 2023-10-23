
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

import routers.invoices_router as invoices
from fastapi_pagination import add_pagination

app = FastAPI()
add_pagination(app)

app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'], allow_credentials=True)

app.include_router(invoices.router)
