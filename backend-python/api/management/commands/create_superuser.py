from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Company

class Command(BaseCommand):
    help = 'Create a superuser with an associated company'

    def handle(self, *args, **options):
        user_model = get_user_model()

        if not user_model.objects.filter(username="admin").exists():
            user_model.objects.create_superuser("admin","admin@qureight.com", "password", role="administrator")
            