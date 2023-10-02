from typing import Dict, Any
from rest_framework import serializers
from api.models import Gateway, User, Company
from django.contrib.auth import authenticate

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['password', 'username', 'role', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            password=validated_data['password'],
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data['role']
        )
        return user

class GatewaySerializer(serializers.ModelSerializer):
    company_name = serializers.ReadOnlyField(source='company.name') 
    class Meta:
        model = Gateway
        fields = ['id','company','company_name', 'gateway_name', 'antenna_diameter', 'location_name', 'latitude', 'longitude']

    def create(self, validated_data):
        # Check if request and user exist in context
        if 'request' not in self.context or not hasattr(self.context['request'], 'user'):
            raise serializers.ValidationError("Request or user object not found in context.")
        
        user = self.context['request'].user
        if user.role != 'administrator':
            raise serializers.ValidationError("Only administrators can create gateways.")
        
        return super().create(validated_data)

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)

            if not user:
                raise serializers.ValidationError('Invalid credentials. Please try again.')

            if not user.is_active:
                raise serializers.ValidationError('This user has been deactivated.')

        else:
            raise serializers.ValidationError('Must include username and password.')

        data['user'] = user
        return data

class CompanySerializer(serializers.ModelSerializer):
    total_gateway = serializers.SerializerMethodField()
    class Meta:
        model = Company
        fields = ['name', 'address', 'id','total_gateway']
    
    def get_total_gateway(self, obj):
        return obj.gateway_set.count()

    def create(self, validated_data):
        if 'request' not in self.context or not hasattr(self.context['request'], 'user'):
            raise serializers.ValidationError("Request or user object not found in context.")
            
        user = self.context['request'].user
        if user.role != 'administrator':
            raise serializers.ValidationError("Only administrators can create companies.")
            
        return super().create(validated_data)
