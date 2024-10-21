from rest_framework import serializers
from .models import Book
from loguru import logger

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'name', 'author', 'description', 'user', 'price', 'stock', 'publish_date']

    # def create(self, validated_data):
    #     """
    #     Custom creation logic for Book object.
    #     Automatically assigns the user creating the book as the seller (user).
    #     """
    #     logger.info('ssssssssss')

    #     user = self.context['request'].user  # Retrieve the user from the request context
    #     logger.info(user)
    #     validated_data['user'] = user  # Set the user field
    #     book = Book.objects.create(**validated_data)  # Create the book
    #     return book
