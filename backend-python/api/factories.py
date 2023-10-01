
import factory
from .models import Company

class CompanyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Company

    name = factory.Faker('company')
    address = factory.Faker('address')
