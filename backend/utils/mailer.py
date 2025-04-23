import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def send_invite_email(email, name):
    sender_email = os.getenv("SMTP_USER")
    receiver_email = email
    password = os.getenv("SMTP_PASS")
    smtp_host = os.getenv("SMTP_HOST", "mail.hackstation.online")
    smtp_port = int(os.getenv("SMTP_PORT", "465"))

    message = MIMEMultipart("alternative")
    message["Subject"] = "You're Invited to Plantric 🎉"
    message["From"] = sender_email
    message["To"] = receiver_email

    html = f"""
    <html>
    <body>
        <p>Hi {name},<br><br>
        You've been invited to join Plantric. Click below to complete your profile.<br><br>
        <a href="https://plantric.com/invite">Join Now</a>
        </p>
    </body>
    </html>
    """
    part = MIMEText(html, "html")
    message.attach(part)

    try:
        with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
        print("✅ Email sent to", email)
    except Exception as e:
        print("❌ Failed to send email:", e)
 