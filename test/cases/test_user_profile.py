
# Copyright IBM Corp, All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#
import unittest
from flask_testing import TestCase
import sys
import os
import logging
import json
from faker import Factory
fake = Factory.create()

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'src'))
from dashboard import app
from common import log_handler, LOG_LEVEL
from modules.models import COMMON_USER

logger = logging.getLogger(__name__)
logger.setLevel(LOG_LEVEL)
logger.addHandler(log_handler)


class UserProfileTest(TestCase):
    def create_app(self):
        app.config['TESTING'] = True
        app.config['LOGIN_DISABLED'] = False
        return app

    def _login(self, username, password):
        return self.client.post('/api/auth/login',
                                data=dict(
                                    username=username,
                                    password=password
                                ),
                                follow_redirects=True)

    def test_user_profile(self):
        self._login("admin", "pass")
        user_name = fake.user_name()
        password = fake.password()
        raw_response = self.client.post("/api/user/create",
                                        data=dict(
                                            username=user_name,
                                            password=password,
                                            active=True,
                                            role=COMMON_USER
                                        ))
        response = raw_response.data.decode("utf-8")
        response = json.loads(response)
        user_id = response.get("id", "")

        response = self.client.get("/api/user/profile/%s" % user_id)
        response = response.data.decode("utf-8")
        response = json.loads(response)
        self.assertTrue(response.get("success", False))

        name = fake.name()
        email = fake.email()
        url = fake.url()
        location = fake.address()
        bio = fake.company()

        self.client.put("/api/user/profile/%s" % user_id, data=dict(
            name=name,
            email=email,
            url=url,
            bio=bio,
            location=location
        ))
        response = self.client.get("/api/user/profile/%s" % user_id)
        response = response.data.decode("utf-8")
        response = json.loads(response)
        result = response.get("result", {})
        self.assertEqual(result.get("name", ""), name)
        self.assertEqual(result.get("email", ""), email)
        self.assertEqual(result.get("bio", ""), bio)
        self.assertEqual(result.get("url", ""), url)
        self.assertEqual(result.get("location", ""), location)

        self.client.delete("/api/user/delete/%s" % user_id)
