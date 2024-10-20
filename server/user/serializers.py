from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.validators import MinLengthValidator
from django.contrib.auth.models import Group
from django.utils.timezone import now
from .utils.utils import get_tokens_for_user
from .models import User
from django.contrib.auth import authenticate


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        validators=[validate_password]
    )

    username = serializers.CharField(
        required=True,
        validators=[MinLengthValidator(3)]
    )

    role = serializers.ChoiceField(
        choices=[('seller', 'Seller'), ('buyer', 'Buyer')], write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password',
                  'first_name', 'last_name', 'is_verified', 'role']
        read_only_fields = ['is_verified']

    def create(self, validated_data):
        role = validated_data.pop('role')
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        # Securely hash the password
        user.set_password(validated_data['password'])
        user.save()

        # Ensure the 'seller' and 'buyer' groups are created
        seller_group, _ = Group.objects.get_or_create(name='seller')
        buyer_group, _ = Group.objects.get_or_create(name='buyer')

        # Assign user to the correct group based on role
        if role == 'seller':
            user.groups.add(seller_group)
        else:
            user.groups.add(buyer_group)

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, required=True, style={
                                     'input_type': 'password'})

    def create(self, validated_data):
        email = validated_data.get('email')
        password = validated_data.get('password')

        user = authenticate(email=email, password=password)
        if user is None:
            raise serializers.ValidationError({
                'message': 'Invalid email or password',
                'status': 'error'
            })
        if not user.is_verified:  # type: ignore
            raise serializers.ValidationError("user is not verified")

        # Update last login time
        user.last_login = now()
        user.save()

        # Generate tokens for the user
        tokens = get_tokens_for_user(user)

        return {
            'data': {
                'id': user.id,  # type: ignore
                'username': user.username,
                'email': user.email,
            },
            'tokens': tokens
        }
