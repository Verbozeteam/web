from rest_framework.test import APITestCase
import json

from api.models import *

class TestTokenApi(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')

    def test_request_for_token_with_no_type(self):
        response = self.client.post('/api/tokens/', {
            'username': 'testuser',
            'password': '12345'
        })

        # assert a bad request status code returned
        self.assertEqual(response.status_code, 400)
        # assert correct error message returned
        self.assertEqual(response.data, {'error': 'No \'requested_token_type\' provided'})

    def test_request_for_token_with_invalid_type(self):
        response = self.client.post('/api/tokens/', {
            'username': 'testuser',
            'password': '12345',
            'requested_token_type': 'invalid_type'
        })

        # assert a bad request status code returned
        self.assertEqual(response.status_code, 400)
        # assert correct error message returned
        self.assertEqual(response.data, {'error': 'Invalid requested_token_type provided'})

    def test_request_for_anonymous_user_token(self):
        response = self.client.post('/api/tokens/', {
            'username': 'testuser',
            'password': '12345',
            'requested_token_type': 'anonymous_user'
        })

        # assert an ok status returned
        self.assertEqual(response.status_code, 200)
        # assert a token was created
        self.assertEqual(Token.objects.count(), 1)
        # assert token is an anonymous_user token
        self.assertEqual(Token.objects.last().content_object, None)

    def test_request_for_token_requiring_credentials_with_wrong_credentials(self):
        response = self.client.post('/api/tokens/', {
            'username': 'testuser',
            'password': 'wrongpassword',
            'requested_token_type': 'admin_user'
        })

        # assert unauthorized status code returned
        self.assertEqual(response.status_code, 401)
        # assert correct error message returned
        self.assertEqual(response.data, {'error': 'Incorrect username or password'})

    def test_request_for_admin_user_token_as_non_admin(self):
        response = self.client.post('/api/tokens/', {
            'username': 'testuser',
            'password': '12345',
            'requested_token_type': 'admin_user'
        })

        # assert a bad request status code returned
        self.assertEqual(response.status_code, 400)
        # assert correct error message returned
        self.assertEqual(response.data, {'error': 'You do not have permissions to request such token'})

    def test_request_for_admin_user_token_as_admin(self):
        self.admin_user = AdminUser(user=self.user)
        self.admin_user.save()
        response = self.client.post('/api/tokens/', {
            'username': 'testuser',
            'password': '12345',
            'requested_token_type': 'admin_user'
        })

        # assert a ok code status was retured
        self.assertEqual(response.status_code, 200)
        # assert a token was created
        self.assertEqual(Token.objects.count(), 1)
        # assert token is associated with admin user that requested it
        self.assertEqual(Token.objects.last().content_object, self.admin_user)

    def test_request_for_guest_user_token_as_non_guest(self):
        response = self.client.post('/api/tokens/', {
            'username': 'testuser',
            'password': '12345',
            'requested_token_type': 'guest_user'
        })

        # assert a bad request status code returned
        self.assertEqual(response.status_code, 400)
        # assert correct error message returned
        self.assertEqual(response.data, {'error': 'You do not have permissions to request such token'})

    def test_request_for_guest_user_token_as_guest(self):
        self.guest_user = GuestUser(user=self.user)
        self.guest_user.save()
        response = self.client.post('/api/tokens/', {
            'username': 'testuser',
            'password': '12345',
            'requested_token_type': 'guest_user'
        })

        # assert a ok code status was retured
        self.assertEqual(response.status_code, 200)
        # assert a token was created
        self.assertEqual(Token.objects.count(), 1)
        # assert token is associated with guest user that requested it
        self.assertEqual(Token.objects.last().content_object, self.guest_user)

    def test_request_for_hotel_user_token_as_non_hotel(self):
        response = self.client.post('/api/tokens/', {
            'username': 'testuser',
            'password': '12345',
            'requested_token_type': 'hotel_user'
        })

        # assert a bad request status code returned
        self.assertEqual(response.status_code, 400)
        # assert correct error message returned
        self.assertEqual(response.data, {'error': 'You do not have permissions to request such token'})

    def test_request_for_hotel_user_token_as_hotel(self):
        self.hotel = Hotel(name='Test Hotel')
        self.hotel.save()
        self.hotel_user = HotelUser(user=self.user, hotel=self.hotel)
        self.hotel_user.save()
        response = self.client.post('/api/tokens/', {
            'username': 'testuser',
            'password': '12345',
            'requested_token_type': 'hotel_user'
        })

        # assert a ok code status was retured
        self.assertEqual(response.status_code, 200)
        # assert a token was created
        self.assertEqual(Token.objects.count(), 1)
        # assert token is associated with hotel user that requested it
        self.assertEqual(Token.objects.last().content_object, self.hotel_user)

    def test_request_for_hub_user_token_as_non_hub(self):
        response = self.client.post('/api/tokens/', {
            'username': 'testuser',
            'password': '12345',
            'requested_token_type': 'hub_user'
        })

        # assert a bad request status code returned
        self.assertEqual(response.status_code, 400)
        # assert correct error message returned
        self.assertEqual(response.data, {'error': 'You do not have permissions to request such token'})

    def test_request_for_hub_user_token_as_hub(self):
        self.hotel = Hotel(name='Test Hotel')
        self.hotel.save()
        self.hub = Hub(hotel=self.hotel)
        self.hub.save()
        self.hub_user = HubUser(user=self.user, hub=self.hub)
        self.hub_user.save()
        response = self.client.post('/api/tokens/', {
            'username': 'testuser',
            'password': '12345',
            'requested_token_type': 'hub_user'
        })

        # assert a bad request status was retured
        self.assertEqual(response.status_code, 400)
        # assert correct error message shown
        self.assertEqual(response.data, {'error': 'Testa3bat yabni?'})

    def test_request_for_anonymous_token_from_logged_out_session(self):
        response = self.client.post('/api/tokens/', {
            'requested_token_type': 'anonymous_user'
        })

        # assert an ok status code returned
        self.assertEqual(response.status_code, 200)
        # assert a token was created
        self.assertEqual(Token.objects.count(), 1)
        # assert token is an anonymous_user token
        self.assertEqual(Token.objects.last().content_object, None)

    def test_request_for_anonymous_token_from_logged_in_session(self):
        self.client.login(username='testuser', password='12345')
        response = self.client.post('/api/tokens/', {
            'requested_token_type': 'anonymous_user'
        })

        # assert an ok status code returned
        self.assertEqual(response.status_code, 200)
        # assert a token was created
        self.assertEqual(Token.objects.count(), 1)
        # assert token is an anonymous_user token
        self.assertEqual(Token.objects.last().content_object, None)

    def test_request_for_admin_token_from_logged_out_session(self):
        response = self.client.post('/api/tokens/', {
            'requested_token_type': 'admin_user'
        })

        # assert a bad request status code returned
        self.assertEqual(response.status_code, 400)
        # assert correct error message shown
        self.assertEqual(response.data, {'error': 'No user credentials and session does not exist'})

    def test_request_for_admin_token_from_logged_in_non_admin_session(self):
        self.client.login(username='testuser', password='12345')

        response = self.client.post('/api/tokens/', {
            'requested_token_type': 'admin_user'
        })

        # assert a bad request status code returned
        self.assertEqual(response.status_code, 400)
        # assert correct error message shown
        self.assertEqual(response.data, {'error': 'You do not have permissions to request such token'})

    def test_request_for_admin_token_from_logged_in_admin_session(self):
        self.admin_user = AdminUser(user=self.user)
        self.admin_user.save()
        self.client.login(username='testuser', password='12345')

        response = self.client.post('/api/tokens/', {
            'requested_token_type': 'admin_user'
        })

        # assert an ok status code
        self.assertEqual(response.status_code, 200)
        # assert token was created
        self.assertEqual(Token.objects.count(), 1)
        # assert token is an admin token for user
        self.assertEqual(Token.objects.last().content_object, self.admin_user)

    def test_request_for_guest_token_from_logged_out_session(self):
        response = self.client.post('/api/tokens/', {
            'requested_token_type': 'guest_user'
        })

        # assert a bad request status code returned
        self.assertEqual(response.status_code, 400)
        # assert correct error message shown
        self.assertEqual(response.data, {'error': 'No user credentials and session does not exist'})

    def test_request_for_guest_token_from_logged_in_non_guest_session(self):
        self.client.login(username='testuser', password='12345')

        response = self.client.post('/api/tokens/', {
            'requested_token_type': 'guest_user'
        })

        # assert a bad request status code returned
        self.assertEqual(response.status_code, 400)
        # assert correct error message shown
        self.assertEqual(response.data, {'error': 'You do not have permissions to request such token'})

    def test_request_for_guest_token_from_logged_in_guest_session(self):
        self.guest_user = GuestUser(user=self.user)
        self.guest_user.save()
        self.client.login(username='testuser', password='12345')

        response = self.client.post('/api/tokens/', {
            'requested_token_type': 'guest_user'
        })

        # assert an ok status code
        self.assertEqual(response.status_code, 200)
        # assert token was created
        self.assertEqual(Token.objects.count(), 1)
        # assert token is an admin token for user
        self.assertEqual(Token.objects.last().content_object, self.guest_user)

    def test_request_for_hotel_token_from_logged_out_session(self):
        response = self.client.post('/api/tokens/', {
            'requested_token_type': 'hotel_user'
        })

        # assert a bad request status code returned
        self.assertEqual(response.status_code, 400)
        # assert correct error message shown
        self.assertEqual(response.data, {'error': 'No user credentials and session does not exist'})

    def test_request_for_hotel_token_from_logged_in_non_hotel_session(self):
        self.client.login(username='testuser', password='12345')

        response = self.client.post('/api/tokens/', {
            'requested_token_type': 'hotel_user'
        })

        # assert a bad request status code returned
        self.assertEqual(response.status_code, 400)
        # assert correct error message shown
        self.assertEqual(response.data, {'error': 'You do not have permissions to request such token'})

    def test_request_for_hotel_token_from_logged_in_hotel_session(self):
        self.hotel = Hotel(name='Test Hotel')
        self.hotel.save()
        self.hotel_user = HotelUser(user=self.user, hotel=self.hotel)
        self.hotel_user.save()
        self.client.login(username='testuser', password='12345')

        response = self.client.post('/api/tokens/', {
            'requested_token_type': 'hotel_user'
        })

        # assert an ok status code
        self.assertEqual(response.status_code, 200)
        # assert token was created
        self.assertEqual(Token.objects.count(), 1)
        # assert token is an admin token for user
        self.assertEqual(Token.objects.last().content_object, self.hotel_user)

    def test_request_for_hub_token_from_logged_out_session(self):
        response = self.client.post('/api/tokens/', {
            'requested_token_type': 'hub_user'
        })

        # assert a bad request status code returned
        self.assertEqual(response.status_code, 400)
        # assert correct error message shown
        self.assertEqual(response.data, {'error': 'No user credentials and session does not exist'})

    def test_request_for_hub_token_from_logged_in_non_hub_session(self):
        self.client.login(username='testuser', password='12345')

        response = self.client.post('/api/tokens/', {
            'requested_token_type': 'hub_user'
        })

        # assert a bad request status code returned
        self.assertEqual(response.status_code, 400)
        # assert correct error message shown
        self.assertEqual(response.data, {'error': 'You do not have permissions to request such token'})

    def test_request_for_hub_token_from_logged_in_hub_session(self):
        self.hotel = Hotel(name='Test Hotel')
        self.hotel.save()
        self.hub = Hub(hotel=self.hotel)
        self.hub.save()
        self.hub_user = HubUser(user=self.user, hub=self.hub)
        self.hub_user.save()
        self.client.login(username='testuser', password='12345')

        response = self.client.post('/api/tokens/', {
            'requested_token_type': 'hub_user'
        })

        # assert a bad request status code
        self.assertEqual(response.status_code, 400)
        # assert correct error message shown
        self.assertEqual(response.data, {'error': 'Testa3bat yabni?'})
