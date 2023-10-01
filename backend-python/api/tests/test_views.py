# from django.test import TestCase
# from django.urls import reverse
# from rest_framework import status

# class CustomLoginViewTest(TestCase):
#     def test_custom_login(self):
#         url = reverse('custom_login')
#         response = self.client.post(url, {'username': 'admin', 'password': 'password'})
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

# class RegisterViewTest(TestCase):
#     def test_register_user(self):
#         url = reverse('register_user')
#         response = self.client.post(url, {'username': 'username', 'password': 'testpassword', 'email': 'test@example.com', 'role': 'administrator'})
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

# class CompanyListViewTest(TestCase):
#     def test_create_company(self):
#         url = reverse('company_create')
#         response = self.client.post(url, {'name': 'Test Company', 'address': 'Test Address'})
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

# class GatewayListViewTest(TestCase):
#     def test_list_gateways(self):
#         url = reverse('list_gateways')
#         response = self.client.get(url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_create_gateway(self):
#         url = reverse('list_gateways')
#         response = self.client.post(url, {'company': 1, 'gateway_name': 'Test Gateway', 'antenna_diameter': 2.5, 'location_name': 'Test Location', 'latitude': 12.34, 'longitude': 56.78})
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

# class GatewayDetailsViewTest(TestCase):
#     def test_retrieve_gateway(self):
#         url = reverse('crud_gateway_id', args=[1])
#         response = self.client.get(url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_update_gateway(self):
#         url = reverse('crud_gateway_id', args=[1])
#         response = self.client.put(url, {'company': 1, 'gateway_name': 'Updated Gateway', 'antenna_diameter': 3.0, 'location_name': 'Updated Location', 'latitude': 11.11, 'longitude': 22.22})
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_delete_gateway(self):
#         url = reverse('crud_gateway_id', args=[1])
#         response = self.client.delete(url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
