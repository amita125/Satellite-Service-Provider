from django.db import models
from uuid import uuid4
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username,email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    username = models.CharField(max_length=10, unique=True)
    email = models.EmailField(unique=True)

    class RoleType(models.TextChoices):
        ADMINISTRATOR = "administrator", "Administrator"
        OPERATOR = "operator", "Operator"

    role = models.CharField(
        max_length=20,
        choices=RoleType.choices,
        default=RoleType.OPERATOR,
        null=True,
        blank=True,
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['role', 'email']

    def __str__(self):
        return (
            f"{self.username} , {self.role} "
        )
    class Meta:
        db_table = "user"

class Company(models.Model):
    name = models.TextField(unique=True)
    address = models.CharField(max_length=255)
    class Meta:
        db_table = "company"

    def __str__(self):
        return f"{self.name}"

class Gateway(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    gateway_name = models.TextField(unique=True)
    antenna_diameter = models.FloatField()
    location_name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    class StatusType(models.TextChoices):
        ONLINE = "online", "Online"
        OFFLINE = "offline", "Offline"
    status = models.CharField(
        max_length=10,
        choices=StatusType.choices,
        default=StatusType.ONLINE,
        null=True,
        blank=True,
    )

    class Meta:
        db_table = "gateway"
    
    def __str__(self):
        return f"Gateway (ID: {self.pk}): {self.gateway_name}"
