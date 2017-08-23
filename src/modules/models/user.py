import sys
import os
import datetime
from mongoengine import Document, StringField,\
    BooleanField, DateTimeField, IntField, \
    ReferenceField

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

ADMIN = 0
OPERATOR = 1
COMMON_USER = 2


class Profile(Document):
    name = StringField(default="")
    email = StringField(default="")
    bio = StringField(default="")
    organization = StringField(default="")
    url = StringField(default="")
    location = StringField(default="")


class User(Document):
    username = StringField(unique=True)
    password = StringField(default="")
    active = BooleanField(default=True)
    isAdmin = BooleanField(default=False)
    role = IntField(default=COMMON_USER)
    timestamp = DateTimeField(default=datetime.datetime.now)
    balance = IntField(default=0)
    profile = ReferenceField(Profile)


class LoginHistory(Document):
    time = DateTimeField(default=datetime.datetime.now)
    user = ReferenceField(User)
