from django.db import models
from user.models import User
from book.models import Book  # Import Book model from user app


class Cart(models.Model):
    total_price = models.PositiveIntegerField(default=0)
    total_quantity = models.PositiveIntegerField(default=0)
    is_ordered = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Cart of {self.user.username} - Total Price: {self.total_price}"
    
    def update_totals(self):
        items = self.items.all() # type: ignore
        self.total_quantity = sum(item.quantity for item in items)
        self.total_price = sum(item.price*item.quantity for item in items)
        self.save()


class CartItem(models.Model):
    # Reference to the Book model
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    cart = models.ForeignKey(
        Cart, on_delete=models.CASCADE, related_name='items')
    quantity = models.PositiveIntegerField(default=0)
    price = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.quantity} x {self.book.name} in {self.cart}"
