from django.test import TestCase
from api.serializers import UserRegisterSerializer, UserLoginSerializer, CompanySerializer, GatewaySerializer
from api.models import User, Company, Gateway
from api.factories import CompanyFactory

class UserRegisterSerializerTest(TestCase):

    def test_create_user(self):
        data = {'password': 'test_password', 'username': 'test_user', 'role': 'administrator', 'email': 'test@example.com'}
        serializer = UserRegisterSerializer(data=data)

        if not serializer.is_valid():
            print(serializer.errors)

        self.assertTrue(serializer.is_valid())
        user = serializer.save()

        self.assertIsInstance(user, User)
        self.assertEqual(user.username, 'test_user')
        self.assertEqual(user.role, 'administrator')

class UserLoginSerializerTest(TestCase):

    def test_valid_login(self):
        # Create a test user
        test_user = User.objects.create_user(username='testuser', password='testpassword', email='test@test.com')

        # Prepare login data
        login_data = {'username': 'testuser', 'password': 'testpassword'}

        # Initialize the serializer with the login data
        serializer = UserLoginSerializer(data=login_data)

        # Check if the data is valid
        self.assertTrue(serializer.is_valid())

        # Call validate to perform custom validation
        validated_data = serializer.validate(login_data)

        # Check if the user is correct
        self.assertEqual(validated_data['user'], test_user)

    def test_inactive_user(self):
        # Create a test user
        test_user = User.objects.create_user(username='testuser', password='testpassword', email='test@test.com')
        
        # Set the user as inactive
        test_user.is_active = False
        test_user.save()

        # Prepare login data
        login_data = {'username': 'testuser', 'password': 'testpassword'}

        # Initialize the serializer with the login data
        serializer = UserLoginSerializer(data=login_data)

        # Check if the data is valid (should be invalid due to inactive user)
        self.assertFalse(serializer.is_valid())

        # Check if the correct error message is raised
        self.assertIn('invalid credentials. please try again.', serializer.errors['non_field_errors'][0].lower())

# class GatewaySerializerTest(TestCase):

#     def setUp(self):
#         # Create a test user with administrator role
#         self.user = User.objects.create_user(username='admin', password='password', email='test@test.com')
#         self.user.role = 'administrator'
#         self.user.save()

#         self.company = Company.objects.create(
#             name='Test Company',
#             address='Test Address'
#         )
        

#     def test_create_gateway(self):

        
#         request = self.client.request()
#         setattr(request, 'user', self.user)


#         # Prepare gateway data with company ID
#         gateway_data = {
#             'company': self.company.pk,  # Pass the ID of the fake company
#             'gateway_name': 'Test Gateway',
#             'antenna_diameter': 2.5,
#             'location_name': 'Test Location',
#             'latitude': 123.456,
#             'longitude': 789.012
#         }

    
#         # Initialize the serializer with the gateway data and user in context
#         serializer = GatewaySerializer(data=gateway_data, context={'request': request})

       
#         # Check if the data is valid
#         self.assertTrue(serializer.is_valid())

#         # Call create to perform custom validation
#         gateway = serializer.create(gateway_data)

#         # Check if the gateway is created
#         self.assertIsInstance(gateway, Gateway)
#         self.assertEqual(gateway.gateway_name, 'Test Gateway')
#         self.assertEqual(gateway.antenna_diameter, 2.5)
#         self.assertEqual(gateway.location_name, 'Test Location')
#         self.assertEqual(gateway.latitude, 123.456)
#         self.assertEqual(gateway.longitude, 789.012)


class CompanySerializerTest(TestCase):

    def setUp(self):
        # Create a test user with administrator role
        self.user = User.objects.create_user(username='admin', password='password', email='test@test.com')
        self.user.role = 'administrator'
        self.user.save()

    def test_create_company(self):
        # Create a mock request object
        request = self.client.request()
        setattr(request, 'user', self.user)

        # Prepare company data
        company_data = {
            'name': 'Test Company',
            'address': 'Test Address'
        }

        # Initialize the serializer with the company data and mock request in context
        serializer = CompanySerializer(data=company_data, context={'request': request})

        # Check if the data is valid
        self.assertTrue(serializer.is_valid())

        # Call create to perform custom validation
        company = serializer.create(company_data)

        # Check if the company is created
        self.assertIsInstance(company, Company)
        self.assertEqual(company.name, 'Test Company')
        self.assertEqual(company.address, 'Test Address')