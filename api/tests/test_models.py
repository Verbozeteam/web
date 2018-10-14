from django.test import TestCase

from api.models import *

# @TODO: Add tests for rest of Models in API

class TestUserModel(TestCase):
    def setUp(self):
        self.user = User()
        self.user.save()
        self.admin_user = AdminUser(user=self.user)
        self.guest_user = GuestUser(user=self.user)
        self.hotel_user = HotelUser(user=self.user)
        self.hub_user = HubUser(user=self.user)

    def test_user_creation(self):
        self.assertEqual(User.objects.count(), 1)

    def test_user_is_admin(self):
        self.assertTrue('admin_user' in self.user.types)

    def test_user_is_guest(self):
        self.assertTrue('guest_user' in self.user.types)

    def test_user_is_hotel(self):
        self.assertTrue('hotel_user' in self.user.types)

    def test_user_is_hub(self):
        self.assertTrue('hub_user' in self.user.types)

class TestAdminUserModel(TestCase):
    def setUp(self):
        self.user = User()
        self.user.save()
        self.admin_user = AdminUser(user=self.user)
        self.admin_user.save()

    def test_admin_user_creation(self):
        self.assertEqual(AdminUser.objects.count(), 1)
        self.assertTrue(hasattr(AdminUser.objects.first(), 'user'))
        self.assertEqual(AdminUser.objects.first().user, self.user)

    def test_user_points_to_admin_user(self):
        self.assertTrue(hasattr(self.user, 'admin_user'))
        self.assertEqual(self.user.admin_user, self.admin_user)

    def test_websocket_group(self):
        self.assertEqual('admin-{}'.format(self.admin_user.id), self.admin_user.websocket_group)

class TestGuestUserModel(TestCase):
    def setUp(self):
        self.user = User()
        self.user.save()
        self.guest_user = GuestUser(user=self.user)
        self.guest_user.save()

    def test_guest_user_creation(self):
        self.assertEqual(GuestUser.objects.count(), 1)
        self.assertTrue(hasattr(GuestUser.objects.first(), 'user'))
        self.assertEqual(GuestUser.objects.first().user, self.user)

    def test_user_points_to_guest_user(self):
        self.assertTrue(hasattr(self.user, 'guest_user'))
        self.assertEqual(self.user.guest_user, self.guest_user)

    def test_websocket_group(self):
        self.assertEqual('guest-{}'.format(self.guest_user.id), self.guest_user.websocket_group)

class TestHotelUserModel(TestCase):
    def setUp(self):
        self.user = User()
        self.user.save()
        self.hotel = Hotel(name='Test Hotel')
        self.hotel.save()
        self.hotel_user = HotelUser(user=self.user, hotel=self.hotel)
        self.hotel_user.save()

    def test_hotel_user_creation(self):
        self.assertEqual(HotelUser.objects.count(), 1)
        self.assertTrue(hasattr(HotelUser.objects.first(), 'user'))
        self.assertEqual(HotelUser.objects.first().user, self.user)
        self.assertTrue(hasattr(HotelUser.objects.first(), 'hotel'))
        self.assertEqual(HotelUser.objects.first().hotel, self.hotel)

    def test_user_points_to_hotel_user(self):
        self.assertTrue(hasattr(self.user, 'hotel_user'))
        self.assertEqual(self.user.hotel_user, self.hotel_user)

    def test_websocket_group(self):
        self.assertEqual('hotel-{}'.format(self.hotel_user.hotel.id), self.hotel_user.websocket_group)

class TestHubUserModel(TestCase):
    def setUp(self):
        self.user = User()
        self.user.save()
        self.hotel = Hotel(name='Test Hotel')
        self.hotel.save()
        self.hub = Hub(hotel=self.hotel)
        self.hub.save()
        self.hub_user = HubUser(user=self.user, hub=self.hub)
        self.hub_user.save()

    def test_hotel_user_creation(self):
        self.assertEqual(HubUser.objects.count(), 1)
        self.assertTrue(hasattr(HubUser.objects.first(), 'user'))
        self.assertEqual(HubUser.objects.first().user, self.user)
        self.assertTrue(hasattr(HubUser.objects.first(), 'hub'))
        self.assertEqual(HubUser.objects.first().hub, self.hub)

    def test_user_points_to_hotel_user(self):
        self.assertTrue(hasattr(self.user, 'hub_user'))
        self.assertEqual(self.user.hub_user, self.hub_user)

    def test_websocket_group(self):
        self.assertEqual('hub-{}'.format(self.hub_user.hub.id), self.hub_user.websocket_group)
