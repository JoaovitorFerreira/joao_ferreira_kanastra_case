# README

## BACKEND

### Deploy
To start the backend application, you need to enter in your virtual env and run the following command:

> pip install -r requirements.txt

After the installation, run the command

> uvicorn main:app --reload

Its necessary to create a .env file with the following data:
MAILER_HOST = 'smtp.gmail.com'
MAILER_PORT = 587
MAILER_USER = 'your email'
MAILER_PASSWORD = 'your gmail app password'

If its needed an email and password, let me know, I've created one for this project.

### How it works

The application is divided into modules, as we can see in the routers folder.
All modules have their services, schemas and models.

We have as well a shared utils, in this case, the mailer.

In this case we only have invoices module, so I will talk about its endpoints:

> post("/"), 
its purpose is to insert the files into the sqlite database, for this it uses a multithread strategy and returns a message as soon as it finishes downloading the file.
It calls two functions that run without the need for interaction with the front end, the first to process the files and the second to validate the files and create invoice collection emails.

> get("/"),
return all os the data in the database, using a paginated strategy

> get('/{invoice_month}')
returns all invoices for the month in question, the idea here was to create a screen to control payments that have already occurred, in addition to allowing emails to be resent.

### Improvements
With more time, I would like to transform the mailer into a system for sending emails, receiving messages notifying me of new data in the database.
I would also change the get endpoint to a websocket or use long pooling to gradually feed the data table.
It is also necessary to migrate to add http exceptions for all endpoints, as well as a description of how they work.
Unit tests are necessary for the evolution of the project, as well as new endpoints for data analysis.

## FRONTEND

### Deploy
To start this application, you need to enter the following command:
> npm i

After the installation, enter this one:
> npm run dev 

### How it works

The first page, File List, you can see all the invoices in the database.
The second page, File Upload, you can upload your files to the database.

I made some adjustments regarding system responses, so that the user understands what the system is processing.
It is possible to see loadings, toasts with warnings and error and success messages, when necessary.

### Improvements

I would add unit tests, add a screen to control paid and unpaid invoices, as well as a screen to analyze the data collected. I would also create a button to allow the user to resend emails if necessary.
Regarding the use of .env in this application, unfortunately I didn't have time to migrate the variables into it.