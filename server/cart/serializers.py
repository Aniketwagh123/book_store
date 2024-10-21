from rest_framework import serializers
from .models import Cart, CartItem
from loguru import logger


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['book', 'quantity', 'price', 'cart']

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

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        cart = Cart.objects.create(**validated_data)

        for item_data in items_data:
            item_data['cart'] = cart
            CartItemSerializer.create(CartItemSerializer(), validated_data=item_data | {  # type: ignore
                                      'cart': cart})

        cart.update_totals()  # Ensure the totals are correct after creation
        return cart
