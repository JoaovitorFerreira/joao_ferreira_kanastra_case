import asyncio
import smtplib
import os
import csv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from dotenv import load_dotenv

load_dotenv()

# Configuração
password_email = 'Kanastracase123_'
server = smtplib.SMTP(os.getenv('MAILER_HOST'), os.getenv('MAILER_PORT'))


def send_email_by_date(invoices_list):
    for month_invoice in invoices_list:
        create_invoice_email(month_invoice)


def create_invoice_email(invoice):
    try:
        message = 'Hello, your invoice has arrived! It is attached to this email.'
        email_msg = MIMEMultipart()
        email_msg['From'] = os.getenv('MAILER_USER')
        email_msg['To'] = invoice.email
        email_msg['Subject'] = 'Invoice payment'

        new_filename = invoice.name.replace(" ", "_")
        filename = f"{new_filename}.csv"
        email_msg.attach(MIMEText(message, 'plain'))

        if os.path.exists(f".\database\invoices_files\{filename}"):
            print('email already sent')
            return
        else:
            filepath = f".\database\invoices_files\{filename}"
            with open(file=filepath, mode='w', newline='') as file:
                writer = csv.writer(file, delimiter=',',
                                    quotechar='"', quoting=csv.QUOTE_MINIMAL)
                writer.writerow(['Name', 'GovernmentId', 'Email',
                                 'DebtAmount', 'DebtDueDate', 'DebtId'])
                writer.writerow([invoice.name, invoice.governmentId, invoice.email,
                                 invoice.debtAmount, invoice.debtDueDate, invoice.debtId])
                file.close()

            attachment = open(filepath, 'rb')

            att = MIMEBase('application', 'octet-stream')
            att.set_payload(attachment.read())
            encoders.encode_base64(att)
            att.add_header('Content-Disposition',
                           f'attachment; filename= {filename}')
            attachment.close()

            email_msg.attach(att)
            mailer(email_msg)
    except Exception as e:
        print(e)


def mailer(email_to_send):

    try:
        # Criando objeto
        server = smtplib.SMTP(os.getenv('MAILER_HOST'),
                              os.getenv('MAILER_PORT'))
        server.ehlo()
        server.starttls()
        server.login(os.getenv('MAILER_USER'), os.getenv('MAILER_PASSWORD'))

# Enviando mensagem
        server.sendmail(
            email_to_send['From'], email_to_send['To'], email_to_send.as_string())
        server.quit()
    except Exception as e:
        print(e)
