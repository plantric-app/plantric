import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from utils.token import generate_invite_token
from flask import url_for

def send_invite_email(user, app):
    sender_email = os.getenv("SMTP_USER")
    receiver_email = user.email
    invite_token = generate_invite_token(user.id)
    with app.app_context():
        invite_link = url_for('user.handle_invite', token=invite_token, _external=True)
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
        <p>Hi {user.username},<br><br>
        You've been invited to join Plantric. Click below to complete your profile.<br><br>
        <a href="{invite_link}">Join Now</a>
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
        print("✅ Email sent to", user.email)
    except Exception as e:
        print("❌ Failed to send email:", e)
 