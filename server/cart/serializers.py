from rest_framework import serializers
from .models import Cart, CartItem
from loguru import logger
from book.models import Book  # Ensure to import the Book model


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['book', 'quantity', 'price', 'cart']

    def validate_quantity(self, value):
        # type: ignore # Get the book ID from the input
        if value <= 0:
            raise serializers.ValidationError(
                {"Quantity must be greater than zero."})
        
        book_id = self.initial_data.get('book') # type: ignore
        if not book_id:
            raise serializers.ValidationError("Book must be specified.")

        # Retrieve the book instance to check stock
        try:
            book_instance = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            raise serializers.ValidationError("Book does not exist.")

        if value > book_instance.stock:
            raise serializers.ValidationError(
                f"Cannot add {value} units of {book_instance.name}. Only {book_instance.stock} in stock."
            )
        return value

    def create(self, validated_data):
        logger.info(f"Creating CartItem with data: {validated_data}")
        cart = validated_data.pop('cart')
        book = validated_data['book']
        quantity = validated_data.get('quantity', 0)

        cart_item, _ = CartItem.objects.get_or_create(cart=cart, book=book)

        cart_item.quantity = quantity
        cart_item.price = book.price

        cart_item.save()
        cart.update_totals()  # Update the cart totals
        return cart_item


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = ['total_price', 'total_quantity',
                  'is_ordered', 'user', 'items']

    # def create(self, validated_data):
    #     items_data = validated_data.pop('items', [])
    #     cart = Cart.objects.create(**validated_data)

    #     for item_data in items_data:
    #         item_data['cart'] = cart
    #         CartItemSerializer.create(CartItemSerializer(), validated_data=item_data | {  # type: ignore
    #                                   'cart': cart})

    #     cart.update_totals()  # Ensure the totals are correct after creation
    #     return cart
