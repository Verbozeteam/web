from django.core.mail import send_mail

def send_contact_us_email(name, email, hotel, role, additional_info):
    subject = 'Message from {}'.format(name)
    message = 'Reach out to {}, {} at {}, through {}. Additional Info: {}'.format(name, role, hotel, email, additional_info)

    send_mail(
        subject,
        message,
        'contact@verboze.com',
        ['contact@verboze.com'],
        fail_silently=False,
    )
