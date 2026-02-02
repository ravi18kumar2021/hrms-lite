import re
from django.core.exceptions import ValidationError

EMAIL_REGEX = r'[^@]+@[^@]+\.[^@]+'

def validate_email(email):
    if not re.match(EMAIL_REGEX, email):
        raise ValidationError('Invalid email format')