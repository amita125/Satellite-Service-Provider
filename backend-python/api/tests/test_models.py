from django.test import TestCase
from ..models import Company, Gateway, User

class YourModelTests(TestCase):

    def setUp(self):
        # Create a test company
        self.company = Company.objects.create(
            name='Test Company',
            address='Test Address'
        )

        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword',
            role=User.RoleType.ADMINISTRATOR
        )

        # Create a test gateway
        self.gateway = Gateway.objects.create(
            company=self.company,
            gateway_name='Test Gateway',
            antenna_diameter=2.4,
            location_name='Test Location',
            latitude=123.456,
            longitude=789.012
        )

    def test_company_creation(self):
        self.assertEqual(self.company.name, 'Test Company')
        self.assertEqual(self.company.address, 'Test Address')

    def test_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertEqual(self.user.role, User.RoleType.ADMINISTRATOR)
        self.assertTrue(self.user.check_password('testpassword'))

    def test_gateway_creation(self):
        self.assertEqual(self.gateway.company, self.company)
        self.assertEqual(self.gateway.gateway_name, 'Test Gateway')
        self.assertEqual(self.gateway.antenna_diameter, 2.4)
        self.assertEqual(self.gateway.location_name, 'Test Location')
        self.assertEqual(self.gateway.latitude, 123.456)
        self.assertEqual(self.gateway.longitude, 789.012)

