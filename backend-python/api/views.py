from rest_framework.views import APIView
from .models import Company, Gateway, User
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from api.serializers import CompanySerializer, GatewaySerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

    
class CustomLoginView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = User.objects.filter(username=username).first()

        if user is None or not user.check_password(password):
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            'refresh': str(refresh),
            'access': access_token,
            'user_id': user.id,
            'username': user.username,
            'role': user.role
        })

class RegisterView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request,*args, **kwargs):
        # Check if the requesting user has the role of 'administrator'
        if request.user.role != 'administrator':
            return Response({'message': 'Only administrators can register users.'}, status=status.HTTP_403_FORBIDDEN)

        # Retrieve the necessary data for user registration from the request
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        role = request.data.get('role')  # Make sure 'role' is passed in the request data

        # Validate the data (e.g., check for required fields, etc.)
        if not all([username, password, email, role]):
            return Response({'message': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the provided role is valid (e.g., 'administrator' or 'operator')
        if role not in [choice[0] for choice in User.RoleType.choices]:
            return Response({'message': 'Invalid role.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the username or email already exists
        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return Response({'message': 'Username or email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user with the specified role
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            role=role
        )

        return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)

class CompanyList(APIView):
    """
    List all companies, or create a new company.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company = Company.objects.all()
        serializer = CompanySerializer(company, many=True)
        return Response(serializer.data)

    def post(self, request) -> Response:
        if request.user.is_authenticated:
            user = request.user
            if user.role != 'administrator':
                return Response({"message" : "Only administrators can create companies."}, status=status.HTTP_403_FORBIDDEN)
            
            name = request.data.get('name')
            address = request.data.get('address')
            
            if not all([name, address]):
                return Response({"message" : "Both name and address are required fields."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if a company with the same name already exists
            if Company.objects.filter(name=name).exists():
                return Response({"message" : "A company with the same name already exists."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = CompanySerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message" : "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

class CompanyDetails(APIView):
    """
    Retrieve, update or delete a company object.
    """

    permission_classes = [IsAuthenticated]
    def get(self, request, pk: str) -> Response:

        try:
            company: Company = Company.objects.get(id=pk)
        except Company.DoesNotExist:
            return Response(
                "The company_id  does not exist", status=status.HTTP_400_BAD_REQUEST
            )
       
        serializer: ModelSerializer[Company] = CompanySerializer(company)
        return Response(serializer.data)

  
    def put(self, request, pk: str) -> Response:
        try:
            company: Company = Company.objects.get(id=pk)
        except Company.DoesNotExist:
            return Response(
                "The company_id does not exist", status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        if user.role != 'administrator':
            return Response(
                "Only administrators can update gateways.", status=status.HTTP_403_FORBIDDEN
            )

        serializer = CompanySerializer(company, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk: str) -> Response:
        try:
            company: Company = Company.objects.get(id=pk)
        except Company.DoesNotExist:
            return Response(
                "The company_id does not exist", status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        if user.role != 'administrator':
            return Response(
                "Only administrators can delete gateways.", status=status.HTTP_403_FORBIDDEN
            )

        company.delete()
        return Response("Company deleted successfully", status=status.HTTP_200_OK)


class GatewayList(APIView):
    """
    List all gateways, or create a new gateway.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        gateways = Gateway.objects.all()
        serializer = GatewaySerializer(gateways, many=True)
        return Response(serializer.data)

    def post(self, request) -> Response:
        if request.user.is_authenticated:
            user = request.user
            if user.role != 'administrator':
                return Response({"message" : "Only administrators can create gateways."}, status=status.HTTP_403_FORBIDDEN)
            
            company = request.data.get('company')
            gateway_name = request.data.get('gateway_name')
            # Check if a gateway with the same name already exists
            if Gateway.objects.filter(gateway_name=gateway_name).exists():
                return Response({"message" : "A gateway with the same name already exists."}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = GatewaySerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message" : "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

class GatewayDetails(APIView):
    """
    Retrieve, update or delete a gateway object.
    """

    permission_classes = [IsAuthenticated]
    def get(self, request, pk: str) -> Response:

        try:
            gateway: Gateway = Gateway.objects.get(id=pk)
        except Gateway.DoesNotExist:
            return Response(
                "The gateway_id does not exist", status=status.HTTP_400_BAD_REQUEST
            )
       
        serializer: ModelSerializer[Gateway] = GatewaySerializer(gateway)
        return Response(serializer.data)

  
    def put(self, request, pk: str) -> Response:
        try:
            gateway: Gateway = Gateway.objects.get(id=pk)
        except Gateway.DoesNotExist:
            return Response(
                "The gateway_id does not exist", status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        if user.role != 'administrator':
            return Response(
                "Only administrators can update gateways.", status=status.HTTP_403_FORBIDDEN
            )

        serializer = GatewaySerializer(gateway, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk: str) -> Response:
        try:
            gateway: Gateway = Gateway.objects.get(id=pk)
        except Gateway.DoesNotExist:
            return Response(
                "The gateway_id does not exist", status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        if user.role != 'administrator':
            return Response(
                "Only administrators can delete gateways.", status=status.HTTP_403_FORBIDDEN
            )

        gateway.delete()
        return Response("Gateway deleted successfully", status=status.HTTP_200_OK)
